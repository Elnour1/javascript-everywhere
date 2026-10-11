import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { Buffer } from "node:buffer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Task, Priority } from "../shared/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, "../../data/tasks.json");

async function readTasks(): Promise<Task[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

function sendJson(res: ServerResponse, status: number, data: unknown): void {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost:3000"}`);
  const method = req.method ?? "GET";

  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const tasksMatch = url.pathname.match(/^\/api\/tasks(?:\/(\d+))?$/);

  if (!tasksMatch) {
    if (url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Task API is running</h1>");
      return;
    }
    sendJson(res, 404, { error: "Route not found" });
    return;
  }

  const idParam = tasksMatch[1] ? Number(tasksMatch[1]) : null;
  const tasks = await readTasks();

  // GET all or GET one
  if (method === "GET") {
    if (idParam === null) {
      sendJson(res, 200, tasks);
      return;
    }
    const found = tasks.find((t) => t.id === idParam);
    if (!found) {
      sendJson(res, 404, { error: `Task ${idParam} not found` });
      return;
    }
    sendJson(res, 200, found);
    return;
  }

  // Unsupported methods like PUT
  if (method === "PUT") {
    res.writeHead(405, {
      "Allow": "GET, POST, PATCH, DELETE",
      "Content-Type": "application/json; charset=utf-8",
    });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  // Parse Body for POST & PATCH
  let bodyStr = "";
  for await (const chunk of req) {
    bodyStr += chunk;
  }

  let body: Record<string, unknown> = {};
  if (["POST", "PATCH"].includes(method)) {
    try {
      body = bodyStr ? (JSON.parse(bodyStr) as Record<string, unknown>) : {};
    } catch {
      sendJson(res, 400, { error: "Invalid JSON payload" });
      return;
    }
  }

  // POST
  if (method === "POST") {
    if (!body || typeof body.title !== "string" || !body.title.trim()) {
      sendJson(res, 400, { error: "title is required and cannot be empty" });
      return;
    }
    const allowedPriorities: Priority[] = ["low", "normal", "high"];
    const priority = (body.priority as Priority) ?? "normal";
    if (!allowedPriorities.includes(priority)) {
      sendJson(res, 400, { error: "priority must be low, normal, or high" });
      return;
    }

    const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newTask: Task = {
      id: nextId,
      title: body.title.trim(),
      priority,
      done: Boolean(body.done),
      dueDate: typeof body.dueDate === "string" && body.dueDate ? body.dueDate : null,
    };
    tasks.push(newTask);
    await writeTasks(tasks);
    sendJson(res, 201, newTask);
    return;
  }

  // PATCH
  if (method === "PATCH") {
    if (idParam === null) {
      sendJson(res, 400, { error: "Task ID required" });
      return;
    }
    const taskIndex = tasks.findIndex((t) => t.id === idParam);
    if (taskIndex === -1) {
      sendJson(res, 404, { error: `Task ${idParam} not found` });
      return;
    }

    const current = tasks[taskIndex]!;
    if (body.priority && !["low", "normal", "high"].includes(body.priority as string)) {
      sendJson(res, 400, { error: "Invalid priority" });
      return;
    }
  if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim() || body.title.trim().length > 120) {
        sendJson(res, 400, { error: "Invalid title (1-120 characters required)" });
        return;
      }
    }

    const updated: Task = {
      ...current,
      title: typeof body.title === "string" ? body.title.trim() : current.title,
      priority: (body.priority as Priority) ?? current.priority,
      done: body.done !== undefined ? (body.done as boolean) : current.done,
      dueDate: body.dueDate !== undefined ? (body.dueDate as string | null) : current.dueDate ?? null,
    };
    tasks[taskIndex] = updated;
    await writeTasks(tasks);
    sendJson(res, 200, updated);
    return;
  }

  // DELETE
  if (method === "DELETE") {
    if (idParam === null) {
      sendJson(res, 400, { error: "Task ID required" });
      return;
    }
    const exists = tasks.some((t) => t.id === idParam);
    if (!exists) {
      sendJson(res, 404, { error: `Task ${idParam} not found` });
      return;
    }

    const remaining = tasks.filter((t) => t.id !== idParam);
    await writeTasks(remaining);
    res.writeHead(204);
    res.end();
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
});

server.listen(3000, () => {
  console.log("Task API server listening on http://localhost:3000");
});
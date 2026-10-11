// =========================================================
// 17.4 — Smoke Test Runner
// =========================================================

import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "./api.js";
import { describeError } from "./http.js";

async function runSmokeTests(): Promise<void> {
  console.log("==========================================");
  console.log("Starting Client API Smoke Suite");
  console.log("==========================================");

  // 1. listTasks
  console.log("\n1. Testing listTasks()...");
  const initial = await listTasks();
  if (initial.ok) {
    console.log(`✓ Fetched ${initial.value.length} tasks successfully.`);
  } else {
    console.error(`✗ listTasks failed:`, describeError(initial.error));
  }

  // 2. createTask (Success)
  console.log("\n2. Testing createTask() [Valid payload]...");
  const created = await createTask({ title: "Build typed smoke suite", priority: "high" });
  let createdId = -1;
  if (created.ok) {
    createdId = created.value.id;
    console.log(`✓ Task created with ID ${createdId}: "${created.value.title}"`);
  } else {
    console.error(`✗ createTask failed:`, describeError(created.error));
  }

  // 3. getTask (Success)
  if (createdId !== -1) {
    console.log(`\n3. Testing getTask(${createdId})...`);
    const fetched = await getTask(createdId);
    if (fetched.ok) {
      console.log(`✓ Retrieved task #${fetched.value.id} [${fetched.value.title}]`);
    } else {
      console.error(`✗ getTask failed:`, describeError(fetched.error));
    }
  }

  // 4. updateTask (Success)
  if (createdId !== -1) {
    console.log(`\n4. Testing updateTask(${createdId})...`);
    const updated = await updateTask(createdId, { done: true });
    if (updated.ok) {
      console.log(`✓ Updated task done status: ${updated.value.done}`);
    } else {
      console.error(`✗ updateTask failed:`, describeError(updated.error));
    }
  }

  // 5. deleteTask (Success)
  if (createdId !== -1) {
    console.log(`\n5. Testing deleteTask(${createdId})...`);
    const deleted = await deleteTask(createdId);
    if (deleted.ok) {
      console.log(`✓ Deleted task #${createdId} successfully (204 handled).`);
    } else {
      console.error(`✗ deleteTask failed:`, describeError(deleted.error));
    }
  }

  // 6. Expected Failure: 404 Not Found
  console.log("\n6. Testing getTask() [Expected 404 Missing Task]...");
  const missing = await getTask(99999);
  if (!missing.ok) {
    console.log(`✓ Correctly handled 404:`, describeError(missing.error));
  } else {
    console.error(`✗ Expected 404, but received success!`);
  }

  // 7. Expected Failure: 400 Bad Request (Missing Title)
  console.log("\n7. Testing createTask() [Expected 400 Missing title]...");
  const invalidTitle = await createTask({ title: "   " });
  if (!invalidTitle.ok) {
    console.log(`✓ Correctly handled 400 (blank title):`, describeError(invalidTitle.error));
  } else {
    console.error(`✗ Expected 400, but received success!`);
  }

  // 8. Expected Failure: 400 Bad Request (Invalid Priority enum)
  console.log("\n8. Testing createTask() [Expected 400 Invalid enum value]...");
  const invalidPriority = await createTask({
    title: "Bad priority",
    // @ts-expect-error deliberately passing invalid enum to trigger server 400
    priority: "super-critical",
  });
  if (!invalidPriority.ok) {
    console.log(`✓ Correctly handled 400 (bad enum):`, describeError(invalidPriority.error));
  } else {
    console.error(`✗ Expected 400, but received success!`);
  }

  console.log("\n==========================================");
  console.log("Smoke suite execution complete.");
  console.log("==========================================");
}

void runSmokeTests();
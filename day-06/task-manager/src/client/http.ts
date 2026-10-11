// =========================================================
// 17.1 — HTTP Client Layer: Safe Result-based Fetch Wrapper
// =========================================================

export type ApiError =
  | { readonly kind: "network"; readonly message: string; readonly code?: string }
  | { readonly kind: "timeout"; readonly ms: number }
  | { readonly kind: "aborted" }
  | { readonly kind: "http"; readonly status: number; readonly statusText: string; readonly serverMessage?: string }
  | { readonly kind: "parse"; readonly status: number; readonly rawText: string }
  | { readonly kind: "shape"; readonly message: string; readonly received: unknown };

export function describeError(err: ApiError): string {
  switch (err.kind) {
    case "network":
      return `[Network Error] ${err.message}${err.code ? ` (${err.code})` : ""}`;
    case "timeout":
      return `[Timeout] Request timed out after ${err.ms}ms`;
    case "aborted":
      return `[Aborted] Request was explicitly aborted by caller`;
    case "http":
      return `[HTTP ${err.status} ${err.statusText}] ${err.serverMessage ?? "No server message"}`;
    case "parse":
      return `[Parse Error] Failed to parse JSON response on HTTP ${err.status}. Raw snippet: ${err.rawText.slice(0, 100)}`;
    case "shape":
      return `[Shape Error] Response JSON failed type guard verification: ${err.message}`;
    default: {
      const _exhaustiveCheck: never = err;
      return `[Unknown Error]: ${JSON.stringify(_exhaustiveCheck)}`;
    }
  }
}

export type Result<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ApiError };

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  guard?: (val: unknown) => val is any;
}

export async function request<T>(
  url: string | URL,
  options: RequestOptions = {}
): Promise<Result<T>> {
  const { timeoutMs = 8000, guard, signal: callerSignal, ...fetchInit } = options;

  // Combine caller signal with timeout signal
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combinedSignal = callerSignal
    ? AbortSignal.any([callerSignal, timeoutSignal])
    : timeoutSignal;

  let res: Response;

  // Layer 1: Network & Abort evaluation
  try {
    res = await fetch(url, { ...fetchInit, signal: combinedSignal });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "TimeoutError") {
        return { ok: false, error: { kind: "timeout", ms: timeoutMs } };
      }
      if (err.name === "AbortError") {
        return { ok: false, error: { kind: "aborted" } };
      }
      const cause = (err as Error & { cause?: { code?: string } }).cause;
      return {
        ok: false,
        error: { kind: "network", message: err.message, code: cause?.code },
      };
    }
    return { ok: false, error: { kind: "network", message: String(err) } };
  }

  // Layer 2: HTTP Status evaluation
  if (!res.ok) {
    let serverMessage: string | undefined;
    try {
      const errJson: unknown = await res.json();
      if (errJson && typeof errJson === "object" && "error" in errJson) {
        serverMessage = String((errJson as { error: unknown }).error);
      }
    } catch {
      // Fallback if error body is not JSON (e.g. HTML 500 error)
      try {
        serverMessage = await res.text();
      } catch {
        // stream unavailable
      }
    }

    return {
      ok: false,
      error: {
        kind: "http",
        status: res.status,
        statusText: res.statusText,
        serverMessage,
      },
    };
  }

  // Handle 204 No Content without reading or parsing body
  if (res.status === 204) {
    return { ok: true, value: undefined as unknown as T };
  }

  // Layer 3: Parse and Shape evaluation
  let rawJson: unknown;
  try {
    rawJson = await res.json();
  } catch {
    const rawText = await res.text().catch(() => "");
    return {
      ok: false,
      error: { kind: "parse", status: res.status, rawText },
    };
  }

  if (guard && !guard(rawJson)) {
    return {
      ok: false,
      error: {
        kind: "shape",
        message: "Data did not satisfy expected runtime type guard",
        received: rawJson,
      },
    };
  }

  return { ok: true, value: rawJson as T };
}
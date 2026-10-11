export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function safeJsonParse(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export async function fetchWithFallback(url: string): Promise<ApiResponse<string>> {
  try {
    if (url.trim().length === 0) {
      throw new Error("URL string cannot be empty");
    }
    return { success: true, data: `Payload fetched from ${url}` };
  } catch (err) {
    // Real Bug Fixed: err was previously typed implicitly as any, and err.message caused errors if non-Error thrown
    return { success: false, error: formatErrorMessage(err) };
  }
}

// Execution verification
async function run(): Promise<void> {
  const res = await fetchWithFallback("https://api.internal/data");
  console.log("Fetch result status:", res.success);
}
void run();
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

export async function retry<T>(fn: () => Promise<T>, times: number): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= times; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
    }
  }
  throw new Error(`Failed after ${times} retries. Error: ${errorMessage(lastErr)}`);
}
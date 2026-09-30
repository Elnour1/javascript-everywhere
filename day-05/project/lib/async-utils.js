export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function withTimeout(promise, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
    // Don't keep Node event loop open if primary promise settles
    if (typeof timer.unref === 'function') timer.unref();
  });

  return Promise.race([promise, timeoutPromise]);
}

export async function retry(fn, maxRetries = 3, delayMs = 50) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`[Retry Warning] Attempt ${attempt} failed: ${err.message}. Retrying in ${delayMs}ms...`);
      if (attempt < maxRetries) {
        await delay(delayMs);
      }
    }
  }
  throw lastError;
}
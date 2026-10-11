// ==========================================
// 6.1 — states.ts — The Status Pattern
// ==========================================

// 1. LoadState union with 5 members (including the 5th member added and handled):
export type LoadState =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "success"; data: string[]; cached: boolean }
  | { status: "error"; error: string; code: number }
  | { status: "refreshing"; previousData: string[] }; // 5th member

// 2. describe(state) with switch and exhaustive default:
export function describe(state: LoadState): string {
  switch (state.status) {
    case "idle":
      return "State is idle. Ready to start.";
    case "loading":
      return `Loading in progress... Started at ${state.startedAt}`;
    case "success":
      return `Loaded ${state.data.length} items successfully (cached: ${state.cached}).`;
    case "error":
      // Reading wrong property test (Recorded error):
      // const bad = state.data;
      // Error TS2339: Property 'data' does not exist on type '{ status: "error"; error: string; code: number; }'.
      return `Failed with code ${state.code}: ${state.error}`;
    case "refreshing":
      return `Refreshing data in background. Current items: ${state.previousData.length}`;
    default: {
      // 3. Exhaustive check:
      // When 5th member was added without a case:
      // Error TS2322: Type '{ status: "refreshing"; previousData: string[]; }' is not assignable to type 'never'.
      const unreachable: never = state;
      return unreachable;
    }
  }
}

console.log(describe({ status: "idle" }));
console.log(describe({ status: "loading", startedAt: Date.now() }));
console.log(describe({ status: "success", data: ["Task 1", "Task 2"], cached: false }));
console.log(describe({ status: "error", error: "Network timeout", code: 504 }));
console.log(describe({ status: "refreshing", previousData: ["Task 1"] }));

// 4. A second discriminated union of my own (Order / Payment flow with 3 members):
export type PaymentState =
  | { status: "pending"; orderId: string; amount: number }
  | { status: "authorized"; orderId: string; transactionId: string }
  | { status: "declined"; orderId: string; reason: string };

export function logPayment(payment: PaymentState): void {
  switch (payment.status) {
    case "pending":
      console.log(`Payment for order ${payment.orderId} is pending ($${payment.amount}).`);
      break;
    case "authorized":
      console.log(`Payment authorized! Transaction ID: ${payment.transactionId}`);
      break;
    case "declined":
      console.log(`Payment declined for order ${payment.orderId}: ${payment.reason}`);
      break;
  }
}

logPayment({ status: "authorized", orderId: "ORD-101", transactionId: "TX-998822" });

// 5. Day 05's Promise.allSettled loop, typed as PromiseSettledResult<...>[]:
async function simulateRequests(): Promise<void> {
  const p1 = Promise.resolve("User data loaded");
  const p2 = Promise.reject(new Error("Failed to fetch preferences"));

  const results: PromiseSettledResult<string>[] = await Promise.allSettled([p1, p2]);

  console.log("\n--- Promise.allSettled Narrowing ---");
  for (const res of results) {
    // Narrowing safely on res.status:
    if (res.status === "fulfilled") {
      // Hover: res is PromiseFulfilledResult<string>
      console.log("Fulfilled with value:", res.value);
    } else {
      // Hover: res is PromiseRejectedResult
      const reason = res.reason instanceof Error ? res.reason.message : String(res.reason);
      console.log("Rejected with reason:", reason);
    }
  }
}

void simulateRequests();
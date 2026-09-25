// ==========================================
// 5.1 setTimeout basics
// ==========================================
console.log("=== 5.1 setTimeout basics ===");

// Prediction order: 100ms fires first, then 200ms, then 300ms
setTimeout(() => console.log("Timer 300ms"), 300);
setTimeout(() => console.log("Timer 100ms"), 100);
setTimeout(() => console.log("Timer 200ms"), 200);

// Extra arguments passed through setTimeout(fn, ms, arg1, arg2)
function greetUser(greeting, user) {
  console.log(`Passed Args: ${greeting}, ${user}!`);
}
setTimeout(greetUser, 150, "Hello", "Sara");

// Cancel a timeout using clearTimeout
const cancelledId = setTimeout(() => {
  console.log("This should NEVER print!");
}, 250);
clearTimeout(cancelledId);

// What happens with setTimeout(sayHi(), 1000):
function sayHi() {
  console.log("sayHi executed immediately!");
  return "result";
}
// sayHi() executes immediately at parse/runtime and returns "result".
// setTimeout receives "result" instead of a function, doing nothing after 1000ms.
setTimeout(sayHi(), 400);

// ==========================================
// 5.2 setInterval countdown
// ==========================================
// Scheduled slightly later to keep terminal outputs readable
setTimeout(() => {
  console.log("\n=== 5.2 setInterval countdown ===");
  let count = 5;

  const intervalId = setInterval(() => {
    console.log(`Countdown: ${count}`);
    count--;

    if (count < 1) {
      clearInterval(intervalId);
      console.log("Lift off 🚀");
    }
  }, 200);
  // Without clearInterval, the interval timer keeps the Node event loop alive indefinitely.
}, 500);

// ==========================================
// 5.3 Delay is a minimum
// ==========================================
setTimeout(() => {
  console.log("\n=== 5.3 Delay is a minimum ===");

  function blockFor(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {}
  }

  const requestedDelay = 100;
  const startTime = Date.now();

  setTimeout(() => {
    const actualDelay = Date.now() - startTime;
    console.log(`Requested delay: ${requestedDelay}ms`);
    console.log(`Actual delay:    ${actualDelay}ms`);
    // Comment:
    // The requested delay specifies the minimum waiting threshold before being queued;
    // because the synchronous while-loop blocked the single thread for 1000ms,
    // the timer callback had to wait for the stack to clear.
  }, requestedDelay);

  // Block the call stack synchronously for 1000ms
  blockFor(1000);
}, 2000);
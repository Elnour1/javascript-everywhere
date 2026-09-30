// ==========================================
// 2.1: Create
// ==========================================
console.log('--- PART 2.1: CREATE ---');

// 1. delay(ms)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 2. delayValue(ms, value)
const delayValue = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

// 3. failAfter(ms, message)
const failAfter = (ms, message) => new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

// 4. Log pending vs settled
const testPromise = delayValue(100, 'Settled Value');
console.log('Immediate status (sync):', testPromise); // Shows <pending>

testPromise.then((val) => {
  console.log('Settled status (async):', testPromise, '| Result:', val);
});


// ==========================================
// 2.2: Settles Once
// ==========================================
// A Promise can settle only once: subsequent resolve/reject calls are silently ignored.
setTimeout(() => {
  console.log('\n--- PART 2.2: SETTLES ONCE ---');

  // Calling resolve twice
  const doubleResolve = new Promise((resolve) => {
    resolve('First resolve wins');
    resolve('Second resolve is ignored');
  });
  doubleResolve.then((res) => console.log('Double resolve test:', res));

  // Calling resolve then reject
  const resolveThenReject = new Promise((resolve, reject) => {
    resolve('Resolved successfully');
    reject(new Error('This reject is completely ignored'));
  });
  resolveThenReject
    .then((res) => console.log('Resolve then reject test:', res))
    .catch((err) => console.error('Should NOT log:', err.message));

  
}, 200);

setTimeout(() => {
  console.log('\n--- PART 2.3: CHAIN ---');

  // 1. Four chained .thens transforming a number
  Promise.resolve(2)
    .then((n) => n * 2)      // 4
    .then((n) => n + 10)     // 14
    .then((n) => n / 2)      // 7
    .then((n) => n ** 2)     // 49
    .then((finalVal) => console.log('Transformed number (49 expected):', finalVal));

  // 2. Chained async steps that return delayValue(...)
  console.log('Chain waiting demonstration started...');
  const start = Date.now();
  delayValue(100, 10)
    .then((val) => {
      console.log(`Step 1 received ${val} at ${Date.now() - start}ms`);
      return delayValue(100, val + 10);
    })
    .then((val) => {
      console.log(`Step 2 received ${val} at ${Date.now() - start}ms`);
      return delayValue(100, val + 10);
    })
    .then((val) => {
      console.log(`Step 3 received ${val} at ${Date.now() - start}ms`);
    });

  // 3. What happens if return is missing?
  // NOTE: If you remove `return`, the function returns `undefined` synchronously,
  // meaning the next .then executes immediately and receives `undefined`.

  // 4. Destructuring directly in .then
  delayValue(50, { name: 'Alice', score: 95 })
    .then(({ name, score }) => {
      console.log(`Destructured: Player ${name} scored ${score}`);
    });
}, 500);

setTimeout(() => {
  console.log('\n--- PART 2.4: ERRORS ---');

  // 1. Throw inside .then and catch 3 steps later
  Promise.resolve('Initial')
    .then(() => {
      throw new Error('Explosion in Step 1');
    })
    .then(() => console.log('Step 2 skipped'))
    .then(() => console.log('Step 3 skipped'))
    .catch((err) => console.log('Caught downstream:', err.message));

  // 2. .catch returning a fallback value so the chain continues
  failAfter(50, 'Temporary network issue')
    .catch((err) => {
      console.log(`Recovered from [${err.message}], returning fallback`);
      return 'Default Fallback Data';
    })
    .then((data) => console.log('Chain continues with:', data));

  // 3. .finally logging "cleanup" on fulfilled & rejected
  delayValue(50, 'Success')
    .finally(() => console.log('Cleanup: Fulfilled chain finished'))
    .then(() => {});

  failAfter(50, 'Failure')
    .catch(() => {})
    .finally(() => console.log('Cleanup: Rejected chain finished'));

  // 4. Reject with string vs real Error
  Promise.reject('I am just a string')
    .catch((err) => {
      console.log('String rejection err.message is:', err.message); // undefined
    });

  Promise.reject(new Error('I am an Error object'))
    .catch((err) => {
      console.log('Error rejection err.message is:', err.message); // "I am an Error object"
    });
 
}, 1100);
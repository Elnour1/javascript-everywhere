
const delayValue = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const failAfter = (ms, message) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

async function runPart4_1() {
  console.log('--- PART 4.1: Promise.all ---');

  // 1. Proving results are in INPUT order regardless of settlement time
  // Delays: 1st is slowest (150ms), 2nd is middle (100ms), 3rd is fastest (50ms)
  const p1 = delayValue(150, 'Result A (150ms)');
  const p2 = delayValue(100, 'Result B (100ms)');
  const p3 = delayValue(50, 'Result C (50ms)');

  const startTime = Date.now();
  const results = await Promise.all([p1, p2, p3]);
  const duration = Date.now() - startTime;

  console.log('Output in input order:', results);
  // 2. Proving duration is the slowest one (~150ms), NOT the sum (~300ms)
  console.log(`Total duration: ${duration}ms (Expected ~150ms, slowest single item)`);

  // 3. One rejection fails the entire .all immediately; other values are lost
  try {
    await Promise.all([
      delayValue(50, 'Data 1'),
      failAfter(30, 'Critical Network Failure'),
      delayValue(100, 'Data 2')
    ]);
  } catch (err) {
    console.log('Promise.all short-circuited with error:', err.message);
    console.log('Note: Data 1 and Data 2 values are completely discarded/lost.');
  }

  // 4. Rebuilt Day 04 loadAll with Promise.all + map
  const ids = [101, 102, 103, 104];
  const loadItem = (id) => delayValue(30, { id, status: 'loaded' });

  // Modern Promise.all approach:
  const loadedItems = await Promise.all(ids.map((id) => loadItem(id)));
  console.log('Rebuilt loadAll result:', loadedItems);


}

async function runPart4_2() {
  console.log('\n--- PART 4.2: Promise.allSettled ---');

  const operations = [
    delayValue(40, 'User profile fetched'),
    failAfter(20, 'Failed to fetch avatar'),
    delayValue(60, 'Notifications loaded'),
    failAfter(50, 'Analytics tracking timed out')
  ];

  const outcomes = await Promise.allSettled(operations);

  outcomes.forEach((outcome, idx) => {
    if (outcome.status === 'fulfilled') {
      console.log(`[Task ${idx + 1}] ✓ Fulfilled: ${outcome.value}`);
    } else {
      console.log(`[Task ${idx + 1}] ✗ Rejected: ${outcome.reason.message}`);
    }
  });

  const failureCount = outcomes.filter((o) => o.status === 'rejected').length;
  console.log(`Total failed operations: ${failureCount} of ${outcomes.length}`);
}

async function runPart4_3() {
  console.log('\n--- PART 4.3: Promise.race & Promise.any ---');

  const slowSuccess = delayValue(150, 'Slow Success (150ms)');
  const fastFailure = failAfter(50, 'Fast Failure (50ms)');

  try {
    await Promise.race([slowSuccess, fastFailure]);
  } catch (err) {
    console.log('Promise.race rejected because fastest settled item was an error:', err.message);
  }

  const slowSuccess2 = delayValue(150, 'Slow Success (150ms)');
  const fastFailure2 = failAfter(50, 'Fast Failure (50ms)');

  const anyWinner = await Promise.any([slowSuccess2, fastFailure2]);
  console.log('Promise.any fulfilled with:', anyWinner);

  try {
    await Promise.any([
      failAfter(30, 'Mirror 1 down'),
      failAfter(20, 'Mirror 2 timeout'),
      failAfter(40, 'Mirror 3 500 error')
    ]);
  } catch (err) {
    console.log('All rejected in Promise.any:');
    console.log(`- Error Name: ${err.name}`);
    console.log(`- errors.length: ${err.errors.length}`);
    console.log(`- Collected messages: ${err.errors.map((e) => e.message).join(' | ')}`);
  }

}

async function main() {
  await runPart4_1();
  await runPart4_2();
  await runPart4_3();
}

main();
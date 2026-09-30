// 1. Named imports
import { add, subtract } from './math.js';

// 2. Renamed with as
import { multiply as prod } from './math.js';

// 3. Namespace import (import * as)
import * as MathLib from './math.js';

// 4. Default imported under two names & verified
import { getCalcFromA } from './consumerA.js';
import { getCalcFromB } from './consumerB.js';

console.log('--- 6.4: ESM IMPORT FORMS ---');
console.log('Add & Subtract:', add(10, 5), subtract(10, 5));
console.log('Renamed multiply:', prod(4, 5));
console.log('MathLib Object.keys:', Object.keys(MathLib));
console.log('Is Default Export identical in both files?', getCalcFromA() === getCalcFromB()); // true

// 5. Dynamic import inside if
const condition = true;
if (condition) {
  const dynamicModule = await import('./math.js');
  console.log('Dynamically imported add result:', dynamicModule.add(100, 200));
}
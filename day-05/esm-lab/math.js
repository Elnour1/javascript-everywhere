export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

export default function calculatorEngine(a, b, op) {
  if (op === '+') return add(a, b);
  if (op === '-') return subtract(a, b);
  if (op === '*') return multiply(a, b);
  return 0;
}
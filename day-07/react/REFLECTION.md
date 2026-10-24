# Project Reflection

### 1. Why is the task card a good candidate for a component?
The task card is an ideal component because it represents a repeatable piece of UI with a consistent structure and design. Extracting it avoids repeating identical markup and styles for every task across the app. It also follows the Single Responsibility Principle, allowing us to pass dynamic props and update the card's appearance or behavior in one single place.

### 2. What happens if a component name starts with a lowercase letter?
React treats JSX elements starting with a lowercase letter as standard built-in HTML tags (like `<div>` or `<span>`). As a result, React will attempt to render a native HTML element instead of invoking your custom function, leading to unexpected behavior or failing to render your component entirely.

### 3. Why do we wrap two sibling elements in `<> </>`?
A React component or JSX expression must return a single root node because JavaScript functions cannot return multiple values without a wrapper, and React's reconciliation process requires a single parent to build the virtual DOM tree. Using a Fragment (`<>...</>`) groups adjacent sibling elements without introducing unnecessary extra DOM nodes (like extra `<div>` tags) that could break flexbox, grid layouts, or semantic markup.
# Day 01 Notes

## 1. What Node.js is & How It Differs from a Browser
- **Node.js**: A JavaScript runtime environment built on Chrome's V8 engine that allows executing JavaScript directly on the operating system outside of a web browser.
- **Difference**: The browser is built for client-side web interaction and provides Web APIs like `window`, `document`, and DOM manipulation. Node.js is built for server-side and system programming, lacking DOM APIs but providing system-level modules like `fs`, `path`, and the global `process` object.

---

## 2. What npm is for
- **npm (Node Package Manager)**: A package manager and registry used to install, share, and manage third-party libraries and dependencies in JavaScript/Node.js projects. It also runs project scripts defined in `package.json`.

---

## 3. The Difference Between Git and GitHub
- **Git**: A local, distributed version control command-line tool installed on your computer to track file history, revisions, and branches.
- **GitHub**: A cloud-based hosting platform for Git repositories that enables remote backups, collaboration, issue tracking, and code reviews.

---

## 4. Commands Learned Today
- `git init`: Initializes a brand new local Git repository in the current folder.
- `git status`: Shows the current working directory and staging area state, displaying tracked/untracked changes.
- `git add <file>` / `git add .`: Stages specific or all modified and untracked files for the next commit.
- `git commit -m "<message>"`: Records staged changes as a snapshot in repository history with a descriptive message.
- `git branch -M main`: Renames the default current branch to `main`.
- `git remote add origin <url>`: Connects the local repository to a remote GitHub repository URL.
- `git remote set-url origin <url>`: Updates an existing remote repository URL.
- `git pull origin main`: Fetches and merges remote commits into the current local branch.
- `git push -u origin main`: Uploads local commits to the remote GitHub repository and sets the upstream tracking branch.
- `git push origin main --force`: Overwrites the remote repository history forcefully with the current local branch state.
- `git rm -f <file>`: Removes a file from both the working directory and Git staging/tracking.
- `node <file.js>`: Executes a JavaScript file via the Node.js runtime in the terminal.

---

## 5. What Broke & How I Fixed It
- **What Broke**: Pushing to the remote repository repeatedly failed with `! [rejected] main -> main (non-fast-forward)` and authentication errors (`remote: Repository not found`). The local history conflicted with the remote `README.md` created on GitHub, and an aborted merge attempt triggered an `unfinished merge (MERGE_HEAD exists)` error. Additionally, unintended screenshot files and `package-lock.json` were tracked in the root directory.
- **How I Fixed It**: 
  1. Resolved the authentication mismatch by setting the exact credentials URL via `git remote set-url origin`.
  2. Cleaned unwanted files locally using PowerShell (`Remove-Item Screenshot*.png` and `git rm -f package-lock.json`).
  3. Ensured correct project structure (`README.md` at root and files inside `day-01/`).
  4. Committed all staged changes with `git commit -m` and ran `git push origin main --force` to align the remote repository cleanly with the local structure.

---

## 6. Answers from Task 3.4
1. **When to use `let` instead of `const`:**
   Use `let` when a variable's value must be reassigned later (such as counters in loops or accumulating values). Use `const` by default for all variables that should maintain a constant reference.

2. **What `typeof []` returns and why it is surprising:**
   It returns `"object"`. This is surprising because arrays feel like a standalone data type, but in JavaScript, arrays are implemented as specialized objects under the hood.

3. **Difference between `===` and `==`:**
   `===` (strict equality) compares both value and data type without coercion. `==` (loose equality) converts operand types before comparing, which can introduce subtle bugs. Always use `===`.

4. **When to use `while` instead of `for`:**
   Use `while` when the number of iterations is indeterminate and execution depends on an external dynamic condition being met. Use `for` when iterating a predictable number of times or looping through a known collection/array.
   ## Why node_modules is not pushed to GitHub
- The `node_modules` directory contains thousands of installed third-party packages, making its size huge.
- Pushing it bloats the repository history and wastes bandwidth.
- Anyone can recreate the exact folder simply by cloning the project and running `npm install`, since all dependencies and versions are tracked inside `package.json`.
## package.json Fields
- **name**: The lowercase, URL-friendly identifier of the project.
- **version**: The current release version following semantic versioning (major.minor.patch).
- **description**: A short summary explaining what the project does (pulled automatically from README).
- **main**: The entry-point script loaded when requiring the package (e.g., `index.js`).
- **scripts**: Custom CLI commands and shortcuts (such as `npm test`).
- **repository**: The source control location (GitHub URL).
- **keywords**: Search tags used to index the project on npm.
- **author**: The name/contact info of the package creator.
- **license**: The legal terms under which the code is shared (e.g., ISC, MIT).
- **bugs & homepage**: Issue tracker and main repository links.
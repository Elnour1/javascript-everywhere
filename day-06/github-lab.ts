// ==========================================
// 14.1 — Read Single GitHub User
// ==========================================

interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  bio: string | null;
  public_repos: number;
}

function isGitHubUser(val: unknown): val is GitHubUser {
  if (typeof val !== "object" || val === null) return false;
  const u = val as Record<string, unknown>;
  return (
    typeof u.login === "string" &&
    typeof u.id === "number" &&
    (u.name === null || typeof u.name === "string") &&
    (u.bio === null || typeof u.bio === "string") &&
    typeof u.public_repos === "number"
  );
}

const GITHUB_USERNAME = "Elnour1";
const headers = { "User-Agent": "Day-06-TypeScript-Lab" };

async function fetchUserProfile(): Promise<void> {
  const url = `https://api.github.com/users/${GITHUB_USERNAME}`;
  const res = await fetch(url, { headers });

  console.log("--- 14.1: Profile Fetch ---");
  console.log("Status:", res.status);
  console.log("OK:", res.ok);
  console.log("StatusText:", res.statusText);
  console.log("Content-Type:", res.headers.get("content-type"));

  // The x-ratelimit-remaining header indicates the number of allowed requests left in the current 60-minute window.
  // For unauthenticated public GitHub API calls, this limit defaults to 60 requests per hour per IP.
  const remaining = res.headers.get("x-ratelimit-remaining");
  console.log("x-ratelimit-remaining:", remaining);

  if (!res.ok) {
    throw new Error(`GitHub request failed with status: ${res.status} (${res.statusText})`);
  }

  const rawData: unknown = await res.json();
  if (!isGitHubUser(rawData)) {
    throw new Error("Received payload does not match GitHubUser contract");
  }

  // Nullable properties handled with nullish coalescing operator (??)
  console.log("User Login:", rawData.login);
  console.log("Name:", rawData.name ?? "—");
  console.log("Bio:", rawData.bio ?? "—");
  console.log("Public Repos:", rawData.public_repos);
}

// ==========================================
// 14.2 — Query Strings & URL Encoding
// ==========================================

interface GitHubRepo {
  name: string;
  language: string | null;
  stargazers_count: number;
}

async function fetchUserRepos(): Promise<void> {
  console.log("\n--- 14.2: Query Strings ---");

  // 1. URL + searchParams for sorting and pagination
  const repoUrl = new URL(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
  repoUrl.searchParams.set("sort", "updated");
  repoUrl.searchParams.set("per_page", "5");

  const res = await fetch(repoUrl.toString(), { headers });
  if (!res.ok) {
    throw new Error(`Repo fetch failed with status: ${res.status}`);
  }

  const repos = (await res.json()) as GitHubRepo[];
  for (const repo of repos) {
    console.log(`Repo: ${repo.name.padEnd(30)} | Lang: ${(repo.language ?? "—").padEnd(12)} | Stars: ${repo.stargazers_count}`);
  }

  // 2. Search query with space and colon
  const searchUrl = new URL("https://api.github.com/search/repositories");
  searchUrl.searchParams.set("q", "user:Elnour1 topic:typescript");
  console.log("\nEncoded Search URL:", searchUrl.toString());
  // In the encoded query string:
  // - The space between user filter and topic is encoded as '+' (or '%20').
  // - The colon ':' is typically preserved or percent-encoded as '%3A'.

  // 3. Hand-built broken URL with an unescaped '&'
  const queryParamValue = "cats & dogs";
  const brokenUrl = `https://api.github.com/search/repositories?q=${queryParamValue}`;
  console.log("Broken hand-built URL:", brokenUrl);
  // Why this breaks: Without encoding, the '&' is treated as a query parameter delimiter,
  // causing the server to parse parameter 'q' as 'cats ' and a non-existent parameter 'dogs' with no value.
}

// ==========================================
// 14.3 — Parallel Fetch with Fallback
// ==========================================

async function fetchMultipleUsers(): Promise<void> {
  console.log("\n--- 14.3: Parallel User Fetch ---");
  const usernames = [GITHUB_USERNAME, "octocat", "this-user-definitely-does-not-exist-9999"];

  const requests = usernames.map(async (uname) => {
    const res = await fetch(`https://api.github.com/users/${uname}`, { headers });
    if (!res.ok) {
      return { username: uname, found: false, status: res.status };
    }
    const data: unknown = await res.json();
    return {
      username: uname,
      found: true,
      user: isGitHubUser(data) ? data : null,
    };
  });

  // Fetch in parallel using Promise.all while preserving input order
  const results = await Promise.all(requests);

  for (const r of results) {
    if (r.found && r.user) {
      console.log(`✓ Found [${r.username}]: Name = ${r.user.name ?? "—"}, Repos = ${r.user.public_repos}`);
    } else {
      console.log(`✗ Missing [${r.username}]: Not found (Status ${r.status})`);
    }
  }
}

// Execution runner
async function main(): Promise<void> {
  await fetchUserProfile();
  await fetchUserRepos();
  await fetchMultipleUsers();
}

void main();
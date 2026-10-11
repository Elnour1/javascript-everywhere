const u = new URL("https://example.com/search");
u.searchParams.set("q", "tom & jerry");
u.searchParams.set("page", "2");
console.log(u.search);
console.log(new URL("/api/tasks?q=a%20b", "http://localhost:3000").searchParams.get("q"));

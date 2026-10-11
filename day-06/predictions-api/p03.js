try {
    await fetch("http://localhost:3999/api/tasks");
    console.log("ok");
}
catch (err) {
    console.log(err instanceof Error ? err.name : "?");
}
export {};

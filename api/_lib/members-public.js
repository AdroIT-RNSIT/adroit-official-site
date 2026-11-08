export async function handleMembers(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end(JSON.stringify({ message: "Method not allowed" }));
    return;
  }
  res.statusCode = 200;
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify({ groups: null }));
}

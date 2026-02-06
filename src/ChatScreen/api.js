export async function sendQueryToAPI(query, sessionId) {
  const payload = sessionId
    ? { query, session_id: sessionId }
    : { query };

  const res = await fetch("https://mcp-python-1.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.json();
}

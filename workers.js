export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // API Route
    if (url.pathname === "/api/users") {

      // Create table if not exists
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        )
      `).run();

      // Insert sample data
      await env.DB.prepare(`
        INSERT INTO users (name)
        VALUES ('Mahnoor')
      `).run();

      // Read data
      const { results } = await env.DB.prepare(`
        SELECT * FROM users
      `).all();

      return Response.json(results);
    }

    // Serve HTML
    return new Response(
      await INDEX_HTML,
      {
        headers: {
          "content-type": "text/html"
        }
      }
    );
  }
};

// HTML content
const INDEX_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Cloudflare D1</title>
</head>
<body>

  <h1>Cloudflare D1 Database Example</h1>

  <button onclick="loadData()">Load Users</button>

  <pre id="output"></pre>

  <script>
    async function loadData() {
      const res = await fetch('/api/users');
      const data = await res.json();

      document.getElementById('output').textContent =
        JSON.stringify(data, null, 2);
    }
  </script>

</body>
</html>
`;
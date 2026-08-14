export async function POST(request) {
  try {
    const body = await request.json();

    const base =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://rd-studio-be-production-atearna2.up.railway.app";
    const backendUrl = `${base.replace(/\/$/, "")}/api/base/auth/signup/`;

    const r = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    const data = text ? JSON.parse(text) : {};

    return new Response(JSON.stringify(data), {
      status: r.ok ? 200 : r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


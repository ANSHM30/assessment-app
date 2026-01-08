const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }

  return res.json();
}

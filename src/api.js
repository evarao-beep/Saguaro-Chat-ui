const BASE = 'http://127.0.0.1:8000/api/v1';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.detail) detail = body.detail;
    } catch {
      // error body wasn't JSON
    }
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export async function startConversation() {
  return request('/conversations', { method: 'POST' });
}

export async function sendMessage(conversationId, text) {
  return request(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message: text }),
  });
}

export async function getHistory(conversationId) {
  return request(`/conversations/${conversationId}`);
}

export async function endConversation(conversationId) {
  return request(`/conversations/${conversationId}/end`, { method: 'POST' });
}
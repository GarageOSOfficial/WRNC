const KIT_API_BASE = 'https://api.kit.com/v4';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function send(response, status, body) {
  response.status(status).json(body);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return send(response, 405, { ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;
  if (!apiKey || !formId) {
    return send(response, 503, { ok: false, error: 'waitlist_not_configured' });
  }

  const email = String(request.body?.email || '').trim().toLowerCase();
  const firstName = String(request.body?.firstName || '').trim();
  const referrer = String(request.body?.referrer || '').trim();

  if (!EMAIL_RE.test(email)) {
    return send(response, 400, { ok: false, error: 'invalid_email' });
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Kit-Api-Key': apiKey,
  };

  try {
    const subscriberResponse = await fetch(`${KIT_API_BASE}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email_address: email,
        ...(firstName ? { first_name: firstName } : {}),
      }),
    });

    if (!subscriberResponse.ok) {
      const details = await subscriberResponse.text();
      console.error('Kit subscriber upsert failed', subscriberResponse.status, details);
      return send(response, 502, { ok: false, error: 'provider_error' });
    }

    const formResponse = await fetch(`${KIT_API_BASE}/forms/${encodeURIComponent(formId)}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email_address: email,
        ...(referrer ? { referrer } : {}),
      }),
    });

    if (!formResponse.ok) {
      const details = await formResponse.text();
      console.error('Kit form subscription failed', formResponse.status, details);
      return send(response, 502, { ok: false, error: 'provider_error' });
    }

    return send(response, 200, { ok: true });
  } catch (error) {
    console.error('Waitlist request failed', error);
    return send(response, 502, { ok: false, error: 'provider_unavailable' });
  }
}

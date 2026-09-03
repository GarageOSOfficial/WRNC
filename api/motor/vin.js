const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;
const MOCK_VIN = '1HGCM82633A004352';

function send(response, status, body) {
  response.status(status).json(body);
}

function sendError(response, status, code, message) {
  send(response, status, { error: { code, message } });
}

async function authenticate(request) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return false;

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return false;

  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authorization, apikey: anonKey },
    });
    return authResponse.ok;
  } catch {
    return false;
  }
}

export default async function handler(request, response) {
  const allowedOrigin = process.env.MOTOR_ALLOWED_ORIGIN?.trim();
  if (allowedOrigin) response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Vary', 'Origin');

  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    sendError(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST for VIN lookup.');
    return;
  }

  if (process.env.MOTOR_SANDBOX_ENABLED !== 'true') {
    sendError(response, 404, 'FEATURE_DISABLED', 'MOTOR sandbox testing is disabled.');
    return;
  }

  if (!(await authenticate(request))) {
    sendError(response, 401, 'AUTH_REQUIRED', 'A valid WRNC session is required.');
    return;
  }

  const vin = typeof request.body?.vin === 'string' ? request.body.vin.trim().toUpperCase() : '';
  if (!VIN_PATTERN.test(vin)) {
    sendError(response, 400, 'INVALID_VIN', 'Enter a valid 17-character VIN.');
    return;
  }

  if (process.env.MOTOR_SANDBOX_MODE === 'mock') {
    if (vin !== MOCK_VIN) {
      sendError(response, 404, 'MOCK_VIN_NOT_FOUND', `Mock mode supports only ${MOCK_VIN}.`);
      return;
    }
    send(response, 200, {
      vin,
      year: 2003,
      make: 'Honda',
      model: 'Accord',
      trim: 'EX V6',
      engine: '3.0L V6',
      transmission: 'Automatic',
      source: 'mock',
    });
    return;
  }

  sendError(
    response,
    503,
    'MOTOR_CONTRACT_REQUIRED',
    'Live MOTOR sandbox lookup requires the approved endpoint, authentication scheme, and response schema.'
  );
}

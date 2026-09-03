import handler from '../../api/motor/vin';

const makeResponse = () => {
  const response: any = {
    setHeader: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
    end: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

describe('MOTOR VIN proxy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MOTOR_SANDBOX_ENABLED = 'true';
    process.env.MOTOR_SANDBOX_MODE = 'mock';
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as jest.Mock;
  });

  it('returns 404 when the server-side flag is disabled', async () => {
    process.env.MOTOR_SANDBOX_ENABLED = 'false';
    const response = makeResponse();
    await handler({ method: 'POST', headers: {}, body: {} } as any, response);
    expect(response.status).toHaveBeenCalledWith(404);
  });

  it('requires a valid WRNC session', async () => {
    const response = makeResponse();
    await handler({ method: 'POST', headers: {}, body: { vin: '1HGCM82633A004352' } } as any, response);
    expect(response.status).toHaveBeenCalledWith(401);
  });

  it('returns the fixed fixture only for the documented mock VIN', async () => {
    const response = makeResponse();
    await handler({ method: 'POST', headers: { authorization: 'Bearer session' }, body: { vin: '1hgcm82633a004352' } } as any, response);
    expect(global.fetch).toHaveBeenCalledWith('https://example.supabase.co/auth/v1/user', expect.objectContaining({ headers: expect.objectContaining({ apikey: 'anon-key' }) }));
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ vin: '1HGCM82633A004352', source: 'mock' }));
  });

  it('fails closed in live mode until the MOTOR contract is supplied', async () => {
    process.env.MOTOR_SANDBOX_MODE = 'live';
    const response = makeResponse();
    await handler({ method: 'POST', headers: { authorization: 'Bearer session' }, body: { vin: '1HGCM82633A004352' } } as any, response);
    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.objectContaining({ code: 'MOTOR_CONTRACT_REQUIRED' }) }));
  });
});

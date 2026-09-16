import { loadConfig } from '../src/config';

describe('loadConfig', () => {
  it('applies defaults when no environment variables are set', () => {
    const config = loadConfig({});

    expect(config.nodeEnv).toBe('development');
    expect(config.port).toBe(3000);
    expect(config.logLevel).toBe('info');
    expect(config.serviceName).toBe('zk-inference-monitor');
  });

  it('reads values from the provided environment', () => {
    const config = loadConfig({
      NODE_ENV: 'production',
      PORT: '8080',
      LOG_LEVEL: 'debug',
      SERVICE_NAME: 'custom-service',
    });

    expect(config).toEqual({
      nodeEnv: 'production',
      port: 8080,
      logLevel: 'debug',
      serviceName: 'custom-service',
    });
  });
});

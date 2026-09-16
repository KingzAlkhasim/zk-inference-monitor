export interface AppConfig {
  nodeEnv: string;
  port: number;
  logLevel: string;
  serviceName: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    nodeEnv: env.NODE_ENV ?? 'development',
    port: Number(env.PORT ?? 3000),
    logLevel: env.LOG_LEVEL ?? 'info',
    serviceName: env.SERVICE_NAME ?? 'zk-inference-monitor',
  };
}

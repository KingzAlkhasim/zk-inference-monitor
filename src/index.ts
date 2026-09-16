import { loadConfig } from './config';

function main(): void {
  const config = loadConfig();
  // eslint-disable-next-line no-console
  console.log(`[${config.serviceName}] starting in ${config.nodeEnv} mode on port ${config.port}`);
}

main();

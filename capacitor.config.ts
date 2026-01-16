import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.solidarmed.app',
  appName: 'NCD PenPlus',
  webDir: '.output/public',
  server: {
    "androidScheme": "http",
    "cleartext": true
  }
};

export default config;

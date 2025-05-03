import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xldranken.app',
  appName: 'XL Dranken',
  webDir: '.next',
  server: {
    url: 'http://localhost:3000',
    cleartext: true
  }
};

export default config;


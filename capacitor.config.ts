import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.619ef9c14a9d44c5a1008033f62ab120',
  appName: 'Reppilot',
  webDir: 'dist',
  server: {
    // Live-reload against the hosted preview so you can test on device
    // without rebuilding. Remove this block for a fully offline store build.
    url: 'https://619ef9c1-4a9d-44c5-a100-8033f62ab120.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  android: {
    backgroundColor: '#0D0D0D',
  },
  ios: {
    backgroundColor: '#0D0D0D',
    contentInset: 'always',
  },
};

export default config;
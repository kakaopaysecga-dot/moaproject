import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.273326013b774c188114958b3a9369c8',
  appName: 'room-and-request',
  webDir: 'dist',
  server: {
    url: 'https://27332601-3b77-4c18-8114-958b3a9369c8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
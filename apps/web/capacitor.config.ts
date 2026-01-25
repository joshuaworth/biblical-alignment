import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.biblicalalignment.app',
  appName: 'Biblical Alignment',
  webDir: 'out',
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
    backgroundColor: '#1a1a2e',
    preferredContentMode: 'mobile'
  },
  android: {
    backgroundColor: '#1a1a2e'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#1a1a2e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1a1a2e'
    }
  },
  server: {
    hostname: 'biblicalalignment.org',
    androidScheme: 'https',
    iosScheme: 'https'
  }
};

export default config;

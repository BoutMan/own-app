import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Extends app.json with values that must not be committed. RevenueCat public SDK keys come from
 * .env (see .env.example); without them the build runs with the store switched off.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  extra: {
    ...config.extra,
    revenueCat: {
      ios: process.env.REVENUECAT_IOS_KEY ?? '',
      android: process.env.REVENUECAT_ANDROID_KEY ?? '',
    },
  },
});

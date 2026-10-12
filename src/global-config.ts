import { paths } from 'src/routes/paths';

import { version } from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  auth: {
    method: 'jwt';
    skip: boolean;
    redirectPath: string;
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Minimal UI',
  appVersion: version,
  serverUrl: import.meta.env.VITE_SERVER_URL ?? 'https://api.asppibra.com',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
  /**
   * Auth
   * @method jwt
   */
  auth: {
    method: 'jwt',
    skip: true,
    redirectPath: paths.dashboard.root,
  },
};

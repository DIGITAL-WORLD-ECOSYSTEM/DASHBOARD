import 'src/global.css';

import { useEffect } from 'react';

import { usePathname } from 'src/routes/hooks';

import { LocalizationProvider } from 'src/locales';
import { themeConfig, ThemeProvider } from 'src/theme';
import { I18nProvider } from 'src/locales/i18n-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

type DevOSAppProps = {
  children: React.ReactNode;
};

/**
 * Composição de provedores exclusiva do DevOS Desktop (Control Plane).
 *
 * Inclui exclusivamente os provedores essenciais para o funcionamento do DevOS:
 * - I18nProvider & LocalizationProvider (Internacionalização e localização)
 * - AuthProvider (Identidade do operador e controle de acesso)
 * - SettingsProvider & ThemeProvider (Tema, paleta e css vars)
 * - MotionLazy (Animações framer-motion)
 * - Snackbar (Notificações do cockpit)
 * - ProgressBar (Indicador visual de navegação)
 * - SettingsDrawer (Gaveta de configurações visuais)
 *
 * NÃO instancia CheckoutProvider nem ChatRealtimeProvider.
 */
export function DevOSApp({ children }: DevOSAppProps) {
  useScrollToTop();

  return (
    <I18nProvider>
      <AuthProvider>
        <SettingsProvider defaultSettings={defaultSettings}>
          <LocalizationProvider>
            <ThemeProvider
              modeStorageKey={themeConfig.modeStorageKey}
              defaultMode={themeConfig.defaultMode}
            >
              <MotionLazy>
                <Snackbar />
                <ProgressBar />
                <SettingsDrawer defaultSettings={defaultSettings} />
                {children}
              </MotionLazy>
            </ThemeProvider>
          </LocalizationProvider>
        </SettingsProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default DevOSApp;

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

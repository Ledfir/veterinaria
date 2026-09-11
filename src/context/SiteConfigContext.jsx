import { createContext, useContext, useEffect, useState } from 'react';
import { getSiteConfig } from '../lib/api';

const SiteConfigContext = createContext();

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await getSiteConfig();
        setConfig(data);

        // Actualizar título del documento
        if (data.site_name) {
          document.title = data.site_name;
        }

        // Actualizar favicon
        if (data.favicon_url) {
          let faviconLink = document.querySelector("link[rel='icon']");
          if (!faviconLink) {
            faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            document.head.appendChild(faviconLink);
          }
          faviconLink.href = data.favicon_url;
        }
      } catch (err) {
        console.error('Error cargando configuración del sitio:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loading }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}

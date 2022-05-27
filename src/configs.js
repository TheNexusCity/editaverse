import editorIcon from './assets/editor-icon.png?url';

// Read configs from meta tags if available, otherwise use the process.env injected from build.
const configs = {};
const get = (configs, key, defaultValue) => {
  const el = document.querySelector(`meta[name='env:${key.toLowerCase()}']`);
  if (el) {
    configs[key] = el.getAttribute('content');
  } else {
    configs[key] = defaultValue;
  }
};

get(configs, 'SERVER_URL', import.meta.env.VITE_SERVER_URL);
get(configs, 'HUBS_SERVER', import.meta.env.VITE_HUBS_SERVER);
get(configs, 'RETICULUM_SERVER', import.meta.env.VITE_RETICULUM_SERVER);
get(configs, 'THUMBNAIL_SERVER', import.meta.env.VITE_THUMBNAIL_SERVER);
get(configs, 'CORS_PROXY_SERVER', import.meta.env.VITE_CORS_PROXY_SERVER);
get(configs, 'NON_CORS_PROXY_DOMAINS', import.meta.env.VITE_NON_CORS_PROXY_DOMAINS);
get(configs, 'SENTRY_DSN', import.meta.env.VITE_SENTRY_DSN);
get(configs, 'GA_TRACKING_ID', import.meta.env.VITE_GA_TRACKING_ID);
get(configs, 'BASE_ASSETS_PATH', import.meta.env.VITE_BASE_ASSETS_PATH);
get(configs, 'DISCORD_CLIENT_ID', import.meta.env.VITE_DISCORD_CLIENT_ID);
get(configs, 'DISCORD_CLIENT_SECRET', import.meta.env.VITE_DISCORD_CLIENT_SECRET);
get(configs, 'DISCORD_REDIRECT', import.meta.env.VITE_DISCORD_REDIRECT);
get(configs, 'DISCORD_AUTHORIZATION_URL', import.meta.env.VITE_DISCORD_AUTHORIZATION_URL);

let public_path = '';
if (configs.BASE_ASSETS_PATH) {
  // eslint-disable-next-line no-undef
  public_path = configs.BASE_ASSETS_PATH;
}

function fixBaseAssetsPath(path) {
  // eslint-disable-next-line no-undef
  if (!path.startsWith(public_path)) {
    // eslint-disable-next-line no-useless-escape
    const matches = path.match(/^([^\/]+\/).+$/);

    if (matches.length > 1) {
      // eslint-disable-next-line no-undef
      return public_path + path.replace(matches[1], '');
    }
  }

  return path;
}

configs.name = 'Webaverse Editor';
configs.longName = 'Webaverse Editor';
configs.icon = () => fixBaseAssetsPath(editorIcon);

export default configs;

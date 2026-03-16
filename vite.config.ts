import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

const normalizeBasePath = (value?: string) => {
  const trimmed = value?.trim();

  if (!trimmed) {
    return '/';
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  return withLeadingSlash.endsWith('/')
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: normalizeBasePath(env.VITE_BASE_PATH),
    plugins: [vue()],
    server: {
      host: '127.0.0.1',
      port: 4173
    },
    preview: {
      host: '127.0.0.1',
      port: 4174
    }
  };
});

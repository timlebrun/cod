import { defineConfig } from 'vite';
import { join } from 'path';

import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	root: './',
	server: {
		open: join(__dirname, 'public', 'index.html'),
	},
	build: {
		rollupOptions: {
			input: join(__dirname, 'public', 'index.html'),
		},
	},
	plugins: [basicSsl()],
});

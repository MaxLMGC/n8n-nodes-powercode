import { configWithoutCloudSupport } from '@n8n/node-cli/eslint';

export default [
	...configWithoutCloudSupport,
	{
		rules: {
			'@n8n/community-nodes/no-runtime-dependencies': 'off',
			'@n8n/community-nodes/valid-peer-dependencies': 'off',
			'@n8n/community-nodes/no-dangerous-functions': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
];

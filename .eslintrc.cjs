/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
  },

  extends: ['eslint:recommended', 'plugin:storybook/recommended'],

  rules: {
    semi: 'error',
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
  },

  overrides: [
    // React
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: ['react', 'jsx-a11y'],
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      rules: {
        // Prop shapes are enforced by TypeScript, not PropTypes.
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react-hooks/exhaustive-deps': 'error',
      },
      settings: {
        react: {
          version: 'detect',
        },
        formComponents: ['Form'],
        linkComponents: [
          { name: 'Link', linkAttribute: 'to' },
          { name: 'NavLink', linkAttribute: 'to' },
        ],
        'import/resolver': {
          typescript: {
            project: './tsconfig.json',
          },
        },
      },
    },

    // TypeScript
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        // The TS-aware version understands type-only imports and enums.
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-imports': [
          'warn',
          { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
        ],
      },
    },

    // Node scripts and config files
    {
      files: ['scripts/**/*.cjs', '*.cjs', '*.config.js'],
      env: { node: true },
      rules: {
        'no-console': 'off',
      },
    },
  ],
};

<<<<<<< HEAD
import tseslint from 'typescript-eslint'
=======
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
>>>>>>> origin/client

export default [
  {
    ignores: [
      '.next/**',
<<<<<<< HEAD
      'out/**',
      'build/**',
      'coverage/**',
      'next-env.d.ts',
      'public/design/**',
      'extract_styles.js',
      'extract_all_styles.js',
      'eslint.config.mjs',
      'next.config.mjs',
      'vitest.config.ts',
      'scripts/**',
      'push_env.js',
      'merge_and_push_env.js',
      '*.js',
      '*.mjs',
      // Sub-apps / packages / infra have their own tsconfigs and ESLint configs
      'apps/**',
      'packages/**',
      'infra/**',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: (await import('typescript-eslint')).parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.json', './tsconfig.app.json'],
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
]
=======
      'node_modules/**',
      'out/**',
      'build/**',
      'coverage/**',
      'design/**',
      'next-env.d.ts',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
>>>>>>> origin/client

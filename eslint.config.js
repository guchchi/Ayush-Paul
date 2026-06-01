import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["src/extract.cjs"],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "prefer-const": "off",
      "no-case-declarations": "off",
      "no-undef": "off",
      "no-restricted-imports": ["error", {
        "paths": [{
          "name": "gray-matter",
          "message": "Architecture Violation: MD files are deprecated. Fetch from Firebase instead."
        }]
      }],
      "no-restricted-syntax": [
        "error",
        {
          "selector": "CallExpression[callee.property.name='glob'][callee.object.property.name='meta'][callee.object.object.name='import']",
          "message": "Architecture Violation: import.meta.glob is forbidden. Do not bulk-load local files."
        },
        {
          "selector": "VariableDeclarator[id.name=/^FALLBACK_|^MOCK_/]",
          "message": "Architecture Violation: Fallback data is forbidden. The UI must gracefully handle empty Firebase states."
        }
      ]
    },
  },
);

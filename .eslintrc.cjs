module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: "eslint:recommended",
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    project: [ './tsconfig.json', './tsconfig.eslint.json' ],
    sourceType: 'module'
  },
  plugins: [ '@typescript-eslint' ],
  rules: {
    "no-empty": "off",
    indent: ["error", 2],
    // quotes: ['error', 'single'],
    semi: ["error", "always"],
    "no-useless-escape": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "no-control-regex": "off",
    "no-console": [
      "error",
      {
        allow: ["log"]
      }
    ]
  },
  overrides: [
    {
      files: [
        '**/*.ts',
        '**/*.tsx',
        '**/*.js',
        '**/*.jsx',
        '**/*.mjs',
        '**/*.cjs',
      ],
    },
    {
      files: [ '**/*.d.ts' ],
      rules: {
        'no-redeclare': 'off',
      },
    },
  ],
  ignorePatterns: [ '**/dist/', '**/lib/', '**/coverage/', '**/package/', '**/docs/', '**/vendor/', '**/node_modules/' ],
};

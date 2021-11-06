"use strict";

module.exports = {
  plugins: ["import", "jest", "jest-formatting" /* , "react-hooks" */],
  overrides: [
    // source files
    {
      files: ["*.{ts,tsx}"],
      extends: [
        "@susisu/eslint-config/preset/ts-types",
        "plugin:eslint-comments/recommended",
        "plugin:import/typescript",
        // "plugin:react-hooks/recommended",
        "prettier",
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      env: {
        es6: true,
        browser: true,
      },
      // settings: {
      //   react: {
      //     version: "detect",
      //   },
      // },
      rules: {
        "sort-imports": ["error", { ignoreDeclarationSort: true }],
        "eslint-comments/no-unused-disable": "error",
        "import/no-default-export": "error",
        "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
        "import/order": ["error", { alphabetize: { order: "asc" } }],
      },
    },
    // test files
    {
      files: ["src/**/*.{test,spec}.{ts,tsx}", "src/**/__tests__/**/*.{ts,tsx}"],
      extends: ["plugin:jest/recommended", "plugin:jest-formatting/recommended"],
      env: {
        "jest/globals": true,
      },
      rules: {
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/require-await": "off",
      },
    },
    // script files
    {
      files: ["*.js"],
      extends: [
        "@susisu/eslint-config/preset/es",
        "plugin:eslint-comments/recommended",
        "prettier",
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "script",
      },
      env: {
        es6: true,
        node: true,
      },
      rules: {
        "eslint-comments/no-unused-disable": "error",
      },
    },
  ],
};

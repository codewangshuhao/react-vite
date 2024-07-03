export default {
  /** Experimental Features */
  experimentalTernaries: true,

  /** Opinionated Configuration Options */
  semi: false,
  singleQuote: true,
  quoteProps: 'consistent',
  htmlWhitespaceSensitivity: 'ignore',
  vueIndentScriptAndStyle: true,

  /** File-specific Configuration Overrides */
  overrides: [
    {
      // Apply JSONC parser for VSCode and TypeScript configuration files
      options: { parser: 'jsonc' },
      files: [
        '**/.vscode/**/*.json',
        '**/.vscode/**/*.code-snippets',
        '**/tsconfig.json',
        '**/tsconfig.*.json',
      ],
    },
    {
      // Enforce single attribute per line for JSX, TSX, and Vue files
      options: { singleAttributePerLine: true },
      files: ['**/*.jsx', '**/*.tsx', '**/*.vue'],
    },
  ],
}

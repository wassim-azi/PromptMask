/**
 * @type {import('prettier').Options}
 */
export default {
  bracketSameLine: true,
  bracketSpacing: true,
  printWidth: 180,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: false,
  quoteProps: "preserve",
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "<BUILTIN_MODULES>", // node.js built-in modules
    "<THIRD_PARTY_MODULES>", // imports not matched by other special words or groups.
    "", // empty line
    "^@plasmo/(.*)$",
    "",
    "^@plasmohq/(.*)$",
    "",
    "^~(.*)$",
    "",
    "^[./]"
  ]
}

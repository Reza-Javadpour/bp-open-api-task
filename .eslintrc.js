module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};

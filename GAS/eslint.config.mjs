import globals from "globals";
import pluginJs from "@eslint/js";
import googleappsscript from "eslint-plugin-googleappsscript";

export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: googleappsscript.environments.googleappsscript.globals,
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  { 
    languageOptions: { 
      globals: { ...globals.browser, ...globals.node } 
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
];
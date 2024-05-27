import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.{ts,tsx,mts,cts}"],
  languageOptions: {
    parserOptions: {
      EXPERIMENTAL_useProjectService: true,
    },
  },
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
});

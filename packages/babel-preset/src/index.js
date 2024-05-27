import { declarePreset } from "@babel/helper-plugin-utils";

export default declarePreset(() => {
  return {
    presets: [
      [import.meta.resolve("@babel/preset-env"), { modules: false }],
      import.meta.resolve("@babel/preset-react"),
      [
        import.meta.resolve("@babel/preset-typescript"),
        { onlyRemoveTypeImports: true },
      ],
    ],
  };
});

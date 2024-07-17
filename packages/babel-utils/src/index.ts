import * as babel from "@babel/core";

export const hasCustomConfig = async (): Promise<boolean> => {
  const { config } = await babel.loadPartialConfigAsync({
    babelrc: false,
    showIgnoredFiles: true,
  });
  return config !== undefined;
};

export const createOptions = async ({
  defaultPresets = [],
  defaultPlugins = [],
  extraPresets = [],
  extraPlugins = [],
  ...options
}: Omit<babel.InputOptions, "presets" | "plugins"> & {
  defaultPresets?: babel.InputOptions["presets"];
  defaultPlugins?: babel.InputOptions["plugins"];
  extraPresets?: babel.InputOptions["presets"];
  extraPlugins?: babel.InputOptions["plugins"];
} = {}): Promise<babel.InputOptions> => {
  const useDefaultPresetsAndPlugins = !(await hasCustomConfig());

  return {
    babelrc: false,
    presets: [
      ...(useDefaultPresetsAndPlugins ? defaultPresets : []),
      ...extraPresets,
    ],
    plugins: [
      ...(useDefaultPresetsAndPlugins ? defaultPlugins : []),
      ...extraPlugins,
    ],
    ...options,
  };
};

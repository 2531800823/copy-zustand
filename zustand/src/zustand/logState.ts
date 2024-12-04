export const logState = (config) => {
  const configWithLogState = (set, get, api) => {
    return config(
      (args) => {
        console.log(args, api);

        set(args);
      },
      get,
      api
    );
  };

  return configWithLogState;
};

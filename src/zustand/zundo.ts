import { createStore } from "zustand";
export const temporal = (config, options) => {
  const configWithTemporal = (set, get, store) => {
    //   在 store 上挂在一个 属性
    store.temporal = createStore(
      options?.wrapTemporal?.(temporalStateCreator(set, get, options)) ||
        temporalStateCreator(set, get, options)
    );

    const curriedHandleSet =
      options?.handleSet?.(store.temporal.getState()._handleSet) ||
      store.temporal.getState()._handleSet;

    const temporalHandleSet = (pastState) => {
      if (!store.temporal.getState().isTracking) return;

      // 这里获取的 get 是下方 set 后的值
      const currentState = options?.partialize?.(get()) || get();
      const deltaState = options?.diff?.(pastState, currentState);

      if (
        !(deltaState === null || options?.equality?.(pastState, currentState))
      ) {
        curriedHandleSet(pastState, undefined, currentState, deltaState);
      }
    };

    // const setState = store.setState;

    // store.setState = (...args) => {
    //   const pastState = options?.partialize?.(get()) || get();
    //   setState(...args);
    //   temporalHandleSet(pastState);
    // };

    return config(
      (...args) => {
        const pastState = options?.partialize?.(get()) || get();
        console.log("🚀 liu123 ~ set:", set);
        set(...args);
        // 这里是主要操作
        temporalHandleSet(pastState);
      },
      get,
      store
    );
  };

  return configWithTemporal;
};

const temporalStateCreator = (userSet, userGet, options) => {
  const stateCreator = (set, get) => {
    return {
      pastStates: options?.pastStates || [],
      futureStates: options?.futureStates || [],
      undo: (steps = 1) => {
        if (get().pastStates.length) {
          // 获取当前数据
          const currentState = options?.partialize?.(userGet()) || userGet();
          // 获取存储的历史数据
          const statesToApply = get().pastStates.splice(-steps, steps);

          //   当做新数据
          const nextState = statesToApply.shift()!;
          //   更新 store
          userSet(nextState);
          //   更新当前记录历史的数据
          set({
            pastStates: get().pastStates,
            futureStates: get().futureStates.concat(
              options?.diff?.(currentState, nextState) || currentState,
              statesToApply.reverse()
            ),
          });
        }
      },
      redo: (steps = 1) => {
        console.log(get().futureStates.length);

        if (get().futureStates.length) {
          // userGet must be called before userSet
          const currentState = options?.partialize?.(userGet()) || userGet();

          const statesToApply = get().futureStates.splice(-steps, steps);

          // If there is length, we know that statesToApply is not empty
          const nextState = statesToApply.shift()!;
          userSet(nextState);
          set({
            pastStates: get().pastStates.concat(
              options?.diff?.(currentState, nextState) || currentState,
              statesToApply.reverse()
            ),
            futureStates: get().futureStates,
          });
        }
      },

      clear: () => {
        set({
          pastStates: [],
          futureStates: [],
        });
      },
      isTracking: true,
      pause: () => {
        set({ isTracking: false });
      },
      resume: () => {
        set({ isTracking: true });
      },
      setOnSave: (_onSave) => set({ _onSave }),
      _onSave: options?.onSave,
      _handleSet: (pastStates, replace, currentState, deltaState) => {
        if (options?.limit && get().pastStates.length >= options?.limit) {
          get().pastStates.shift();
        }

        get()._onSave?.(pastStates, currentState);
        // 存储旧数据
        set({
          pastStates: get().pastStates.concat(deltaState || pastStates),
          futureStates: [],
        });
      },
    };
  };

  return stateCreator;
};

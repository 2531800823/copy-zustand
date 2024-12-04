import * as React from "react";
const useStore = (api, selector = (a) => a) => {
  console.log("🚀 liu123 ~ api:", api);
  const slice = React.useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState())
  );
  React.useDebugValue(slice);
  return slice;
};

export const create = (createState) => {
  return createState ? createImpl(createState) : createImpl;
};

const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector?: any) => useStore(api, selector);
  Object.assign(useBoundStore, api);

  return useBoundStore;
};

export const createStore = (createState) => {
  return createState ? createStoreImpl(createState) : createStoreImpl;
};

/**
 * 创建一个具有状态管理功能的 store
 * @param createState 初始化状态的函数，接受 setState, getState 和 api 作为参数
 * @returns 返回一个包含状态管理方法的 store
 */
const createStoreImpl = (createState) => {
  let state;
  // 添加事件
  const listeners = new Set();

  /**
   * 更新 store 的状态
   * @param partial 部分状态对象，用于更新当前状态
   * @param replace 是否替换整个当前状态，默认为 false
   */
  const setState = (partial, replace) => {
    debugger;
    const nextState = typeof partial === "function" ? partial(state) : partial;

    if (!Object.is(nextState, state)) {
      const previousState = state;
      // 判断 replace 是否存在，并且 nextState 不是对象或 null
      state =
        replace ?? (typeof nextState !== "object" || nextState === null)
          ? nextState
          : Object.assign({}, state, nextState);

      // 触发更新
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  /**
   * 获取当前的 state
   * @returns 当前的状态对象
   */
  const getState = () => state;

  /**
   * 获取初始状态
   * @returns 初始状态对象
   */
  const getInitialState = () => initialState;

  /**
   * 订阅状态变化
   * @param listener 当状态变化时调用的回调函数
   * @returns 一个函数，调用它可以取消订阅
   */
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  // 定义 API 对象，包含状态管理和订阅方法
  const api = {
    setState,
    getState,
    getInitialState,
    subscribe,
  };

  // 初始化状态
  const initialState = (state = createState(setState, getState, api));
  return api;
};

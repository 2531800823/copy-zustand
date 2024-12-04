import React from "react";

/** useLocalStorage */
function useLocalStorage() {
  let update;
  const subscript = (callback) => {
    update = callback;
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener("storage", callback);
    };
  };

  let state;

  const slice = React.useSyncExternalStore(subscript, () => {
    const count = window.localStorage.getItem("count") ?? 0;
    state = count;
    return state;
  });
  console.log("🚀 liu123 ~ slice:", slice);

  return [
    slice,
    (newState) => {
      if (typeof newState === "function") {
        const newVal = newState(state);
        window.localStorage.setItem("count", newVal);
        //   触发 localstorage 事件
        state = newVal;
        update();
      }
    },
  ];
}
export default useLocalStorage;

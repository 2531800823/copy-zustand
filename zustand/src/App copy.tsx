import { useState } from "react";
import { create } from "zustand";
// import { create } from "./zustand";
import useLocalStorage from "./hooks/useLocalStorage";
import { logState } from "./zustand/logState";

const useBearStore = create(
  logState((set) => ({
    bears: 1,
    increasePopulation: () =>
      set((state) => {
        return { bears: 1 };
      }),
    removeAllBears: () => set({ bears: 0 }),
  }))
);

function App() {
  const bears = useBearStore((state) => state.bears);
  const increasePopulation = useBearStore((state) => state.increasePopulation);

  // const [state, setState] = useLocalStorage();
  return (
    <div>
      {bears}
      <button
        onClick={() => {
          increasePopulation();
        }}
      >
        Add a bear
      </button>

      {/* <div style={{ width: 100, height: 100, border: "1px solid red" }}>
        {state}
        <button
          onClick={() => {
            setState((state) => Number(state) + 1);
          }}
        >
          Add a bear
        </button>
      </div> */}
    </div>
  );
}

export default App;

// import { useSyncExternalStore } from "react";

// export default function TodosApp() {
//   const todos = useSyncExternalStore(
//     todosStore.subscribe,
//     todosStore.getSnapshot
//   );
//   return (
//     <>
//       <button onClick={() => todosStore.addTodo()}>Add todo</button>
//       <hr />
//       <ul>
//         {todos.map((todo) => (
//           <li key={todo.id}>{todo.text}</li>
//         ))}
//       </ul>
//     </>
//   );
// }

// // 这是一个第三方 store 的例子，
// // 你可能需要把它与 React 集成。

// // 如果你的应用完全由 React 构建，
// // 我们推荐使用 React state 替代。

// let nextId = 0;
// let todos = [{ id: nextId++, text: "Todo #1" }];
// let listeners = [];

// export const todosStore = {
//   addTodo() {
//     todos = [...todos, { id: nextId++, text: "Todo #" + nextId }];
//     emitChange();
//   },
//   subscribe(listener) {
//     console.log("🚀 liu123 ~ listener:", listener);
//     listeners = [...listeners, listener];
//     return () => {
//       listeners = listeners.filter((l) => l !== listener);
//     };
//   },
//   getSnapshot() {
//     return todos;
//   },
// };

// function emitChange() {
//   for (let listener of listeners) {
//     listener();
//   }
// }

import { create } from "./zustand";
import { temporal } from "./zustand/zundo";

// Define the type of your store state (typescript)
interface StoreState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}

// Use `temporal` middleware to create a store with undo/redo capabilities
const useStoreWithUndo = create<StoreState>()(
  temporal((set) => {
    console.log("🚀 liu123 ~ set:", set);
    return {
      bears: 0,
      increasePopulation: () => set(({ bears }) => ({ bears: bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
    };
  })
);

const App = () => {
  const { bears, increasePopulation, removeAllBears } = useStoreWithUndo();
  // See API section for temporal.getState() for all functions and
  // properties provided by `temporal`, but note that properties, such as `pastStates` and `futureStates`, are not reactive when accessed directly from the store.
  const { undo, redo, clear } = useStoreWithUndo.temporal.getState();

  return (
    <>
      bears: {bears}
      <button onClick={() => increasePopulation()}>increase</button>
      <button onClick={() => removeAllBears()}>remove</button>
      <button onClick={() => undo()}>undo</button>
      <button onClick={() => redo()}>redo</button>
      <button onClick={() => clear()}>clear</button>
    </>
  );
};
export default App;

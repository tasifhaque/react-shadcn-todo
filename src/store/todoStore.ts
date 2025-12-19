import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TodoType = {
  id: string;
  title: string;
  description: string;
  date: string;
  complete: boolean;
  createdAt: string;
  updatedAt: null | string;
};

type TodoStoreType = {
  todo: TodoType[];
  setTodo: (todos: TodoType[]) => void;
  removeTodo: () => void;
  createTodo: (todo: Partial<TodoType>) => void;
  getTodo: (id: string) => TodoType | undefined;
  updateTodo: (id: string, todo: Partial<TodoType>) => void;
  deleteTodo: (id: string) => void;
};

export const useTodoStore = create<TodoStoreType>()(
  persist(
    (set, get) => ({
      todo: [],
      setTodo: (todos) => {
        set({ todo: todos });
      },
      removeTodo: () => {
        set({ todo: [] });
      },
      createTodo: (todo) => {
        set({
          todo: [
            ...get().todo,
            {
              id: todo.id!,
              title: todo.title!,
              description: todo.description!,
              date: todo.date!,
              complete: todo.complete!,
              createdAt: todo.createdAt!,
              updatedAt: todo.updatedAt!,
            },
          ],
        });
      },
      getTodo: (id) => {
        return get().todo.find((t) => {
          return t.id === id;
        });
      },
      updateTodo: (id, todo) => {
        const findTodo = get().todo.find((to) => {
          return to.id === id;
        });
        const otherTodos = get().todo.filter((to) => {
          return to.id !== id;
        });

        if (findTodo) {
          const updatedTodo: TodoType = {
            id: findTodo.id,
            title: todo.title!,
            description: todo.description!,
            date: todo.date!,
            complete: todo.complete!,
            createdAt: findTodo.createdAt,
            updatedAt: new Date().toISOString(),
          };
          set({ todo: [...otherTodos, updatedTodo] });
        }
      },
      deleteTodo: (id) => {
        const filteredTodo = get().todo.filter((to) => {
          return to.id !== id;
        });
        set({ todo: [...filteredTodo] });
      },
    }),
    { name: "todo" }
  )
);

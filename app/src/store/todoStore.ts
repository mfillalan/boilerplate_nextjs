import { create } from 'zustand';

type Todo = {
  id: number;
  task: string;
  completed: boolean;
};

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string;
  fetchTodos: () => Promise<void>;
  addTodo: (task: string) => Promise<void>;
  updateTodo: (id: number, completed: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  isLoading: false,
  error: '',

  fetchTodos: async () => {
    set({ isLoading: true, error: '' });
    try {
      const res = await fetch('/api/get-todos');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        set({ todos: data, isLoading: false });
      } else {
        console.error('API did not return an array:', data);
        set({ 
          todos: [], 
          isLoading: false, 
          error: 'Data format error: Expected an array' 
        });
      }
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      set({ 
        todos: [], 
        isLoading: false, 
        error: 'Failed to load todos' 
      });
    }
  },

  addTodo: async (task: string) => {
    if (!task.trim()) return;
    try {
      set({ isLoading: true, error: '' });
      await fetch('/api/add-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });
      
      // Refresh todos after adding
      const res = await fetch('/api/get-todos');
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ todos: data });
      }
    } catch (err) {
      console.error('Failed to add todo:', err);
      set({ error: 'Failed to add todo' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTodo: async (id: number, completed: boolean) => {
    try {
      set({ isLoading: true, error: '' });
      await fetch('/api/update-todo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed }),
      });
      
      // Refresh todos after updating
      const res = await fetch('/api/get-todos');
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ todos: data });
      }
    } catch (err) {
      console.error('Failed to update todo:', err);
      set({ error: 'Failed to update todo' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTodo: async (id: number) => {
    try {
      set({ isLoading: true, error: '' });
      await fetch('/api/delete-todo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      // Refresh todos after deleting
      const res = await fetch('/api/get-todos');
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ todos: data });
      }
    } catch (err) {
      console.error('Failed to delete todo:', err);
      set({ error: 'Failed to delete todo' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
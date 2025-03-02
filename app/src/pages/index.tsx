import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useTodoStore } from '@/store/todoStore';

export default function Home() {
  const { todos, isLoading, error, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodoStore();
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await addTodo(newTask);
    setNewTask('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 underline">TODO List</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">{error}</div>}
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 mb-4">
        <div className="md:col-span-8">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
          />
        </div>
        <div className="md:col-span-4">
          <Button type="submit" onClick={handleAddTodo} className="w-full">
            Add TODO
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <p>Loading todos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(todos) && todos.length > 0 ? (
            todos.map((todo) => (
              <div key={todo.id} className="border rounded p-4 flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => updateTodo(todo.id, e.target.checked)}
                  className="mr-2"
                />
                <span className={todo.completed ? 'line-through' : ''}>
                  {todo.task}
                </span>
                <Button
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-auto bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <p className="col-span-full">No todos found</p>
          )}
        </div>
      )}
    </div>
  );
}
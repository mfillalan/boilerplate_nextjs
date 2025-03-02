import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { handleApiError } from '../../../lib/prisma-error-handler';

type Data = {
  message?: string;
  error?: string;
  [key: string]: any; // To allow returning the todo object
};

// Expected request body
interface AddTodoBody {
  task: string;
}

// Extend the NextApiRequest type to include the expected body
interface AddTodoRequest extends NextApiRequest {
  body: AddTodoBody;
}

export default async function handler(req: AddTodoRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { task } = req.body;
    
    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }
    
    try {
      // Use Prisma client to create a new todo
      const newTodo = await prisma.todos.create({
        data: {
          task,
          completed: false
        }
      });
      
      // Return the newly created todo
      return res.status(201).json(newTodo);
    } catch (error) {
      // Using our centralized error handler instead of custom error handling
      handleApiError(error, res);
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}
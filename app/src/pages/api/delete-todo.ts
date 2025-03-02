import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { handleApiError } from '../../../lib/prisma-error-handler';

type Data = {
  message?: string;
  error?: string;
};

// Expected request body
interface DeleteTodoBody {
  id: number;
}

// Extend the NextApiRequest type to include the expected body
interface DeleteTodoRequest extends NextApiRequest {
  body: DeleteTodoBody;
}

export default async function handler(req: DeleteTodoRequest, res: NextApiResponse<Data>) {
  if (req.method === 'DELETE') {
    const { id } = req.body;
    
    if (id === undefined) {
      return res.status(400).json({ message: 'ID is required' });
    }
    
    try {
      // Using Prisma to delete a todo
      // Note: Converting id to number since it might come as a string from req.body
      const todoId = id;
      
      const deletedTodo = await prisma.todos.delete({
        where: {
          id: todoId,
        },
      });
      
      return res.status(200).json({ message: 'Todo deleted' });
    } catch (error) {
      // Use our reusable error handler
      handleApiError(error, res);
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

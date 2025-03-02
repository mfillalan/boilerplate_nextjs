import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { handleApiError } from '../../../lib/prisma-error-handler';

type Data = {
  message?: string;
  error?: string;
  todo?: any;
};

// Expected request body
interface UpdateTodoBody {
  id: number;
  completed: boolean;
}

// Extend the NextApiRequest type to include the expected body
interface UpdateTodoRequest extends NextApiRequest {
  body: UpdateTodoBody;
}

export default async function handler(
  req: UpdateTodoRequest, // Use the extended type
  res: NextApiResponse<Data>
) {
  if (req.method === 'PUT') {
    const { id, completed } = req.body;
    
    if (id === undefined) {
      return res.status(400).json({ message: 'ID is required' });
    }
    
    try {
      const todo = await prisma.todos.update({
        where: {
          id: id
        },
        data: {
          completed
        }
      });
      
      return res.status(200).json({ todo });
    } catch (error) {
      handleApiError(error, res);
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

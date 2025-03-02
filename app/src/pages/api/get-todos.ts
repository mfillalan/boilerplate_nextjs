import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../lib/prisma";
import { handleApiError } from '../../../lib/prisma-error-handler';

type Data = {
  message?: string;
  error?: string;
  [key: string]: any; // To allow returning the todo object
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    try {
      // Using Prisma to get all todos
      const todosList = await prisma.todos.findMany();

      // Return the todos as JSON
      return res.status(200).json(todosList);
    } catch (error) {
      handleApiError(error, res);
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
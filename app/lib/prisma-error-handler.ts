import { NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';

type ErrorResponse = {
  message?: string;
  error?: string;
};

/**
 * Handle Prisma errors and return appropriate HTTP responses
 * @param error The caught error from Prisma operation
 * @param res The NextJS response object 
 * @returns boolean indicating if the error was handled
 */
export function handlePrismaError(
  error: unknown, 
  res: NextApiResponse<ErrorResponse>
): boolean {
  // Known Prisma errors with error codes
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025': // Record not found
        res.status(404).json({ message: 'Resource not found' });
        return true;
      
      case 'P2002': // Unique constraint failed
        res.status(409).json({ 
          error: `Unique constraint violation: ${(error.meta?.target as string[])?.[0] || 'Unknown field'}` 
        });
        return true;
      
      case 'P2003': // Foreign key constraint failed
        res.status(409).json({ 
          error: 'Foreign key constraint violation' 
        });
        return true;
        
      case 'P2014': // Foreign key constraint violation
        res.status(409).json({ 
          error: 'Foreign key constraint violation' 
        });
        return true;
        
      default:
        console.error(`Unhandled Prisma error code: ${error.code}`, error);
        res.status(500).json({ error: 'Database request error' });
        return true;
    }
  } 
  
  // Validation errors in the query
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ error: 'Invalid query parameters or data' });
    return true;
  }
  
  // Unknown request errors
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    console.error('Database request failed:', error);
    res.status(500).json({ error: 'Database request failed' });
    return true;
  }
  
  // Initialization errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error('Failed to initialize database connection:', error);
    res.status(500).json({ error: 'Database connection failed' });
    return true;
  }
  
  // If we get here, it's not a recognized Prisma error
  return false;
}

/**
 * Complete API error handler that logs unknown errors
 */
export function handleApiError(
  error: unknown, 
  res: NextApiResponse<ErrorResponse>
): void {
  const handled = handlePrismaError(error, res);
  
  if (!handled) {
    console.error('Unhandled API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

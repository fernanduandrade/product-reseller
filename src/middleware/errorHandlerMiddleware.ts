import { Request, Response, NextFunction } from 'express'

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => { // responding to client
  console.log(error); 
    // Returning the status and error message to client
  return res.status(400).json({ messega: error.message}) 
}

export default errorHandler
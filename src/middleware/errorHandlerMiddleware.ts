import { Request, Response, NextFunction } from 'express'

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => { // responding to client
  return res.status(503)
                .json({
                  error: true,
                  message: process.env.ENVIRONMENT === 'DEVELOPMENT'
                    ? error.message
                    : 'Service unavaliable, contact the suport team.'
                }) 
}

export default errorHandler
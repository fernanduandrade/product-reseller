import { Request, Response, NextFunction } from 'express'

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => { // responding to client
  return res.status(500)
                .json({
                  error: true,
                  message: process.env.ENVIRONMENT === 'DEVELOPMENT'
                    ? error.message
                    : 'Service unavaliable'
                }) 
}

export default errorHandler
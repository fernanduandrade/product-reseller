import ApiError from "../helpers/apiError"
import { Request, Response, NextFunction } from 'express'

export const notFoundRouter = (req: Request, res: Response, next: NextFunction) => {
  const error = { error: true, message: new ApiError(`Requested not found`, 404) }
  res.status(404).json(error)
}
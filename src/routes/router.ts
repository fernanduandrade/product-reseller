import { Express } from "express"
import EmployeeController from '../controllers/employee.controller'
import SaleController from '../controllers/sale.controller'
import { notFoundRouter } from "../middleware/notFoundRouteMiddleware"
import errorHandler from "../middleware/errorHandlerMiddleware"

const routerSetup = (app: Express) => {
  app
  .use('/api/v1/employees', EmployeeController)
  .use('/api/v1/sales', SaleController)
  .use(errorHandler)
  .all('*', notFoundRouter)
}

export default routerSetup
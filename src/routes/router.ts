import { Express } from "express"
import EmployeeRoutes from '../controllers/employee.controller'
import SaleRoutes from '../controllers/sale.controller'
import { notFoundRouter } from "../middleware/notFoundRouteMiddleware"
 
const routerSetup = (app: Express) => {
  app
  .use('/api/v1/employees', EmployeeRoutes)
  .use('/api/v1/sales', SaleRoutes)
  .all('*', notFoundRouter)
}

export default routerSetup
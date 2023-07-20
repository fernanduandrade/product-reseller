import { Express } from "express"
import EmployeeRoutes from '../controllers/employee.controller'
import SaleRoutes from '../controllers/sale.controller'

const routerSetup = (app: Express) => {
  app
  .use('/api/employees', EmployeeRoutes)
  .use('/api/sales', SaleRoutes)
}

export default routerSetup
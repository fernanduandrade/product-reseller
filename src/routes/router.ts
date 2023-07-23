import { Express } from "express"
import EmployeeRoutes from '../controllers/employee.controller'
import SaleRoutes from '../controllers/sale.controller'
import ApiError from '../helpers/apiError'
 
const routerSetup = (app: Express) => {
  app
  .use('/api/v1/employees', EmployeeRoutes)
  .use('/api/v1/sales', SaleRoutes)
  .all('*', (req, res, next) => {
    const error = { error: true, message: new ApiError(`Requested not found`, 404) }
    res.status(404).json(error)
  })
}

export default routerSetup
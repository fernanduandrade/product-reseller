import { Express, Request, Response } from "express"
import EmployeeRoutes from '../controllers/employee.controller'

const routerSetup = (app: Express) => {
  app
  .get('/', async (req: Request, res: Response) => {
    res.send('Hello Express APIvantage!');
  })
  .use('/api/employees', EmployeeRoutes)
}

export default routerSetup
import cors from 'cors'
import { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

console.log(process.env.SERVER_PORT)

const securitySetup = (app: Express, express: any) => {
  if(process.env.ENVIROMENMENT === 'DEVELOPMENT')
    app.use(morgan('dev'))
  app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(helmet())
  
  return app
}
  

export default securitySetup
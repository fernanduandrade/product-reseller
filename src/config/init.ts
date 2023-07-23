import { Express } from 'express'
import workerManager from '../queue/workerManager'
import loadEnvironment from '../env.config'

loadEnvironment()

const appSetup = (app: Express) => {
  const APP_PORT =  process.env.SERVER_PORT || 3009
  
  app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}`)
  })
  
  workerManager.init()
}

export default appSetup
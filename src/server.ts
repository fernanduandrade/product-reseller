import express, { Express } from 'express'
import routerSetup from './routes/router'
import appSetup from './config/init';
import securitySetup from './config/security';

const app: Express = express()

appSetup(app);
securitySetup(app, express);
routerSetup(app);

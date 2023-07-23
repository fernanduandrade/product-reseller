import dotenv from 'dotenv'

const loadEnvironment = () => {
  const envFile = `.env.${process.env.NODE_ENV}` || 'development'
  dotenv.config({ path: envFile })
}

export default loadEnvironment
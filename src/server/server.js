import express from 'express';
import { router } from './routes/routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const server = express()
  .use(cookieParser())
  .use(express.json())
  .use(cors({credentials: true, origin: true}))
  .use(router);

export { server };
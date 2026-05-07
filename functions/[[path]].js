import { createRequestHandler } from '@remix-run/vercel';
import * as build from '../build/server/index.js';

export default createRequestHandler({
  build,
  mode: process.env.NODE_ENV
});

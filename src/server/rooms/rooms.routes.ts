import * as express from 'express';
import { RoomsController } from './rooms.controller';

export const routes = express.Router();

const controller = new RoomsController();

routes.post('/create',       controller.create);

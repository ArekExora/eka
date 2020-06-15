import * as express from 'express';
import { RoomsController } from './rooms.controller';

export const routes = express.Router();

const controller = new RoomsController();

routes.post('/create',      controller.create);
routes.get('/list',         controller.getRoomList);
routes.get('/details/:id',  controller.getRoom);

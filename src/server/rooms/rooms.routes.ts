import * as express from 'express';
import { RoomsController } from './rooms.controller';


const controller = new RoomsController();

export const roomsRoutes = express.Router();
roomsRoutes.post('/create',      controller.create);
roomsRoutes.get('/list',         controller.getRoomList);
roomsRoutes.get('/details/:id',  controller.getRoom);

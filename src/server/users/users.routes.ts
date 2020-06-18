import * as express from 'express';
import { UsersController } from './users.controller';


const controller = new UsersController();

export const usersRoutes = express.Router();
usersRoutes.post('/login',       controller.login);
usersRoutes.post('/register',    controller.register);
usersRoutes.post('/reconnect',   controller.reconnect);

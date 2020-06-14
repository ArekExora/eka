import * as express from 'express';
import { UsersController } from './users.controller';

export const routes = express.Router();

const controller = new UsersController();

routes.post('/login',       controller.login);
routes.post('/register',    controller.register);

import {Router} from 'express';
import * as appController from '../controllers/appControllers';
import * as logoutController from '../controllers/logoutControllers';




const routes= Router();

routes.get('/',appController.showHome)
routes.get('/register',appController.showRegister)
routes.post('/register-send',appController.register)
routes.get('/loggedArea',appController.testLoggedArea)
routes.get('/confirmation',appController.showConfirmation)
routes.post('/confirmation',appController.confirmatedUser)
routes.post('/login',appController.login)
routes.get('/newPassword',appController.showRegisterNewPass)
routes.post('/newPassword',appController.sendEmailNewPass)
routes.get('/newPassword/create/:token',appController.showCreateNewPass)
routes.post('/newPassword/create/:token',appController.createNewPass)
routes.get('/chat',appController.showChat)
routes.get('/logout',logoutController.logoutUser)
routes.get('/editUser',appController.showEditUser)
routes.post('/editUser',appController.editUser)


export default routes
import {Router} from 'express';
import * as loginController from '../controllers/loginControllers'
import * as logoutController from '../controllers/logoutControllers'




const routes= Router();

routes.get('/',loginController.showHome)
routes.get('/register',loginController.showRegister)
routes.post('/register-send',loginController.register)
routes.get('/loggedArea',loginController.testLoggedArea)
routes.get('/confirmation',loginController.showConfirmation)
routes.post('/confirmation',loginController.confirmatedUser)
routes.post('/login',loginController.login)
routes.get('/newPassword',loginController.showRegisterNewPass)
routes.post('/newPassword',loginController.sendEmailNewPass)
routes.get('/newPassword/create/:token',loginController.showCreateNewPass)
routes.post('/newPassword/create/:token',loginController.createNewPass)
routes.get('/chat',loginController.showChat)
routes.get('/logout',logoutController.logoutUser)
routes.get('/editUser',loginController.showEditUser)
routes.post('/editUser',loginController.editUser)


export default routes
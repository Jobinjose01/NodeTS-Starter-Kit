import { Container } from 'inversify';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';

import { LoginService } from '../services/loginService';
import { LoginController } from '../controllers/loginController';

import { PermissionService } from '../services/permissionService';
import { PermissionController } from '../controllers/permissionController';

import { RoleController } from '../controllers/roleController';
import { RoleService } from '../services/roleService';

import { LanguageController } from '../controllers/languageController';
import { LanguageService } from '../services/languageService';

const container = new Container();

container.bind<UserController>(UserController).toSelf();
container.bind<UserService>(UserService).toSelf();

container.bind<LoginController>(LoginController).toSelf();
container.bind<LoginService>(LoginService).toSelf();

container.bind<PermissionController>(PermissionController).toSelf();
container.bind<PermissionService>(PermissionService).toSelf();

container.bind<RoleController>(RoleController).toSelf();
container.bind<RoleService>(RoleService).toSelf();

container.bind<LanguageController>(LanguageController).toSelf();
container.bind<LanguageService>(LanguageService).toSelf();

export default container;

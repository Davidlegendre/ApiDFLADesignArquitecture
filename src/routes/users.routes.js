import {Router} from 'express';
import {autenticar,DeleteUser,getuserdata,registrar, UpdateUserAccountNick, UpdateUserAccountpass, UpdateUserData} from '../controllers/user.controller';
const {ValidateLoginCampos, ValidateRegisterCampos, validateupdateuser, validarupdateaccountnick, validarupdateaccountpass, validardeleteaccount, validateToken} = require('../validators/user');
const router = Router();

router.get('/user/:token',validateToken, getuserdata);

router.post('/user/auth', ValidateLoginCampos, autenticar);

router.post('/user/register', ValidateRegisterCampos, registrar);

router.put('/user',validateToken,validateupdateuser, UpdateUserData);

router.put('/user/account/nick', validarupdateaccountnick, UpdateUserAccountNick);

router.put('/user/account/pass', validarupdateaccountpass, UpdateUserAccountpass);

router.post('/user',validardeleteaccount, DeleteUser);


// asi lo mismo para post, delete, put, other get las rutas son archivos diferentes e improtados a app.js
export default router;
const {check} = require("express-validator");
const {validateResult} = require('../helpers/validatehelper');

const ValidateLoginCampos = [
    check('user').exists({checkNull: true, checkFalsy: true}).notEmpty(),
    check('pass').exists({checkNull: true, checkFalsy: true}).notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

const ValidateRegisterCampos =[
    //nombre, apellido_p, apellido_m, nick, password, correo, telefono, descripcion
    check('nombre').exists().notEmpty(),
    check('apellido_p').exists().notEmpty(),
    check('apellido_m').exists().notEmpty(),
    check('nick').exists().notEmpty(),
    check('password').exists().notEmpty(),
    check('correo').exists().notEmpty().isEmail(),
    check('telefono').exists().notEmpty().isMobilePhone(),
    check('foto').exists().notEmpty(),
    check('descripcion').exists(),
    (req, res, next) =>
    {
        validateResult(req, res, next)
    }
];

const validateupdateuser = [
    check('token').exists().notEmpty(),
    check('nombre').exists().notEmpty(),
    check('apellido_p').exists().notEmpty(),
    check('apellido_m').exists().notEmpty(),
    check('correo').exists().notEmpty().isEmail(),
    check('telefono').exists().notEmpty().isMobilePhone(),
    check('foto').exists().notEmpty(),
    check('descrip_personal').exists(),
    (req,res,next)=>
    {
        validateResult(req,res,next)
    }
];

const validarupdateaccountnick = [
    check('token').exists().notEmpty(),
    check('nick').exists().notEmpty(),
    (req,res,next)=>
    {
        validateResult(req,res,next)
    }
];

const validarupdateaccountpass = [
    check('token').exists().notEmpty(),
    check('password').exists().notEmpty(),
    (req,res,next)=>
    {
        validateResult(req,res,next)
    }
];

const validardeleteaccount = [
    check('token').exists().notEmpty(),
    (req,res,next)=>
    {
        validateResult(req,res,next);
    }
];

const validateToken = [
    (req, res, next) => {
       const token = req.params.token;
       if(typeof token !== undefined)
       {
        req.token = token;
        next();
       }else{
           res.sendStatus(403);
       }

    }
];

module.exports = {ValidateLoginCampos, ValidateRegisterCampos,validateupdateuser, validarupdateaccountnick,validarupdateaccountpass,validardeleteaccount,validateToken};
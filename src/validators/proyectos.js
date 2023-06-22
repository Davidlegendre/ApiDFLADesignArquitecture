const {
    check
} = require("express-validator");
const {
    validateResult
} = require('../helpers/validatehelper');

const validarCreateCampos = [
    check('token').exists().notEmpty(),
    check('nombre').exists().notEmpty(),
    check('descripcion').exists().notEmpty(),
    check('banner').exists().notEmpty(),
    check('recursos').exists().notEmpty().isArray(),
    check('recursos.*.url').exists().notEmpty(),
    check('recursos.*.titulo').exists().notEmpty(),
    check('recursos.*.tipo').exists().notEmpty(),    
    (res, req, next) => {
        validateResult(res, req, next)
    }
];


const validarUpdateCampos = [
    check('token').exists().notEmpty(),
    check('id').exists().notEmpty(),
    check('nombre').exists().notEmpty(),
    check('descripcion').exists().notEmpty(),
    check('recursos').exists().notEmpty().isArray(),   
    check('recursos.*.url').exists().notEmpty(),
    check('recursos.*.titulo').exists().notEmpty(),
    check('recursos.*.tipo').exists().notEmpty(),
    (res, req, next) => {
        validateResult(res, req, next)
    }
];

const validarEliminarCampos = [
    check('token').exists().notEmpty(),
    check('id').exists().notEmpty(),
    (res, req, next) => {
        validateResult(res, req, next)
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

module.exports = {
    validarCreateCampos,
    validarUpdateCampos,
    validarEliminarCampos,
    validateToken
};
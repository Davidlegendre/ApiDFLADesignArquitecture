import {
    Router
} from 'express';
import {
    BuscarProyecto,
    CreateProyecto,
    deleteProyecto,
    GetProyecto,
    GetProyectoCuenta,
    GetProyectos,
    UpdateProyecto
} from '../controllers/proyectos.controller';
import {
    validarCreateCampos,
    validarEliminarCampos,
    validarUpdateCampos,
    validateToken
} from '../validators/proyectos'

const router = Router();


router.get('/proyectos', GetProyectos);


router.get('/proyectos/:id', GetProyecto);

router.get('/proyectos/buscar/:query', BuscarProyecto);

router.get('/proyectos/account/:token', validateToken, GetProyectoCuenta);

router.post('/proyectos', validarCreateCampos, CreateProyecto);

router.put('/proyectos', validarUpdateCampos, UpdateProyecto);
router.post('/proyectos/del', validarEliminarCampos, deleteProyecto);


//router.get('/proyecto/:token/:id', validateToken);
// asi lo mismo para post, delete, put, other get las rutas son archivos diferentes e improtados a app.js
export default router;




/*const uuid = require('uuid')
const path = require('path'),
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: (req, file, cb)=>
        {
            cb(null, path.join(__dirname, "../public/img"))
        },
        filename: (req,file,cb)=>
        {
            cb(null, uuid.v4() + path.extname(file.originalname))
        }
    }),
    upload = multer({
        storage,
        dest: path.join(__dirname, "../public/img"),
        fileFilter: (req, file, cb)=>
        {
            const filetype = /jpeg|jpg|png|gif/;
            const mimetype = filetype.test(file.mimetype);
            const extname = filetype.test(path.extname(file.originalname));
            if(mimetype && extname)
            {
                return cb(null, true)
            }
            cb(null, false)
        }
    });


router.get('/', (req, res) => {
    res.sendFile('/view.html', {
        root: __dirname
    })
})*/
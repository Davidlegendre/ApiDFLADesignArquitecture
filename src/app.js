import express from 'express';
import config from './config';
import userRoutes from './routes/users.routes';
import proyectosRoutes from './routes/proyectos.routes';
const bodyParser = require('body-parser');
const app = express();


//configuraciones aqui agrego el puerto y las rutas
app.set('port', config.port);

app.use(bodyParser.json({limit:'2mb'}))
//middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(userRoutes);
app.use(proyectosRoutes);
export default app;
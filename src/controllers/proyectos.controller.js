import {
    ExecuteNonQuery,
    executeQueryWithBack
} from '../database/conection';

//const path = require('path'), destino = path.join(__dirname, "../public/img")

const JWT = require("jsonwebtoken");

export const GetProyectos = async (req, res) => {
    try {
        const result = await ExecuteNonQuery("select p.idprojects as 'id', p.nombre as 'proyecto', p.descripcion, p.banner as 'banner', convert(date, p.fechcreacion) as 'creationdate', u.idusers as 'iduser', u.nombre as 'nomuser', u.foto from Projects p inner join Users u on u.idusers = p.idusers where u.isactive = 1");
        result.forEach(e => {
            e.creationdate = e.creationdate.toISOString().split('T')[0]
        });
        res.status(200).json(result);

    } catch (error) {
        console.error(error)
        res.status(400).json({
            error: "Bad Request"
        })
    }
};

export const GetProyecto = async (req, res) => {
    try {
        let id = req.params.id;
        const proyecto = await ExecuteNonQuery("select p.idprojects as 'id', p.nombre as 'proyecto', p.descripcion, p.banner ,convert(date, p.fechcreacion) as 'creationdate' from Projects p inner join Users u on u.idusers = p.idusers where u.isactive = 1 and p.idprojects = '" + id + "'");

        const diseñador = await ExecuteNonQuery("declare @id int; set @id = (select idusers from Projects where idprojects = " + id + "); select idusers as 'id',nombre,apellido_p, apellido_m, foto, correo, telefono, descrip_personal as 'descripcion' from Users where idusers = @id");

        const recursos = await ExecuteNonQuery("select r.URL as 'data', r.titulo, r.fechsubida as 'subida', r.tipo from recursos r where r.idprojects = '" + id + "'");


        proyecto.forEach(e => {
            e.creationdate = e.creationdate.toISOString().split('T')[0]
        });
        recursos.forEach(e => {
            e.subida = e.subida.toISOString().split('T')[0]
        });

        res.status(200).json({
            project: proyecto[0],
            recursos,
            diseñador: diseñador[0]
        });
    } catch (error) {
        console.error(error)
        res.sendStatus(400);
    }
};

export const BuscarProyecto = async (req, res) => {
    try {
        const query = req.params.query;
        const result = await ExecuteNonQuery("select p.idprojects as 'id', p.nombre as 'proyecto', p.descripcion, p.banner, convert(date, p.fechcreacion) as 'creationdate', u.idusers as 'iduser', u.nombre as 'nomuser' from Projects p inner join Users u on u.idusers = p.idusers where u.isactive = 1 and p.nombre like '%" + query + "%' or p.descripcion like '%" + query + "%' or u.nombre like '%" + query + "%'");

        result.forEach(e => {
            e.creationdate = e.creationdate.toISOString().split('T')[0]
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            msg: "Json invalido"
        });
    }
}

export const GetProyectoCuenta = async (req, res) => {
    try {
        let token = req.token;
        JWT.verify(token, 'secretKey', async (error, authData) => {
            if (error) {
                res.sendStatus(403);
            } else {
                const isactive = await __verificartoken(authData);
                if (isactive != 0) {
                    const result = await ExecuteNonQuery("select p.idprojects as 'id', p.nombre as 'proyecto', p.descripcion, p.banner as 'banner', convert(date, p.fechcreacion) as 'creationdate', u.idusers as 'iduser', u.nombre as 'nomuser', u.foto from Projects p inner join Users u on u.idusers = p.idusers where u.isactive = 1 and p.idusers = '" + authData.user.id + "'");
                    result.forEach(e => {
                        e.creationdate = e.creationdate.toISOString().split('T')[0]
                    });
                    res.status(200).json(result);
                } else {
                    res.status(401).json({
                        msg: 'Usuario no Existe'
                    });
                }
            }
        });
    } catch (error) {
        res.sendStatus(400);
    }
}

export const CreateProyecto = async (req, res) => {
    try {
        const {
            token,
            nombre,
            descripcion,
            banner,
            recursos
        } = req.body;

        JWT.verify(token, 'secretKey', async (error, authData) => {
            if (error) {
                res.sendStatus(403);
            } else {
                const isactive = await __verificartoken(authData);
                if (isactive != 0) {
                    const proyectexist = await ExecuteNonQuery("select count(idprojects) as 'count' from Projects where nombre = '" + nombre + "' and idusers = '" + authData.user.id + "'");
                    if (proyectexist[0].count > 0) {
                        res.status(400).json({
                            msg: "Proyecto ya existe"
                        });
                    } else {
                        let fech = __generarfecha();

                        console.log(fech);
                        const result = await executeQueryWithBack("insert into Projects(idusers,nombre,banner,descripcion,fechcreacion) values('" + authData.user.id + "','" + nombre + "','" + banner + "','" + descripcion + "','" + fech + "')");

                        if (result['rowsAffected'] == 1) {
                            await __guardarRecursos(recursos, fech);
                            res.status(200).json({
                                msg: "Proyecto Registrado"
                            });
                        } else {
                            res.status(400).json({
                                msg: "Un error ha ocurrido al insertar a project"
                            });
                        }
                    }
                } else {
                    res.status(401).json({
                        msg: 'Usuario no Existe'
                    });
                }
            }
        });

    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
};


export const UpdateProyecto = async (req, res) => {
    try {
        const {
            token,
            id,
            nombre,
            descripcion,
            banner,
            recursos
        } = req.body;

        JWT.verify(token, 'secretKey', async (error, authData) => {

            if (error) {
                res.sendStatus(403);
            } else {

                const isactive = await __verificartoken(authData);
                if (isactive != 0) {
                    const isexist = await ExecuteNonQuery("select count(idprojects) as 'count' from Projects where idprojects = '" + id + "'");

                    if (isexist[0]['count'] != 0) {
                        const result = await executeQueryWithBack("update Projects set nombre = '" + nombre + "', banner = '" + banner + "',descripcion = '" + descripcion + "' where idprojects = '" + id + "'");
                        if (result['rowsAffected'] != 0) {
                            await __updaterecursos(recursos, id);
                            res.status(200).json({
                                msg: "Proyecto actualizado"
                            })
                        } else {

                            res.status(400).json({
                                msg: "Hubo un error al actualizar los Proyectos"
                            });
                        }
                    } else {
                        res.status(400).json({
                            msg: "proyecto ya no existe"
                        })
                    }

                } else {
                    res.status(400).json({
                        msg: "usuario no existe"
                    });
                }
            }


        });

    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
};

export const deleteProyecto = async (req, res) => {
    try {
        const {
            token,
            id
        } = req.body;
        JWT.verify(token, 'secretKey', async (error, authData) => {
            if (error) {
                res.sendStatus(403)
            } else {
                const isactive = await __verificartoken(authData);
                if (isactive != 0) {
                    const proyectexist = await ExecuteNonQuery("select count(idprojects) as 'count' from Projects where idprojects = '" + id + "'");
                    if (proyectexist[0].count == 0) {
                        res.status(400).json({
                            msg: "Proyecto no existe"
                        });
                    } else {
                        await __borrarrecursos(id);
                        await executeQueryWithBack("delete from Projects where idprojects = '" + id + "'");
                        res.status(200).json({
                            msg: "proyecto eliminado"
                        });
                    }
                } else {
                    res.status(400).json({
                        msg: "Usuario no existe"
                    });
                }
            }
        });
    } catch (error) {
        res.sendStatus(400);
    }
};

async function __verificartoken(authData) {

    const id = authData.user.id;
    const result = await ExecuteNonQuery("select isactive from Users where idusers = '" + id + "'");
    return result[0].isactive;
}

function __generarfecha() {
    const fechahoy = Date.now();
    let fech = new Date(fechahoy);
    let result = fech.toISOString().split("T")[0]
    return result;
}

async function __guardarRecursos(recursos, fech) {
    recursos.forEach(async e => {
        await executeQueryWithBack("insert into recursos(idprojects,URL,titulo,fechsubida,tipo) values((select top 1 idprojects from Projects order by idprojects DESC), '" + e.url + "','" + e.titulo + "', '" + fech + "','" + e.tipo + "')");
    });
    return true;
}

async function __guardarRecursos2(recursos, fech, idproject) {
    recursos.forEach(async e => {
        await executeQueryWithBack("insert into recursos(idprojects,URL,titulo,fechsubida,tipo) values('" + idproject + "', '" + e.url + "','" + e.titulo + "', '" + fech + "','" + e.tipo + "')");
    });
    return true;
}

async function __borrarrecursos(idproyecto) {
    const resutl = await executeQueryWithBack("delete from recursos where idprojects = " + idproyecto);
    return resutl['rowsAffected'];
}

async function __updaterecursos(recursos, idproyecto) {

    const result = await __borrarrecursos(idproyecto);
    if (result != 0)
        await __guardarRecursos2(recursos, __generarfecha(), idproyecto);
    return true;
}




/*export const pruebasubida = async (req,res) =>
{
    
    //res.send(destino +"\\" + req.file.filename)
}*/

/*function __formatoFecha(fecha, formato) {
    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    }

    return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
}

function __verificarrecursos(recursos) {
    let urlfail = false,
        titulofail = false;
    let url, titulo;
    try {
        url = recursos.url;

    } catch (error) {
        urlfail = true;
    }

    try {
        titulo = recursos.titulo;
    } catch (error) {
        titulofail = true;
    }
    if (urlfail || titulofail || url == undefined || titulo == undefined) {
        return false
    } else {
        return true
    }
}*/
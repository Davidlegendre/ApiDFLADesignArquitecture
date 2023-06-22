import {
    encrypt,
    ExecuteNonQuery,
    executeQueryWithBack
} from '../database/conection';

const JWT = require("jsonwebtoken");

export const autenticar = async (req, res) => {
    try {
        const {
            user,
            pass
        } = req.body;

        let cryp = encrypt(pass);
        const result = await ExecuteNonQuery("select idusers,nombre from Users where nick = '" + user + "' and password = '" + cryp + "' and isactive = 1");

        if (result.length != 0) {
            const userobject = {
                id: result[0]['idusers'],
                nom: result[0]['nombre']
            }
            __generarToken(userobject, res);
        } else {
            res.status(500).json({
                msg: "No autorizado o no esta registrado"
            });
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({
            error: "Bad Request"
        })
    }
};

export const registrar = async (req, res) => {
    try {
        const {
            nombre,
            apellido_p,
            apellido_m,
            nick,
            password,
            correo,
            telefono,
            foto,
            descripcion
        } = req.body;
        if (descripcion == null) {
            descripcion = ""
        }
        let cryp = encrypt(password);
        const isexist = await ExecuteNonQuery("select count(idusers) as 'c' from Users where nick = '" + nick + "'");
        if (isexist[0]['c'] > 0) {
            res.status(401).json({
                msg: "El nick ya esta en uso"
            })
        } else {

            const result = await executeQueryWithBack("insert into Users(nombre, apellido_p, apellido_m, nick, password, correo, telefono, foto, descrip_personal,isactive) values('" + nombre + "','" + apellido_p + "','" + apellido_m + "','" + nick + "','" + cryp + "','" + correo + "','" + telefono + "','" + foto + "','" + descripcion + "',1)");

            if (result['rowsAffected'] == 1) {
                res.status(200).json({
                    msg: "Registro Exitoso"
                })
            } else {
                res.status(500);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "Bad Request"
        })
    }
}

export const getuserdata = async (req, res) => {
    try {
        let token = req.token;
        JWT.verify(token, 'secretKey', async (error, authData) => {
            if (error) {
                res.sendStatus(403);
            } else {
                const isactive = await __verificartoken(authData);
                if (isactive != 0) {
                    const result = await ExecuteNonQuery("select u.idusers as 'id', u.nombre, u.apellido_p, u.apellido_m, u.correo, u.telefono, u.foto, u.descrip_personal from Users u where idusers = '" + authData.user.id + "'");
                    res.status(200).json(result[0])
                } else {
                    res.status(401).json({
                        msg: "Usuario no existe"
                    })
                }
            }
        });

    } catch (error) {
        res.status(400).json({
            error: "Bad Request"
        })
    }
}

export const UpdateUserData = async (req, res) => {
    try {
        const {
            token,
            nombre,
            apellido_p,
            apellido_m,
            correo,
            telefono,
            foto,
            descrip_personal
        } = req.body;

        JWT.verify(token, 'secretKey', async (err, authdata) => {
            if (err) {
                res.sendStatus(403);
            } else {
                const isactive = await __verificartoken(authdata);
                if (isactive != 0) {
                    const result = await executeQueryWithBack("update Users set nombre = '" + nombre + "', apellido_p = '" + apellido_p + "', apellido_m = '" + apellido_m + "',correo = '" + correo + "', telefono = '" + telefono + "', foto = '" + foto + "', descrip_personal='" + descrip_personal + "' where idusers = '" + authdata.user.id + "'");
                    if (result['rowsAffected'] == 1) {
                        res.status(200).json({
                            msg: "Datos del Usuario Actualizado"
                        });
                    } else {
                        res.status(400).json({
                            msg: "Un error ha ocurrido"
                        });
                    }
                } else {
                    res.status(401).json({
                        msg: "Usuario no existe"
                    })
                }
            }
        });


    } catch (error) {
        res.status(400).json({
            msg: "Bad Request"
        })
    }
}

export const UpdateUserAccountNick = async (req, res) => {
    try {
        const {
            token,
            nick
        } = req.body;

        JWT.verify(token, 'secretKey', async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                const isactive = await __verificartoken(authData);
                if (isactive != 0) {
                    const isexist = await ExecuteNonQuery("select count(idusers) as 'c' from Users where nick = '" + nick + "'");
                    if (isexist[0]['c'] > 0) {
                        res.status(401).json({
                            msg: "El nick ya esta en uso"
                        })
                    } else {
                        const result = await executeQueryWithBack("update Users set nick = '" + nick + "' where idusers = '" + authData.user.id + "'");
                        if (result['rowsAffected'] == 1) {
                            res.status(200).json({
                                msg: "Cuenta Actualizada"
                            });

                        } else {
                            res.status(400).json({
                                msg: "Un error ha ocurrido"
                            });
                        }
                    }
                } else {
                    res.status(401).json({
                        msg: "Usuario no existe"
                    })
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            msg: "Bad Request"
        })
    }
}

export const UpdateUserAccountpass = async (req, res) => {
    try {
        const {
            token,
            password
        } = req.body;

        JWT.verify(token, 'secretKey', async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                const isactive = await __verificartoken(authData);
                if (isactive != 0) {
                    let cryp = encrypt(password);
                    const result = await executeQueryWithBack("update Users set password = '" + cryp + "' where idusers = '" + authData.user.id + "'");
                    if (result['rowsAffected'] == 1) {
                        res.status(200).json({
                            msg: "Password Actualizado"
                        });
                    } else {
                        res.status(400).json({
                            msg: "Un error ha ocurrido"
                        });
                    }
                } else {
                    res.status(401).json({
                        msg: "Usuario no existe"
                    })
                }

            }
        });
    } catch (error) {
        res.status(400).json({
            msg: "Bad Request"
        })
    }
}

export const DeleteUser = async (req, res) => {
    try {
        const {
            token
        } = req.body;
        JWT.verify(token, 'secretKey', async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                const isactive = await __verificartoken(authData);
                if (isactive != 0) {
                    const result = await executeQueryWithBack("update Users set isactive = 0 where idusers = '" + authData.user.id + "'");
                    if (result['rowsAffected'] == 1) {
                        res.status(200).json({
                            msg: "Cuenta Eliminada"
                        });
                    } else {
                        res.status(400).json({
                            msg: "Un error ha ocurrido"
                        });
                    }
                } else {
                    res.status(401).json({
                        msg: "Usuario no existe"
                    });
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            msg: "Bad Request"
        })
    }
}

async function __verificartoken(authData) {

    const id = authData.user.id;
    const result = await ExecuteNonQuery("select isactive from Users where idusers = '" + id + "'");
    return result[0].isactive;
}

function __generarToken(userobject, res) {
    JWT.sign({
        user: userobject
    }, 'secretKey', {
        expiresIn: "1d"
    }, (err, token) => {
        res.status(200).json({
            msg: "Bienvenido",
            token
        });
    });
}

//aqui se exportan los metodos o funciones
//que van a servir en las rutas
/*
para recibir datos es req.body
const {name,descripction} = req.body <= ejemplo
console.log(name,description)
*/
import sql from 'mssql';
const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.HOST,
    database: process.env.DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

export function encrypt(string) {
    var crypto = require('crypto');
    let encrypt = crypto.createHash('md5').update(string).digest("hex");
    return encrypt;
}

export async function ExecuteNonQuery(query) {
    const pool = await getConnection();
    const result = await pool.request().query(query);
    return result['recordset'];
}

export async function executeQueryWithBack(query) {
    const pool = await getConnection();
    const result = await pool.request().query(query);
    return result;
}
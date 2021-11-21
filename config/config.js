const mysql = require('mysql')

const util = require('util')
var con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'databasename'
});
/**sanjeev local DB */
// var con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'mydb'
// });

// con.connect(function (err) {
//     if (!err) {
//         console.log("Database connected");
//     } else {
//         console.log("Error Connecting Database",err);
//     }
// });

con.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return   console.log("Database connected");
})

con.query = util.promisify(con.query)

module.exports=con;
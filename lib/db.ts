import mysql from 'mysql2';

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

export const sqlQuery = (sql: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        console.log('>>>', sql);

        connection.query(sql, (err, result) => {
            if (err) reject(err.message);
            resolve(result);
        })   
    });
}
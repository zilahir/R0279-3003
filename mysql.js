import mysql from 'mysql';

export class MySql {
    constructor({host, username, password}) {
        this.host = host;
        this.username = username;
        this.password = password;

        this.connection = mysql.createConnection({
            host: this.host,
            user: this.username,
            password: this.password,
            database: 'R0279_3003'
        })
    }

    getColumnNamesFromData(data) {
        return Object.keys(data).join(', ');
    }

    getColumnData(data) {
        return Object.keys(data).map((field) => `'${data[field]}'`).join(', ');
    }

    insertIntoDatabase(tableName, data) {
        const normalizedSqlQuery = `INSERT INTO ${tableName} (${this.getColumnNamesFromData(data)}) VALUES (${this.getColumnData(data)});`;
        // console.log(normalizedSqlQuery);
        this.connection.query(normalizedSqlQuery, (err, result) => {
            if (err) {
                throw err
            }
            console.log('record inserted');
        })
    }
}
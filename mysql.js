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

    cloeConnection() {
        return this.connection.destroy()
    }

    insertIntoDatabase(tableName, data) {
        const normalizedSqlQuery = `INSERT INTO ${tableName} (${this.getColumnNamesFromData(data)}) VALUES (${this.getColumnData(data)});`;
        // console.log(normalizedSqlQuery);
        return new Promise((resolve, reject) => {
            this.connection.query(normalizedSqlQuery, (err, result) => {
                if (err) {
                    console.log(`ERROR: ${normalizedSqlQuery}`);
                    reject(err);
                }
                console.log(`record inserted: ${normalizedSqlQuery}`);
                resolve(true)
            })
        })
    }
}
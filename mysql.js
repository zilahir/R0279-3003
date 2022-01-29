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

    connectToDatabase() {
        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) {
                    reject(false)
                }
                resolve(true)
            })
        })
    }

    queryForTable(table) {
        console.debug('table', table);
        return new Promise((resolve, reject) => {
            this.connection.query(`SHOW TABLES LIKE '${table}';`, (err, result) => {
                if (err) {
                    console.debug('lofasz', err)
                    reject(false)
                };
                console.debug('kaka', result);
                resolve(true)
            })
        })
    }

    getColumnData(data) {
        return Object.keys(data).map((field) => `'${data[field]}'`).join(', ');
    }

    cloeConnection() {
        return this.connection.destroy()
    }

    insertIntoDatabase(tableName, data) {
        const normalizedSqlQuery = `INSERT INTO ${tableName} (${this.getColumnNamesFromData(data)}) VALUES (${this.getColumnData(data)});`;
        return new Promise((resolve, reject) => {
            this.connection.query(normalizedSqlQuery, (err, result) => {
                if (err) {
                    console.log(`ERROR: ${normalizedSqlQuery}`);
                    reject(err);
                }
                resolve(true)
            })
        })
    }
}
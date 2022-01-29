import mysql from 'mysql';

export class MySql {
    constructor({host, username, password}) {
        this.host = host;
        this.username = username;
        this.password = password;
        this.databaseName = 'R0279_3003'

        this.connection = mysql.createConnection({
            host: this.host,
            user: this.username,
            password: this.password,
            database: this.databaseName,
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

    checkIFDataTypeExistsOnTable(tables, dataType) {
        // looping through every table for the desired dataType
        // returning true if there's a match

        let promises = []
        const query = (thisTableName) => `SELECT COLUMN_NAME, DATA_TYPE as tpye
        FROM information_schema.columns 
        WHERE table_schema = '${this.databaseName}' 
        AND table_name = '${thisTableName}';`;

        tables.forEach(table => {
            promises.push(
                new Promise((resolve, reject) => {
                    this.connection.query(query(table), (err, result) => {
                        if (err) reject(err);
                        console.debug('result', result)
                        resolve({
                            result
                        })
                    })
                })
            )
        })

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(allPromiseResult => {
                // console.debug('allPromiseResult', allPromiseResult);
                resolve(true)
            })
        })
    }

    queryForTable(table) {
        return new Promise((resolve, reject) => {
            this.connection.query(`SHOW TABLES LIKE '${table}';`, (err, result) => {
                if (err) {
                    reject(false)
                };
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
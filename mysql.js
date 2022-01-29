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

    getDatabase() {
        return this.databaseName;
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

    convertQueryResultToObject(queryResult) {
        return JSON.parse((JSON.stringify(queryResult)))
    }

    checkIFDataTypeExistsOnTable(tables, dataType) {
        // looping through every table for the desired dataType
        // returning true if there's a match
        const promises = []
        return new Promise((resolve, reject) => {
            const query = (thisTableName) => `SELECT COLUMN_NAME, DATA_TYPE
            FROM information_schema.columns 
            WHERE table_schema = '${this.databaseName}' 
            AND table_name = '${thisTableName}';`;

            tables.forEach(table => {
                promises.push(
                    new Promise((resolve, reject) => {
                        this.connection.query(query(table), (err, results) => {
                            if (err) reject(err);
                            const finalResult = results.find(result => this.convertQueryResultToObject(result).DATA_TYPE.toLowerCase() === dataType.toLowerCase());
                            // !! casting the result into a Boolean
                            resolve(!!finalResult);
                        })
                    })
                )
            })

            Promise.all(promises).then(allPromiseResult => {
                // check if the array contains false
                // if there's at least one True in the array, that means the testcase is Trurthy,
                // we can resolve the entire function with a True
                const hasTrue = allPromiseResult.some(result => result === true);
                resolve(hasTrue);
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

    query(queryToExecute) {
        return new Promise((resolve, reject) => {
            this.connection.query(queryToExecute, (err, result) => {
                if (err) reject(err)
                resolve(this.convertQueryResultToObject(result))
            })
        })
    }

    getColumnData(data) {
        return Object.keys(data).map((field) => `"${data[field]}"`).join(", ");
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
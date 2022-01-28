import { readFileSync } from 'fs';
import { MySql } from './mysql.js';

async function insertRandomData(dbTables) {
    return new Promise(function(resolve, reject) {
        const DatabaseController = new MySql({
            host: '127.0.0.1',
            username: 'user',
            password: 'DemoPassword'
        })
        // const dataFiles = await globby('./data/*.json');
        let promiseArray = []
        if (Array.isArray(dbTables) && dbTables.length > 0) {
            dbTables.map((dataFile) => {
                const dataKey = dataFile;
                try {
                    const rawJson = readFileSync(`./data/${dataFile}.json`, "utf8")
                    const jsonObject = JSON.parse(rawJson);
        
                    if (Array.isArray(jsonObject[dataKey])) {
                        
                            jsonObject[dataKey].map(dataRecord => {
                                promiseArray.push(DatabaseController.insertIntoDatabase(dataKey, dataRecord))
                            }
                        )
                    }
                } catch (e) {
                    console.error(e)
                    reject(e)
                }
            })
            Promise.all(promiseArray).then(() => {
                console.log('done')
            }).then(() => {
                DatabaseController.cloeConnection()
                resolve({
                    isDone: true,
                })
            })
        } else {
            resolve(false)
        }
    })
}

export default insertRandomData
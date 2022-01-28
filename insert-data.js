import { globby } from 'globby';
import path from 'path';
import { readFileSync } from 'fs';
import { MySql } from './mysql.js';

async function insertRandomData() {
    const DatabaseController = new MySql({
        host: '127.0.0.1',
        username: 'user',
        password: 'DemoPassword'
    })
    const dataFiles = await globby('./data/*.json');
    dataFiles.map((dataFile) => {
        const dataKey = path.parse(dataFile).name
        // console.log('currentKey', dataKey);
        try {
            const rawJson = readFileSync(dataFile, "utf8")
            const jsonObject = JSON.parse(rawJson);

            if (Array.isArray(jsonObject[dataKey])) {
                jsonObject[dataKey].map(dataRecord => {
                    return DatabaseController.insertIntoDatabase(dataKey, dataRecord)
                })
            }
            // console.log(jsonObject[dataKey])
        } catch (e) {
            console.error(e)
        }
    })
}

export default insertRandomData
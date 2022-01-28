import generateRandomDepartments from './generate-data.js';
import insertRandomData from './insert-data.js'

async function run() {
    const dbTables = await generateRandomDepartments();
    console.log('dbTables', dbTables);
    const isDone = await insertRandomData(dbTables);
    console.log('isDone', isDone);
}

run();
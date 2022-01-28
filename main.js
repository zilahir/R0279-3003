import generateRandomDepartments from './generate-data.js';
import insertRandomData from './insert-data.js'

async function run() {
    const randomKeys = await generateRandomDepartments();
    console.log(randomKeys);
    await insertRandomData();
}

run();
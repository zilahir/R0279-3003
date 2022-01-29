import generateRandomData from './generate-data.js';
import insertRandomData from './insert-data.js'
import chalk from 'chalk';
import log from './log.js';

async function run() {
    log(chalk.yellow('Starting Script'));
    const dbTables = await generateRandomData();
    log(chalk.green('All mock data is now ready'));
    log(chalk.yellow('Starting insering random data into the database'));
    const isDone = await insertRandomData(dbTables);
}

run();
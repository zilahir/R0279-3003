import faker from 'faker';
import random from 'random';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';
import { format } from 'date-fns'
import log from './log.js';

const getRandomSalary = () => random.int(2200, 7500);

const getPastDate = () => new Date(faker.date.past()).getTime()
const getFutureDate = () => new Date(faker.date.future()).getTime()

const getDateType = () => format(new Date(faker.date.future()), 'yyyy-MM-dd')

export const tables = {
    employees: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'birth_date', randomFunction: getPastDate },
        { name: 'first_name', randomFunction: faker.name.firstName },
        { name: 'last_name', randomFunction: faker.name.lastName },
        { name: 'gender', randomFunction: faker.name.gender },
        { name: 'hire_date', randomFunction: getPastDate },
    ],
    departments: [
        { name: 'dept_no', randomFunction: undefined },
        { name: 'dept_name', randomFunction: faker.commerce.department },
    ],
    dept_emp: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'dept_no', randomFunction: undefined },
        { name: 'from_date', randomFunction: getPastDate },
        { name: 'to_date', randomFunction: getFutureDate },
    ],
    dept_manager: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'dept_no', randomFunction: undefined },
        { name: 'from_date', randomFunction: getPastDate },
        { name: 'to_date', randomFunction: getFutureDate },
    ],
    titles: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'title', randomFunction: faker.name.jobTitle },
        { name: 'from_date', randomFunction: getPastDate },
        { name: 'to_date', randomFunction: getFutureDate },
    ],
    salaries: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'salary', randomFunction: getRandomSalary},
        { name: 'from_date', randomFunction: getPastDate },
        { name: 'to_date', randomFunction: getFutureDate },
    ],
    days_off: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'from_date', randomFunction: getDateType },
        { name: 'to_date', randomFunction: getDateType },
    ]
};

const generateRandomUuids = (length) => Array.from({length}).map(() => uuidv4());

function generateRandomData() {
    log(chalk.yellow('Starting generating random data'));
    return new Promise((resolve) => {
        const randomNumber = 2 // random.int(10, 99);
        const randomUserIds = generateRandomUuids(randomNumber);
        const randomDepartmentIds = generateRandomUuids(randomNumber);

        const randomIds = {
            'emp_no': [...randomUserIds],
            'dept_no': [...randomDepartmentIds]
        }
        Object.keys(tables).map(key => {
            const thisKey = tables[key]
            log(chalk.yellow(`Generating random data for: ${key}`));
            let randomData = []

            if (Array.isArray(thisKey)) {
                Array.from({ length: randomNumber }).fill().map((_, index) => {
                    let thisRandomObject = {}
                    Object.assign({}, thisKey.forEach((field) => {
                        thisRandomObject[field.name] = !!field.randomFunction ? field.randomFunction() : randomIds[field.name][index]
                    }))
                    randomData.push(Object.assign(thisRandomObject));
                });
                log(chalk.green(`✅ Generating random data for: ${key} is done!`));
            }
            log(chalk.yellow(`Writing random data into file: ${key}.json`));
            writeJsonFiles(randomData, key);
            log(chalk.green(`✅ Writing random data into file: ${key}.json is done!`));
        })
        resolve(Object.keys(tables).map(col => col));
    })
}

function writeJsonFiles(data, key) {
    fs.writeFileSync(`./data/${key}.json`, JSON.stringify({
        [key]: data
    }));
}

export default generateRandomData;
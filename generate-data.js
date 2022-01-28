import faker from 'faker';
import random from 'random';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const tables = {
    employees: [
        // { name: 'emp_no', randomFunction: uuidv4 },
        { name: 'birth_data', randomFunction: faker.date.past },
        { name: 'fist_name', randomFunction: faker.name.firstName },
        { name: 'last_name', randomFunction: faker.name.lastName },
        { name: 'gender', randomFunction: faker.name.gender },
        { name: 'hire_date', randomFunction: faker.date.past },
    ],
    departments: [
        { name: 'dept_no', randomFunction: uuidv4 },
        { name: 'dept_name', randomFunction: faker.commerce.department },
    ],
    
}

const generateRandomUserIds = (length) => Array.from({length}).map(() => uuidv4());

const randomColumns = {
    randomData: [
        { name: 'department', randomFunction: faker.commerce.department },
        { name: 'firstName', randomFunction: faker.name.firstName },
        { name: 'lastName', randomFunction: faker.name.lastName },
        { name: 'jobTitle', randomFunction: faker.name.jobTitle },
        { name: 'birth_date', randomFunction: faker.date.past },
        { name: 'gender', randomFunction: faker.name.gender },
        { name: 'salaries', randomFunction: faker.finance.amount },
    ]
}

function generateRandomData() {
    return new Promise((resolve) => {
        const randomNumber = 2 // random.int(10, 99);
        const randomUserIds = generateRandomUserIds(randomNumber);
        Object.keys(tables).map(key => {
            const thisKey = tables[key]
            let randomData = []
            console.log('thisKey', thisKey);
            if (Array.isArray(thisKey)) {
                Array.from({ length: randomNumber }).fill().map((_, index) => {
                    let thisRandomObject = {}
                    Object.assign({}, thisKey.forEach((field) => {
                        thisRandomObject[field.name] = field.randomFunction()
                    }))
                    randomData.push(Object.assign(thisRandomObject, {emp_no: randomUserIds[index] }));
                });
            }
            writeJsonFiles(randomData, key);
        })
        resolve(true)
    })
}

function writeJsonFiles(data, key) {
    fs.writeFileSync(`./data/${key}.json`, JSON.stringify({
        [key]: data
    }));
}

export default generateRandomData;
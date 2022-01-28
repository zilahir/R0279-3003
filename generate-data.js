import faker from 'faker';
import random from 'random';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const tables = {
    employees: [
        { name: 'emp_no', randomFunction: uuidv4() },
        { name: 'birth_data', randomFunction: faker.date.past },
        { name: 'fist_name', randomFunction: faker.name.firstName },
        { name: 'last_name', randomFunction: faker.name.lastName },
        { name: 'gender', randomFunction: faker.name.gender },
        { name: 'hire_date', randomFunction: faker.date.past },
    ] 
}

const objectSchemas = {
    'employees': Object.assign({}, ...tables.employees.map(field => ({
        [field.name]: '',
    })))
}

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

function generate(randFunc, limit, name) {
    console.log(`creating random data data for column: ${name}`)
    const data = []
    for (let i = 0; i < limit; i++) {
        data.push(randFunc())
    }
    return data
}

function generateRandomData() {
    return new Promise((resolve) => {
        const randomNumber = random.int(10, 99);
        let randomData = {}
        Object.keys(tables).map(key => {
            const thisKey = tables[key]
            if (Array.isArray(thisKey)) {
                Array.from({ length: randomNumber }).fill().map(() => {
                    console.log(objectSchemas[key])
                });
            }
        })
        // return randomData
        writeJsonFiles(randomData);
        // console.log('randomData', randomData);
        resolve({
            dataKeys: Object.keys(randomData).map(key => key)
        })
    })
}

function writeJsonFiles(data) {
    Object.keys(data).map(key => {
        fs.writeFileSync(`./data/${key}.json`, JSON.stringify({
            rawData: data[key]
        }));
    });
}

export default generateRandomData;
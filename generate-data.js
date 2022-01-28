import faker from 'faker';
import random from 'random';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const getRandomSalary = () => random.int(2200, 7500);

const tables = {
    employees: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'birth_data', randomFunction: faker.date.past },
        { name: 'fist_name', randomFunction: faker.name.firstName },
        { name: 'last_name', randomFunction: faker.name.lastName },
        { name: 'gender', randomFunction: faker.name.gender },
        { name: 'hire_date', randomFunction: faker.date.past },
    ],
    departments: [
        { name: 'dept_no', randomFunction: undefined },
        { name: 'dept_name', randomFunction: faker.commerce.department },
    ],
    dept_emp: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'dept_no', randomFunction: undefined },
        { name: 'from_data', randomFunction: faker.date.past },
        { name: 'to_date', randomFunction: faker.date.future },
    ],
    dept_manager: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'dept_no', randomFunction: undefined },
        { name: 'from_data', randomFunction: faker.date.past },
        { name: 'to_date', randomFunction: faker.date.future },
    ],
    titles: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'title', randomFunction: faker.name.jobTitle },
        { name: 'from_data', randomFunction: faker.date.past },
        { name: 'to_date', randomFunction: faker.date.future },
    ],
    salaries: [
        { name: 'emp_no', randomFunction: undefined },
        { name: 'salary', randomFunction: getRandomSalary},
        { name: 'from_data', randomFunction: faker.date.past },
        { name: 'to_date', randomFunction: faker.date.future },
    ]
};

/* export const objectSchemas = {
    'employees': Object.assign({}, ...tables.employees.map(field => ({
        [field.name]: '',
    }))),
    'departments': Object.assign({}, ...tables.departments.map(field))
} */

// console.log(objectSchemas)

const generateRandomUuids = (length) => Array.from({length}).map(() => uuidv4());

function generateRandomData() {
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
            let randomData = []

            if (Array.isArray(thisKey)) {
                Array.from({ length: randomNumber }).fill().map((_, index) => {
                    let thisRandomObject = {}
                    Object.assign({}, thisKey.forEach((field) => {
                        thisRandomObject[field.name] = !!field.randomFunction ? field.randomFunction() : randomIds[field.name][index]
                    }))
                    randomData.push(Object.assign(thisRandomObject));
                });
            }
            writeJsonFiles(randomData, key);
        })
        resolve(true);
    })
}

function writeJsonFiles(data, key) {
    fs.writeFileSync(`./data/${key}.json`, JSON.stringify({
        [key]: data
    }));
}

export default generateRandomData;
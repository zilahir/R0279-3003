import faker from 'faker';
import random from 'random';
import fs from 'fs';

const randomColumns = {
    randomData: [
        { name: 'department', randomFunction: faker.commerce.department },
        { name: 'firstName', randomFunction: faker.name.firstName },
        { name: 'lastName', randomFunction: faker.name.lastName },
        { name: 'jobTitle', randomFunction: faker.name.jobTitle },
        { name: 'birth_date', randomFunction: faker.date.past },
        { name: 'gender', randomFunction: faker.name.gender },
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
    const randomNumber = random.int(0, 99);
    let randomData = {}
    Object.keys(randomColumns.randomData).map(key => {
        const currentKey = randomColumns.randomData[key]
        const name = currentKey.name
        Object.assign(randomData, {[name]: generate(currentKey.randomFunction, randomNumber, name)})
        return true
    })
    // return randomData
    writeJsonFiles(randomData);
    // console.log('randomData', randomData);
}

function writeJsonFiles(data) {
    Object.keys(data).map(key => {
        fs.writeFileSync(`./data/${key}.json`, JSON.stringify({
            rawData: data[key]
        }));
    });
}

export default generateRandomData;
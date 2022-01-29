import { MySql } from './mysql.js'
import _ from 'lodash'

const DatabaseController = new MySql({
    host: '127.0.0.1',
    username: 'user',
    password: 'DemoPassword'
})

const requiredTables = ['employees', 'departments', 'dept_emp', 'dept_manager', 'titles', 'salaries', 'days_off'];

const myOwnDataTypes = ['BIGINT'];

const requiredDataTypes = ['VARCHAR', 'INT', 'DATE', ...myOwnDataTypes]

const queries = [
    {
        name: 'select from employees',
        query: _.template('SELECT * FROM employees WHERE ${condition}')
    }
]

describe('connection to the database', () => {
    test('is successful', async () => {
        return await expect(DatabaseController.connectToDatabase()).resolves.toBe(true);
    })
})

describe('necceseary tables exists', () => {
    requiredTables.forEach(table => {
        test(`table: ${table} exists`, async () => {
            return await expect(DatabaseController.queryForTable(table)).resolves.toBe(true);
        })
    })
})

describe('required data types exists', () => {
    requiredDataTypes.forEach(dataType => {
        test(`Data type: ${dataType} exists`, async () => {
            return await expect(DatabaseController.checkIFDataTypeExistsOnTable(requiredTables, dataType)).resolves.toBe(true);
        })
    })
})

describe('all tables has Primary Keys set', () => {
    requiredTables.forEach(table => {
        test(`having Primary Key set for table: ${table}`, async () => {
            const databaseName = DatabaseController.getDatabase();
            const query = `SELECT TABLE_NAME, COLUMN_NAME
            FROM INFORMATION_SCHEMA.key_column_usage 
            WHERE table_schema = '${databaseName}' AND CONSTRAINT_NAME = 'PRIMARY' `

            const doesContainerPk = (columnsArray) => columnsArray.some((column) => column.TABLE_NAME === table)
            const queryResultArray = await DatabaseController.query(query);
            expect(doesContainerPk(queryResultArray)).toBe(true);
        })
    })
})

describe('10 different queries should be created', () => {
    queries.forEach(currentQuery => {
        test(currentQuery.name, async () => {
            const thisQuery = currentQuery.query({
                condition: `"first_name" IS NOT NULL`
            })
            console.debug('thisQuery', thisQuery);
            return await expect(DatabaseController.query(thisQuery)).resolves.not.toBe([])
        })
    })
})

afterAll(done => {
    DatabaseController.cloeConnection();
    done();
  })
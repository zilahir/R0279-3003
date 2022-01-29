import { MySql } from './mysql.js'

const DatabaseController = new MySql({
    host: '127.0.0.1',
    username: 'user',
    password: 'DemoPassword'
})

const requiredTables = ['employees', 'departments', 'dept_emp', 'dept_manager', 'titles', 'salaries'];

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

afterAll(done => {
    DatabaseController.cloeConnection();
    done();
  })
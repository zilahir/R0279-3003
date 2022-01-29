import { MySql } from './mysql.js'

const DatabaseController = new MySql({
    host: '127.0.0.1',
    username: 'user',
    password: 'DemoPassword'
})

describe('connection to the database', () => {
    test('is successful', async () => {
        return await expect(DatabaseController.connectToDatabase()).resolves.toBe(true)
    })
})

afterAll(done => {
    DatabaseController.cloeConnection();
    done();
  })
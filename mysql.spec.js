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
        query: _.template('SELECT * FROM employees WHERE ${condition}'),
        condition: '"first_name" IS NOT NULL'
    },
    {
        name: 'seelct from employees',
        query: _.template('SELECT * FROM employees WHERE ${condition}'),
        condition: `"birth_date" < 1611944874`
    },
    {
        name: 'select from salaries where not null',
        query: _.template('SELECT * FROM salaries WHERE ${condition}'),
        condition: `"salary" > 1000`
    },
    {
        name: 'select max salaries from salaries',
        query: _.template('SELECT MAX(salary) FROM salaries WHERE ${condition}'),
        condition: `"salary" IS NOT NULL`
    },
    {
        name: 'select AND',
        query: _.template('SELECT * FROM employees WHERE ${condition}'),
        condition: `("birth_date" < 1616028786882 AND "hire_date" < 1616028786882)`
    },
    {
        name: 'select OR',
        query: _.template('SELECT * FROM employees WHERE ${condition}'),
        condition: `("birth_date" < 1616028786882 OR "hire_date" < 1616028786882)`
    },
    {
        name: 'select AS',
        query: _.template('SELECT salary As EMPLOYEE_SALARY FROM salaries WHERE ${condition}'),
        condition: `"salary" > 10`
    },
    {
        name: 'GROUP BY',
        query: _.template('SELECT COUNT(emp_no), gender FROM employees GROUP BY gender'),
        condition: ``
    },
    {
        name: 'HAVING',
        query: _.template('SELECT emp_no, salary As totalSalary FROM salaries GROUP BY emp_no HAVING totalSalary > 1000'),
        condition: ``
    },
    {
        name: 'LEFT JOIN',
        query: _.template(`SELECT employees.emp_no, salaries.emp_no
                FROM employees
                LEFT JOIN salaries ON employees.emp_no = employees.emp_no
                ORDER BY employees.emp_no;`),
        condition: ``

    },
    {
        name: 'RIGHT JOIN',
        query: _.template(`SELECT employees.emp_no, days_off.emp_no
                FROM employees
                RIGHT JOIN days_off ON employees.emp_no = days_off.emp_no
                ORDER BY employees.emp_no;`),
        condition: ``
    },
    {
        name: 'INNER JOIN',
        query: _.template(`SELECT employees.emp_no, days_off.emp_no
                FROM employees
                INNER JOIN days_off ON employees.emp_no = days_off.emp_no
                ORDER BY employees.emp_no;`),
        condition: ``
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
                condition: currentQuery.condition
            })
            return await expect(DatabaseController.query(thisQuery)).resolves.not.toBe([])
        })
    })
})

afterAll(done => {
    DatabaseController.cloeConnection();
    done();
  })
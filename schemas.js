export const objectSchemas = {
    'employees': Object.assign({}, ...tables.employees.map(field => ({
        [field.name]: '',
    })))
}
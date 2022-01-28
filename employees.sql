DROP DATABASE IF EXISTS R0279_3003;
CREATE DATABASE IF NOT EXISTS R0279_3003;

USE R0279_3003

DROP TABLE IF EXISTS departments,
                     employees,
                     titles,
                     dept_emp,
                     dept_manager,
                     salaries;

CREATE TABLE departments (
    dept_no VARCHAR (36)  NOT NULL,
    dept_name VARCHAR (30)  NOT NULL,
    CONSTRAINT pk_departments PRIMARY KEY (
        dept_no
     )
);

CREATE TABLE employees (
    emp_no VARCHAR (36)  NOT NULL,
    birth_date BIGINT   NOT NULL,
    first_name VARCHAR (30)  NOT NULL,
    last_name VARCHAR (30)  NOT NULL,
    gender VARCHAR (36)  NOT NULL,
    hire_date BIGINT   NOT NULL,
    CONSTRAINT pk_employees PRIMARY KEY (
        emp_no
     )
);

CREATE TABLE dept_emp (
    emp_no VARCHAR (36)  NOT NULL,
    dept_no VARCHAR (36)  NOT NULL,
    from_date BIGINT   NOT NULL,
    to_date BIGINT   NOT NULL,
    CONSTRAINT pk_dept_emp PRIMARY KEY (
        emp_no, dept_no
     )
);

CREATE TABLE dept_manager (
    dept_no VARCHAR (36)  NOT NULL,
    emp_no VARCHAR (36)  NOT NULL,
    from_date BIGINT   NOT NULL,
    to_date BIGINT   NOT NULL,
    CONSTRAINT pk_dept_manager PRIMARY KEY (
        dept_no, emp_no
     )
);

CREATE TABLE salaries (
    emp_no VARCHAR (36)  NOT NULL,
    salary FLOAT  NOT NULL,
    from_date BIGINT   NOT NULL,
    to_date BIGINT   NOT NULL,
    CONSTRAINT pk_salaries PRIMARY KEY (
        emp_no
     )
);

CREATE TABLE titles (
    emp_no VARCHAR (36)  NOT NULL,
    title VARCHAR (50)  NOT NULL,
    from_date BIGINT   NOT NULL,
    to_date BIGINT   NOT NULL
);



ALTER TABLE dept_emp ADD CONSTRAINT fk_dept_emp_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);

ALTER TABLE dept_emp ADD CONSTRAINT fk_dept_emp_dept_no FOREIGN KEY(dept_no)
REFERENCES departments (dept_no);

ALTER TABLE dept_manager ADD CONSTRAINT fk_dept_manager_dept_no FOREIGN KEY(dept_no)
REFERENCES departments (dept_no);

ALTER TABLE dept_manager ADD CONSTRAINT fk_dept_manager_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);

ALTER TABLE salaries ADD CONSTRAINT fk_salaries_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);

ALTER TABLE titles ADD CONSTRAINT fk_titles_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);

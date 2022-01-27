#!/usr/bin/env bash
set -x

echo "### STARTING UP SCRIPT ###"

docker exec -i sql_assignment_db_1 mysql -u user -pDemoPassword < ./employees.sql

echo "### DONE CREATING THE DATABASE###"
echo "### FILLING UP THE DATABASE WITH MOCKED DATA###"
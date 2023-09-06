const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer'); 
const PORT = process.env.PORT || 3001;
const app = express();
const table = require('table');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: '127.0.0.1',//aka local host
    user: 'root',
    password: 'mysql1234',
    database: 'employees_db'
  },
  console.log(`Connected to the employees database.`)
);

function startPrompt() {
  const startQuestion = [{
    type: "list",
    name: "action",
    message: "What would you like to do?",
    loop: false,
    choices: ["View all employees", 
    "View all roles", 
    "View all departments", 
    "Add an employee", 
    "Add a role", 
    "Add a department", 
    "Update role for an employee", 
    "Update employee's manager", 
    "View employees by manager", 
    "Delete a department", 
    "Delete a role", 
    "Delete an employee", 
    "View the total utilized budget of a department", 
    "Quit"]
  }]

  inquier.prompt(startQuestion)
  .then(response => {
    switch (response.action) {
      case "View all employees":
        viewAll("EMPLOYEE");
        break;
      case "View all roles":
        viewAll("ROLE");
        break;
      case "View all departments":
        viewAll("DEPARTMENT");
        break;
      case "add a department":
        addNewDepartment();
        break;
      case "add a role":
        addNewRole();
        break;
      case "add an employee":
        addNewEmployee();
        break;
      case "update role for an employee":
        updateRole();
        break;
      case "view employees by manager":
        viewEmployeeByManager();
        break;
      case "update employee's manager":
        updateManager();
        break;
      case "delete a department":
        deleteDepartment();
        break;
      case "delete a role":
        deleteRole();
        break;
      case "delete an employee":
        deleteEmployee();
        break;
      case "View the total utilized budget of a department":
        viewBudget();
        break;
      default:
        connection.end();
    }
  })
  .catch(err => {
    console.error(err);
  });
}










// app.use((req, res) => {
//   res.status(404).end();
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

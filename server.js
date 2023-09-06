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

  inquirer.prompt(startQuestion)
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

const viewAll = (table) => {
  let query;
  if (table === "DEPARTMENT") {
    query = `SELECT * FROM DEPARTMENT`;
  } else if (table === "ROLE") {
    query = `SELECT R.id AS id, title, salary, D.name AS department
    FROM ROLE AS R LEFT JOIN DEPARTMENT AS D
    ON R.department_id = D.id;`;
  } else {
    query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, 
    R.title AS role, D.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
    FROM EMPLOYEE AS E LEFT JOIN ROLE AS R ON E.role_id = R.id
    LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id
    LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id;`;
  }
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);

    startPrompt();
  });
};

const addNewDepartment = () => {
  let questions = [
    {
      type: "input",
      name: "name",
      message: "Enter department name"
    }
  ];

  inquirer.prompt(questions)
  .then(response => {
    const query = `INSERT INTO department (name) VALUES (?)`;
    db.query(query, [response.name], (err, res) => {
      if (err) throw err;
      console.log(`Successfully inserted ${response.name} department at id ${res.insertId}`);
      startPrompt();
    });
  })
  .catch(err => {
    console.error(err);
  });
}





app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

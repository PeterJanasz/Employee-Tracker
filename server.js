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
    host: '127.0.0.1', // aka localhost
    user: 'root',
    password: 'mysql1234',
    database: 'employees_db'
  },
  console.log(`Connected to the employees database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log(`Connected to the employees database.`);
  startPrompt();
});

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
  }];

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
        case "Add a department":
          addNewDepartment();
          break;
        case "Add a role":
          addNewRole();
          break;
        case "Add an employee":
          addNewEmployee();
          break;
        case "Update role for employee":
          updateRole();
          break;
        case "View employees by manager":
          viewEmployeeByManager();
          break;
        case "Update employee's manager":
          updateManager();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "View the total utilized budget of a department":
          viewBudget();
          break;
        default:
          db.end();
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
        console.log(`Successfully inserted ${response.name} department as id ${res.insertId}`);
        startPrompt();
      });
    })
    .catch(err => {
      console.error(err);
    });
}

const addNewRole = () => {
  const departmentChoices = [];
  db.query("SELECT * FROM DEPARTMENT", (err, res) => {
    if (err) throw err;

    res.forEach(department => {
      let departmentChoice = {
        name: department.name,
        value: department.id
      };
      departmentChoices.push(departmentChoice);
    });

    let questions = [
      {
        type: "input",
        name: "Title",
        message: "What is the title of the new role?"
      },
      {
        type: "input",
        name: "Salary",
        message: "What is the salary of the new role?"
      },
      {
        type: "list",
        name: "Department",
        choices: departmentChoices,
        message: "Which department is this role for?"
      }
    ];

    inquirer.prompt(questions)
      .then(response => {
        const query = `INSERT INTO ROLE (title, salary, department_id) VALUES (?, ?, ?)`;
        db.query(query, [response.title, response.salary, response.department], (err, res) => {
          if (err) throw err;
          console.log(`Successfully added ${response.title} role in id ${response.insertId}`);
          startPrompt();
        });
      })
      .catch(err => {
        console.error(err);
      });
  });
}

const addNewEmployee = () => {
  db.query("SELECT * FROM EMPLOYEE", (err, emplRes) => {
    if (err) throw err;
    const employeeChoices = [
      {
        name: 'None',
        value: 0
      }
    ];
    emplRes.forEach(({ first_name, last_name, id }) => {
      employeeChoices.push({
        name: first_name + " " + last_name,
        value: id
      });
    });

    db.query("SELECT * FROM ROLE", (err, rolRes) => {
      if (err) throw err;
      const roleChoices = [];
      rolRes.forEach(({ title, id }) => {
        roleChoices.push({
          name: title,
          value: id
        });
      });

      let questions = [
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoices,
          message: "What is the employee's role?"
        },
        {
          type: "list",
          name: "manager_id",
          choices: employeeChoices,
          message: "Who is the employee's manager? (If Applicable)"
        }
      ];

      inquirer.prompt(questions)
        .then(response => {
          const query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
          let manager_id = response.manager_id !== 0 ? response.manager_id : null;
          db.query(query, [response.first_name, response.last_name, response.role_id, manager_id], (err, res) => {
            if (err) throw err;
            console.log(`Successfully added employee ${response.first_name} ${response.last_name} with id ${res.insertId}`);
            startPrompt();
          });
        })
        .catch(err => {
          console.error(err);
        });
    });
  });
}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

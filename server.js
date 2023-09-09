const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();

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
    choices: ["View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update employee role",
      // "Update employee's manager",
      // "View employees by manager",
      // "Delete a department",
      // "Delete a role",
      // "Delete an employee",
      // "View the total utilized budget of a department",
      "Quit"]
  }];

  inquirer.prompt(startQuestion)
    .then(response => {
      switch (response.action) {
        case "View all departments":
          viewAll("DEPARTMENT");
          break;
        case "View all roles":
          viewAll("ROLE");
          break;
        case "View all employees":
          viewAll("EMPLOYEE");
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
        case "Update employee role":
          updateRole();
          break;
        // case "View employees by manager":
        //   viewEmployeeByManager();
        //   break;
        // case "Update employee's manager":
        //   updateManager();
        //   break;
        // case "Delete a department":
        //   deleteDepartment();
        //   break;
        // case "Delete a role":
        //   deleteRole();
        //   break;
        // case "Delete an employee":
        //   deleteEmployee();
        //   break;
        // case "View the total utilized budget of a department":
        //   viewBudget();
        //   break;
        default:
          db.end();
      }
    })
    .catch((err) => {
      console.error("An error occurred:", err.message);
      // Handle the error appropriately, e.g., retry, exit gracefully, or log it.
      startPrompt(); // Restart the prompt or take other actions as needed.
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
      startPrompt();
    });
}

const addNewRole = () => {
  const departmentChoices = [];
  db.query("SELECT * FROM DEPARTMENT", (err, departments) => {
    if (err) throw err;

    departments.forEach((department) => {
      const departmentChoice = {
        name: department.name,
        value: department.id,
      };
      departmentChoices.push(departmentChoice);
    });

    const questions = [
      {
        type: "input",
        name: "title",
        message: "What is the title of the new role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?",
        validate: (input) => {
          const salary = parseFloat(input);
          if (isNaN(salary) || salary <= 0) {
            return "Please enter a valid numeric salary greater than 0.";
          }
          return true; 
        },
      },
      {
        type: "list",
        name: "departmentId",
        choices: departmentChoices,
        message: "Which department is this role for?",
      }
    ];

    inquirer.prompt(questions)
      .then((response) => {
        const query = `INSERT INTO ROLE (title, salary, department_id) VALUES (?, ?, ?)`;
        db.query(query, [response.title, response.salary, response.departmentId], (err, res) => {
          if (err) throw err;
          console.log(`Successfully added ${response.title} role as id ${res.insertId}`);
          startPrompt();
        });
      })
      .catch(err => {
        console.error(err);
        startPrompt();
      });
  });
};

const addNewEmployee = () => {
  db.query("SELECT * FROM EMPLOYEE", (err, employeeResults) => {
    if (err) throw err;
    const employeeChoices = [
      {
        name: 'None',
        value: 0
      }
    ];
    employeeResults.forEach(({ first_name, last_name, id }) => {
      employeeChoices.push({
        name: first_name + " " + last_name,
        value: id
      });
    });

    db.query("SELECT * FROM ROLE", (err, roleResults) => {
      if (err) throw err;
      const roleChoices = [];
      roleResults.forEach(({ title, id }) => {
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
          startPrompt();
        });
    });
  });
}

const updateRole = () => { 
  db.query("SELECT * FROM EMPLOYEE", (err, employeeResults) => {
    if (err) throw err;
    const employeeChoice = [];
    employeeResults.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id
      });
    });

    db.query("SELECT * FROM ROLE", (err, roleResults) => {
      if (err) throw err;
      const roleChoice = [];
      roleResults.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id
        });
      });

      let questions = [
        {
          type: "list",
          name: "id",
          choices: employeeChoice,
          message: "Which employee would you like to update?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "What is the employee's new role?"
        }
      ];

      inquirer.prompt(questions)
        .then(response => {
          const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
          db.query(query, [
            { role_id: response.role_id },
            "id",
            response.id
          ], (err, res) => {
            if (err) throw err;

            console.log("Successfully updated employee's role!");
            startPrompt();
          });
        })
        .catch(err => {
      console.error(err);
      startPrompt();
    });
    })
  });
}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

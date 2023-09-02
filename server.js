const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer'); 
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: '127.0.0.1',//aka local host
    user: 'root',
    password: 'mysql1234',
    database: 'employeelist_db'
  },
  console.log(`Connected to the employeelist_db database.`)
);


app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

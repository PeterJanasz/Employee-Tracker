USE employees_db;

INSERT INTO department (name)
VALUES ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 2),
        ("Account Manager", 160000, 2),
        ("Lawyer", 190000, 3),
        ("Lead Engineer", 150000, 1),
        ("Legal Team Lead", 250000, 3),
        ("Salesperson", 80000, 4),
        ("Sales Lead", 100000, 4),
        ("Software Engineer", 120000, 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 2, NULL),
        ("Jane", "Doe", 1, 1),
        ("Emily", "Johnson", 1, 1),
        ("Marcus", "Martinez", 7, NULL),
        ("Sarah", "Thompson", 6, 4),
        ("David", "Rodriguez", 6, 4),
        ("Olivia", "Brown", 5, NULL),
        ("Ethan", "Williams", 3, 7),
        ("Ava", "Davis", 3, 7),
        ("Jackson", "Anderson", 4, NULL),
        ("Mia", "Garcia", 8, 10),
        ("Liam", "Taylor", 8, 10);






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
VALUES ("John", "Smith", 1, NULL),
        ("Jane", "Doe", 1, 1),
        ("Emily", "Johnson", 1, 1),
        ("Marcus", "Martinez", 2, NULL),
        ("Sarah", "Thompson", 2, 2),
        ("David", "Rodriguez", 2, 2),
        ("Olivia", "Brown", 3, NULL),
        ("Ethan", "Williams", 3, 3),
        ("Ava", "Davis", 3, 3),
        ("Jackson", "Anderson", 4, NULL),
        ("Mia", "Garcia", 4, 4),
        ("Liam", "Taylor", 4, 4);






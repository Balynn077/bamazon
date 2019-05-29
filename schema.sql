CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT (100) NOT NULL,
  PRIMARY KEY (item_id)
);



INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Trampoline", "Outdoors", 400.00, 10),
("Magic the Gathering Collection", "Gaming", 60.00, 3),
("Sega Dreamcast", "Videogames", 40.00, 55),
("Easy Bake Oven", "Dangerous Toys", 19.99, 30),
("Nintendo 64", "Videogames", 40.00, 15),
("Diamond Ring", "Jewerly", 1500.00, 2),
("Camping Tent", "Outdoors", 80.00, 10),
("Rubber Boots", "Outdoors", 30.00, 40),
("Sock em Boppers", "Dangerous Toys", 12.00, 60),
("Sunglasses", "Outdoors", 8.00, 80);

SELECT * FROM products;
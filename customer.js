var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');
var colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  });


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

function startPrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to view the Bamazon inventory?".cyan,
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log('Visit us again soon!');
        }
    });
}

function inventory() {

    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });

    listInventory();

    function listInventory() {
        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var itemId = res[i].item_id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stockQuantity = res[i].stock_quantity;

              table.push(
                  [itemId, productName, departmentName, price, stockQuantity]
            );
          }
            console.log("");
            console.log("======================================================".rainbow + "Current Bamazon Inventory".cyan + "======================================================".rainbow);
            console.log("");
            console.log(table.toString());
            console.log("");
            continuePrompt();
        });
    }
}

function continuePrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase an item? ".green,
        default: true

    }]).then(function(user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log(' Visit us again soon! ');
        }
    });
}

function selectionPrompt() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Please enter the ID number of the item you would like to purchase: ".cyan,
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many would you like to purchase?".magenta,

        }
    ]).then(function(userPurchase) {

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {

                    console.log("===============================================================================================".rainbow);
                    console.log("  Item out of stock.".cyan);
                    console.log("===============================================================================================".rainbow);
                    startPrompt();

                } else {
                    //list item information for user for confirm prompt
                    console.log("================================================================".rainbow);
                    console.log("");
                    console.log(" We are able to complete your order!".cyan);
                    console.log("");
                    console.log("================================================================".rainbow);
                    console.log("");
                    console.log("You have selected: ".green);
                    console.log("");
                    console.log("================================================================".rainbow);
                    console.log("");
                    console.log("Item: ".warn + res[i].product_name);
                    console.log("");
                    console.log("Department: ".debug +" " + res[i].department_name);
                    console.log("");
                    console.log(" Price:".magenta + "$" + res[i].price);
                    console.log("");
                    console.log(" Quantity: ".cyan + userPurchase.inputNumber);
                    console.log("");
                    console.log("================================================================".rainbow);
                    console.log("");
                    console.log(" Total:".yellow + "$" + res[i].price * userPurchase.inputNumber);
                    console.log("");
                    console.log("================================================================".rainbow);

                    var newStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
                    confirmPrompt(newStock, purchaseId);
                }
            }
        });
    });
}

function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you would like to purchase this item and quantity?".teal,
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function(err, res) {});

            console.log("=================================================================".rainbow);
            console.log("");
            console.log(" Transaction completed. ".cyan);
            console.log("");
            console.log("=================================================================".rainbow);
            startPrompt();
        } else {
            console.log("=================================================================".rainbow);
            console.log("");
            console.log("Thank yo for shopping at Bamazon!".cyan);
            console.log("");
            console.log("=================================================================".rainbow);
            startPrompt();
        }
    });
}
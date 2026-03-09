//import required modules
import express from "express";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

import db from "./components/db.js"; //load db.js

const __dirname = import.meta.dirname;

//set up Express app
const app = express();
const port = process.env.PORT || "8888";

//set up application template engine
app.set("views", path.join(__dirname, "views")); //the first "views" is the setting name

//the second value above it is the path: __dirname/views
app.set("view engine", "pug");

//setup folder for static files
app.use(express.static(path.join(__dirname, "public")));

//You need the following two lines if you want to access POST/GET data as if they were JSON objects.
//Set Express to extend the URLencoded format and use JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//PAGE ROUTES
app.get("/", async (request, response) => {
  let customerList = await db.getCustomers();
  //if there's nothing in the customers collection, initialize with some content then get the customers again
  if (!customerList.length) {
    await db.initializeCustomers(); 
    customerList = await db.getCustomers();
  };
  let instrumentList = await db.getInstruments();
  //if there's nothing in the instruments collection, initialize it with this content then get instruments again
    if (!instrumentList.length) {
    await db.initializeInstruments(); 
    instrumentList = await db.getInstruments();
  }
  response.render("index", { customers: customerList, instruments: instrumentList });
});

//Go to api page
app.get("/api", async (request, response) => {
  response.render("api");
})

//Receive response.json for customers
app.get("/api/customers", async(request, response) => {
  let customers = await db.getCustomers();
  response.json(customers);
})

//Receive response.json for instruments
app.get("/api/instruments", async(request, response) => {
  let instruments = await db.getInstruments();
  response.json(instruments);
})


//Go to customers page
app.get("/customers", async (request, response) => {
  let customerList = await db.getCustomers();
  //if there's nothing in the customers collection, initialize with some content then get the customers again
  if (!customerList.length) {
    await db.initializeCustomers(); 
    customerList = await db.getCustomers();
  };
  response.render("customers", { customers: customerList });
})

//Go to instruments page
app.get("/instruments", async (request, response) => {
  let instrumentList = await db.getInstruments();
  //if there's nothing in the instruments collection, initialize with some content then get the instruments again
  if (!instrumentList.length) {
    await db.initializeInstruments(); 
    instrumentList = await db.getInstruments();
  };
  response.render("instruments", { instruments: instrumentList });
})

//CUSTOMER ADD / UPDATE / DELETE
//Redirect to customer form page
app.get("/add-customer", async (request, response) => {
  //Add a new default customer
  // await db.addCustomer("New", "Customer", "647-000-0000", "new@customer.com");
  // response.redirect("/");
  response.render("add-customer");
})
//Create a customer from a filled form
app.post("/create-customer", async (request, response) => {
  const first_name = request.body.first_name;
  const last_name = request.body.last_name;
  const phone = request.body.phone;
  const email = request.body.email;
  await db.createCustomer(first_name, last_name, phone, email);
  response.redirect("/customers");
})
//Edit a customer from a filled form
app.get("/edit-customer/:id", async (request, response) => {
  //pass the id of selected customer
  let customerToEdit = await db.getCustomerById(request.params.id);
  //go to customer edit page
  response.render("edit-customer", { customer: customerToEdit });
})
//Update a customer by their mongodb _id
app.post("/update-customer/", async (request, response) => {
  let idFilter = { _id: request.body.id };
  let link = {
    $set: {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      phone: request.body.phone,
      email: request.body.email
    }
  }
  await db.updateCustomerById(idFilter, link);
  response.redirect("/customers");
})

//Delete a customer by their mongodb _id
app.get("/delete-customer/:id", async(request, response) => {
  await db.deleteCustomerById(request.params.id);
  response.redirect("/customers");
})

//INSTRUMENT ADD / DELETE
//Add a new instrument
app.get("/add-instrument", async (request, response) => {
  //Add a new default instrument
  // await db.addInstrument("Instrument", "Default", "0.00", "0");
  // response.redirect("/");
  response.render("add-instrument");
})

//Create an instrument from a filled form
app.post("/create-instrument", async (request, response) => {
  const name = request.body.name;
  const brand = request.body.brand;
  const price = request.body.price;
  const stock_quantity = request.body.stock_quantity;
  await db.createInstrument(name, brand, price, stock_quantity);
  response.redirect("/instruments");
})

//Delete an instrument by their mongodb _id
app.get("/delete-instrument/:id", async(request, response) => {
  await db.deleteInstrumentById(request.params.id);
  response.redirect("/instruments");
})

//****************
//SERVER LISTENER
//****************
//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});



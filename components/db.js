import mongoose from "mongoose";

const dbUrl = `${process.env.MONGO_URI}${process.env.DB_NAME}`;

//set up Schemas and models

//Customer schema
const CustomerSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  phone: String,
  email: String
});
const Customer = mongoose.model("Customer", CustomerSchema);

//Instrument schema
const InstrumentSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  stock_quantity: Number
});
const Instrument = mongoose.model("Instrument", InstrumentSchema);

await mongoose.connect(dbUrl); // if your dbUrl has a user, you must use await.

//MONGODB FUNCTIONS

//on initial load, ...
async function initializeCustomers() {
  let customerArray = [
    {
      "first_name": "Peter",
      "last_name": "Slempers",
      "phone": "6471234321",
      "email": "ps@gmail.com"
    },
    {
      "first_name": "John",
      "last_name": "Doe",
      "phone": "4161234321",
      "email": "jd@gmail.com"
    },
    {
      "first_name": "Keanu",
      "last_name": "Reeves",
      "phone": "9999999999",
      "email": "theone@gmail.com"
    }
  ];
  await Customer.insertMany(customerArray);
}
//Get all customers from the customers collection
async function getCustomers() {
  return await Customer.find({}); //return array for find all
}

//Get a customer by their mongodb _id
async function getCustomerById(id) {
  return await Customer.findOne({ _id: String(id) })
}

//Function to add a customer to the customers collection
async function createCustomer(first_name, last_name, phone, email) {
  let newCustomer = new Customer ({
    first_name: String(first_name),
    last_name: String(last_name),
    phone: String(phone),
    email:String(email)
  });
  newCustomer.save(); //save the new customer to the DB
}

//Function to update pet name
async function updateCustomerById(filter, link) {
  await Customer.updateOne(filter, link);
}

//Function to delete customer by id
async function deleteCustomerById(id) {
  try {
    await Customer.deleteOne({ _id: String(id) });
  }
  catch(e) {
    print(e);
  }
}

//INSTRUMENT FUNCTIONS

//On initial load...
async function initializeInstruments() {
  let instrumentArray = [
    {
      "name": "Les Paul",
      "brand": "Gibson",
      "price": 2999.99,
      "stock_quantity": 17
    },
    {
      "name": "Les Paul",
      "brand": "Epiphone",
      "price": 699.99,
      "stock_quantity": 48
    },
    {
      "name": "P Bass Ultra",
      "brand": "Fender",
      "price": 3239.99,
      "stock_quantity": 1
    }
  ];
  await Instrument.insertMany(instrumentArray);
}

//Get all instruments from the instrument collection
async function getInstruments() {
  return await Instrument.find({}); //return array for find all
}

//Function to add an instrument to the instruments collection
async function createInstrument(name, brand, price, stock_quantity) {
  let newInstrument = new Instrument ({
    name: String(name),
    brand: String(brand),
    price: Number(price),
    stock_quantity: Number(stock_quantity)
  });
  newInstrument.save(); //save the new customer to the DB
}

//Function to delete instrument by id
async function deleteInstrumentById(id) {
  try {
    await Instrument.deleteOne({ _id: String(id) });
  }
  catch(e) {
    print(e);
  }
}

export default {
  initializeCustomers,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
  initializeInstruments,
  getInstruments,
  createInstrument,
  deleteInstrumentById
}
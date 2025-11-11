# 📡Payment integration 

A application backend built with **Node.js**, **Express**, and **MongoDB**.  

This project provides payment integration with nepalese payment gateways.

---

##  Features
- 🗄️ MongoDB Integration for order and payment data 
- ⚡ Express REST API for payment flow

---

## Tech Stack
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB + Mongoose | Database |

---

## Project Structure 
├── api/ # API routes
├── database/ # Database connection 
├── views/ # frontend ejs 
├── services/v1/authentication/ # Auth services 
├── utils/ # Utility functions 
├── index.js # Entry point 
├── package.json 
├── README.md

Environment Variables
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatapp
ESEWASECRET=secretkey
MONGOURI=mongodb://127.0.0.1:27017/payment
BASEURL=your base website url

Running the Server
# Development
npm run dev

# Production
npm run start





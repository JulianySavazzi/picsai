import express from "express"
import routes from "./src/routes/routes.js";

const app = express() //init express - node server
app.use(express.static("uploads")) //public directory configuration for upload images
routes(app) //add routes in server

//listen requests in port
app.listen(3000, () => {
    console.log("server listening...")
})


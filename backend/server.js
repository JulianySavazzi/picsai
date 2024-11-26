import express from "express"

const app = express() //init express - node server
app.use(express.json()) //for all responses parsed for json

//listen requests in port
app.listen(3000, () => {
    console.log("server listening...")
})



// function getPostById(id){
//     return dataMocked.findIndex((data) => {
//           return data.id === Number(id)
//     })
// }

//routes

app.get("/", (request, response) => {
    response.status(200).json('welcome')
})

app.get("/api", (request, response) => {
    response.status(200).send("success")
})

app.get("/posts", async (request, response) => {
    const posts = await getAllPosts()
    response.status(200).json(posts)
})

// app.get("/posts/:id", (request, response) => {
//     const index = getPostById(request.params.id)
//     response.status(200).json(dataMocked[index])
// })
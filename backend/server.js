import express from "express"

const dataMocked = [
    {
        id: 1,
        description: 'Um lindo gatinho dormindo',
        image: 'https://cdn.pixabay.com/photo/2023/08/29/20/00/dahlia-8222052_1280.jpg'
    },
    {
        id: 2,
        description: 'Uma paisagem montanhosa',
        image: 'https://cdn.pixabay.com/photo/2023/08/29/20/00/dahlia-8222052_1280.jpg'
    },
    {
        id: 3,
        description: 'Um delicioso bolo de chocolate',
        image: 'https://cdn.pixabay.com/photo/2023/08/29/20/00/dahlia-8222052_1280.jpg'
    },
]

const app = express() //init express
app.use(express.json()) //for all responses parsed for json

//listen requests in port
app.listen(3000, () => {
    console.log("server listening...")
})

function getPostById(id){
    return dataMocked.findIndex((data) => {
          return data.id === Number(id)
    })
}

//routes
app.get("/api", (request, response) => {
    response.status(200).send("success")
})

app.get("/posts", (request, response) => {
    response.status(200).json(dataMocked)
})

app.get("/posts/:id", (request, response) => {
    const index = getPostById(request.params.id)
    response.status(200).json(dataMocked[index])
})
import express from "express"
import multer from "multer"
import {listPosts, saveNewPost, uploadImage, updateNewPost, deletePostById, getSinglePostById} from "../controller/postsController.js"
import cors from "cors"

const corsOptions = {
    origin: process.env.myBackendHost,
    optionsSuccessStatus: 200
}

//directory and filename configuration for upload images
const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, 'uploads/')
    }, //directory for storage upload images
    filename: function (request, file, cb){
        cb(null, file.originalname)
    }
})

//Middleware Multer instance for upload
const upload = multer({
    storage: storage,
    fields: [
        { name: 'image', maxCount: 1 } //define field "image" has permission, and accept a single file
    ]
})

//Express routes
const routes = (app) => {
    app.use(express.json()) //for all responses parsed for json
    app.use(cors(corsOptions))

    //list all posts
    app.get("/posts", listPosts)

    //list single post by id
    app.get("/posts/:id", getSinglePostById)

    //create new post clean
    app.post("/posts", saveNewPost)

    //upload an image for each -> form-data field image, type file
    app.post("/upload", upload.single("image"), uploadImage)

    //update post by id with new filename and gemini AI description and alt by generated description
    app.put("/upload/:id", updateNewPost)

    //delete post by id
    app.delete("/delete/:id", deletePostById)
}

export default routes
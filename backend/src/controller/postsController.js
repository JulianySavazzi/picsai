//functions for routes response here and crud, use gemini service
import {getAllPosts, createPost, updatePost, deletePost, getPostById} from "../models/postModel.js"
import fs from "fs" //native library for filesystem in node.js
import generateDescriptionWithGemini from "../services/gemini.js"

//retrieving all posts list
export async function listPosts(request, response){
    const posts = await getAllPosts()
    response.status(200).json(posts)
}

export async function getPostById(request, response){
    const id = request.params.id;

    try{
        const post = await getPostById(id)
        response.status(200).json(post)
    } catch (error) {
    console.error(error.message)
    response.status(500).json({"Erro no upload": "Falha na requisição!"})
    }
}

//save new document in collection posts
export async function saveNewPost(request, response) {
    const newPost = request.body
    try{
        const created = await createPost(newPost)
        response.status(200).json(created)
    } catch (error) {
        console.log(error.message)
        response.status(500).json({"Erro ao salvar": "Falha na requisição!"})
    }
}

//upload image using fs and associate a new created post
export async function uploadImage(request, response) {
    const post = {
        description: "",
        url_image: "",
        alt: ""
    }

    try{
        const createdPost = await createPost(post) //create and return id from created post
        const updatedImage = `uploads/${createdPost.insertedId}.png` //upload png file path
        fs.renameSync(request.file.path, updatedImage) //rename file and move temp file for upload directory
        post.url_image = `/uploads/${createdPost.insertedId}.png` //set in post a correct image URL
        response.status(200).json(createdPost)
    } catch (error) {
        console.error(error.message)
        response.status(500).json({"Erro no upload": "Falha na requisição!"})
    }
}

export async function updateNewPost(request, response) {
    const id = request.params.id //request id from updated post
    const host = process.env.myHost //hostname
    const urlImage = `${host}/${id}.png` //url from image in host
    try{
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`) //read file
        const description = await generateDescriptionWithGemini(imgBuffer) //create image description using gemini Ai

        const updatedPost = { //set data for update
            description: description,
            url_image: urlImage,
            alt: request.body.alt
        }

        const savedPost = await updatePost(id, updatedPost)
        response.status(200).json(savedPost)
    } catch (error) {
        console.error(error.message)
        response.status(500).json({"Erro ao atualizar": "Falha na requisição!"})
    }
}

export async function deletePostById(request, response) {
    const id = request.params.id;

    try {
        await deletePost(id);
        response.status(204).send();
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ error: "Erro ao deletar o post" });
    }
}
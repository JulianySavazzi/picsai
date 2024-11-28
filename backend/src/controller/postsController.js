//functions for routes response here and crud, use gemini service
import {getAllPosts, createPost, updatePost, deletePost, getPostById} from "../models/postModel.js"
import fs from "fs" //native library for filesystem in node.js
import generateDescriptionWithGemini from "../services/gemini.js"

//retrieving all posts list
export async function listPosts(request, response){
    const posts = await getAllPosts()
    response.status(200).json(posts)
}

export async function getSinglePostById(request, response){
    const id = request.params.id;

    try{
        const post = await getPostById(id)
        response.status(200).json(post)
    } catch (error) {
        console.error(error.message)
        response.status(500).json({"Erro": "Falha na requisição!"})
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

        fs.copyFileSync(request.file.path, updatedImage) //copy file por uploads directory
        if(fs.existsSync(updatedImage)) {
            // fs.unlinkSync(request.file.path) //remove temp file
            fs.renameSync(request.file.path, updatedImage) //rename file in uploads directory
        } else response.status(504).json({"Erro": "Falha ao copiar arquivo!"})

        post.url_image = `/uploads/${createdPost.insertedId}.png` //set in post a correct image URL
        response.status(200).json(createdPost)
    } catch (error) {
        console.error(error.message)
        response.status(500).json({"Erro no upload": `Falha na requisição! `})
    }
}

export async function updateNewPost(request, response) {
    const id = request.params.id //request id from updated post
    const host = process.env.myHost //hostname
    const urlImage = `${host}/${id}.png` //url from image in host
    try{
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`) //read file
        const description = await generateDescriptionWithGemini(imgBuffer) //create image description using gemini Ai

        //for generate new alt, using AI description
        const textPrefix = "Aqui está uma descrição da imagem em português do Brasil:"
        const newAlt = description.slice(textPrefix.length)
        const textTrim = newAlt.indexOf('.')

        const updatedPost = { //set data for update
            description: description,
            url_image: urlImage,
            alt: newAlt.slice(0, textTrim)
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
//database connection here an data models
import 'dotenv/config'
import {ObjectId} from "mongodb"
import databaseConnect from "../config/database.js"

const connection = await databaseConnect(process.env.conn) //database connection
const db = connection.db('instabyte') //instance of database for crud

//get all documents in collection posts in database instabytes and return an array with data
export async function getAllPosts() {
    const collection = db.collection('posts')
    return collection.find().toArray()
}

//save post in collection posts, using inserOne for insert an unic post for each
export async function createPost(post){
    const collection = db.collection('posts')
    return collection.insertOne(post) //insertOne is a method from MongoDB API
}

//update post by id
export async function updatePost(id, post) {
    const collection = db.collection('posts')
    const objId = ObjectId.createFromHexString(id) //send id from post for update in MongoDB - convert string for ObjectID
    return collection.updateOne(
        {_id: new ObjectId(objId)}, {$set:post}) //update data in selected post - MongoDB API method
}

//delete post by id
export async function deletePost(id, post) {
    const collection = db.collection('posts')
    const objId = ObjectId.createFromHexString(id) //send id from deleted post - convert string for ObjectID
    try {
        const result = await collection.deleteOne({ _id: objId }) //delete selected post - MongoDB API method
        console.log(`${result.deletedCount} document(s) was/were deleted.`)
    } catch (err) {
        console.error('Error deleting post:', err);
        throw err // Re-throw the error to be handled by the calling function
    }
}
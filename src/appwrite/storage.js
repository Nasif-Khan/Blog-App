import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class StorageService{
    client = new Client();
    databases;
    storage;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)

        
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug, // ID.unique()
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                })
        } catch (error) {
            // throw error
            console.log("Error in Appwrite StorageService.createPost: ", error)
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId, // databaseId
                conf.appwriteCollectionId, // collectionId
                slug, // documentId
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        } catch (error) {
            console.log("Error in Appwrite StorageService.updatePost: ", error)
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId, // databaseId
                conf.appwriteCollectionId, // collectionId
                slug // documentId
            )
            return true
        } catch (error) {
            console.log("Error in Appwrite StorageService.deletePost: ", error)
            return false
        }
    }

    async getPost(slug){
        try {
            return  await this.databases.getDocument(
                conf.appwriteDatabaseId, // databaseId
                conf.appwriteCollectionId, // collectionId
                slug, // documentId
                [] // queries (optional)
            )
        } catch (error) {
            console.log("Error in Appwrite StorageService.getPost: ", error)
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        // console.log("Calling getPosts in Appwrite StorageService")
        try {
            // return keyword was not added, causing the function to return undefined, thereby not showing the posts
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId, // databaseId
                conf.appwriteCollectionId, // collectionId
                queries // queries (optional)
            )
        } catch (error) {
            console.log("Error in Appwrite StorageService.getPosts: ", error)
            return false
        }
    }

    // File Upload
    async uploadFile(file){
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Error in Appwrite StorageService.uploadFile: ", error)
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketId, // bucketId
                fileId // fileId
            )
            return true
        } catch (error) {
            console.log("Error in Appwrite StorageService.deleteFile: ", error)
            return false
        }
    }

    getFilePreview(fileId){
        return this.storage.getFilePreview(
            conf.appwriteBucketId, fileId
        )
    }
}

const storageService = new StorageService();

export default storageService;
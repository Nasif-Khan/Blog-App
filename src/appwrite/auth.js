import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor () {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)

        this.account = new Account(this.client)
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if(userAccount){
                // call a function
                // log user in
                return this.login({email, password})
            }
            else{
                return userAccount
            }
        } catch (error) {
            // throw error
            console.log("Error in Appwrite AuthService.createAccount: ", error)
        }
    }

    async login({email, password}){
        try {
            const user = await this.account.createEmailPasswordSession(email, password);
            console.log("Login response: ", user);
            return user
        } catch (error) {
            // throw error
            console.log("Error in Appwrite AuthService.login: ", error)
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            // throw error
            console.log("Error in Appwrite AuthService.getCurrentUser: ", error)
        }

        return null
    }

    async logout(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            // throw error
            console.log("Error in Appwrite AuthService.logout: ", error)
        }
    }
}

const authService = new AuthService()

export default authService
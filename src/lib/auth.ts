import {db} from "@/lib/db";
import {UpstashRedisAdapter} from "@next-auth/upstash-redis-adapter";
import GoogleProvider from 'next-auth/providers/google'
import {NextAuthOptions} from "next-auth";

interface googleCredProps{
    clientId: string;
    clientSecret: string;
}

export class Auth {
    static isValidSecret(secret: string | undefined) {
        return secret && secret.length > 0
    }

    static getSecretType(clientId : string | undefined){
       if (this.isValidSecret(clientId)) {
           return 'SECRET'
       }
       return 'ID'
   }

   static hasValidSecret(clientId: string | undefined, clientSecret: string | undefined){
       return this.isValidSecret(clientId) && this.isValidSecret(clientSecret)
   }

   static googleCredentialsError(clientId : string | undefined){
        return new Error(`missing GOOGLE_CLIENT_${this.getSecretType(clientId)} .env variable`)
   }

   static getGoogleCredentials():googleCredProps{
        const clientId = process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET

        if (!this.hasValidSecret(clientId, clientSecret)) {
            throw this.googleCredentialsError(clientId)
        }

        return {
            clientId: clientId as string,
            clientSecret: clientSecret as string,
        }
    }


    static  async JWTCallback({ token, user}) {
        const dbUser = await Auth._db().get(`user:${token?.id}`) as User | null
        if(!dbUser){
            token.id = user!.id
            return token
        }
        return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.image,
        }
    }

    static async sessionCallback({session, token}){
        if (token){
            session.user = token
        }
        return session
    }

    static  redirectCallback({url, baseUrl}){
        if (url.startsWith("/")){
            return `${baseUrl}${url}`
        }
        if  (new URL(url).origin === baseUrl){
            return url
        }
        return baseUrl
    }

    static options(): NextAuthOptions {
         return {
            adapter: UpstashRedisAdapter(this._db()),
             session:{
                strategy: 'jwt'
             },
             providers:[
                 GoogleProvider(this.getGoogleCredentials())
             ],
             pages:{
                signIn:'/login'
             },
             callbacks: {
                 jwt: this.JWTCallback,
                 session: this.sessionCallback,
                 redirect: this.redirectCallback
             }
        }
    }

    static _db(){
         return db
    }
}
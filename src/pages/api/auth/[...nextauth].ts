import {Auth} from "@/lib/auth"
import NextAuth from "next-auth/next";

export default NextAuth(Auth.options())
import {FC} from 'react'
import {getServerSession} from "next-auth"
import {Auth} from "@/lib/auth"

const Page: FC = async ({}) => {
    await getServerSession(Auth.options())
    return <></>
}

export default Page

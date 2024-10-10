import { ReactNode} from "react";
import MyGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({children}: LayoutProps)=>{
    const session = await MyGetServerSession()
    if (!session)notFound()
    return <div>{children}</div>;
}

export default Layout;

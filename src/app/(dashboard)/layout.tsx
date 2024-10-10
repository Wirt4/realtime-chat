import { ReactNode} from "react";
import MyGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({children}: LayoutProps)=>{
    await MyGetServerSession()
    notFound()
    return <div>{children}</div>;
}

export default Layout;

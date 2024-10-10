import { ReactNode} from "react";
import MyGetServerSession from "@/lib/myGetServerSession";
interface LayoutProps {
    children: ReactNode
}
const Layout = async ({children}: LayoutProps)=>{
    await MyGetServerSession()
    return <div>{children}</div>;
}

export default Layout;

import {FC} from "react";
import {notFound} from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";



const Page: FC = async () => {
    const session = await myGetServerSession();

    if (!session){
        notFound();
    }

    return <div/>
}

export default Page;

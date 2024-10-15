import {LucideProps} from "lucide-react";
import Logopath from "@/assets/svgPaths/logopath";
import AddUserPath from "@/assets/svgPaths/addUserPath";
import UserIconPath from "@/assets/svgPaths/userIconPath";

export const Icons = {
    Logo: (props: LucideProps)=>{
        return <svg data-testid="logo-component" {...props}  viewBox="0 0 32 32" >
           <Logopath/>
        </svg>
    },
    AddUser: (props: LucideProps)=>{
        return <svg viewBox="0 0 32 32" {...props} >
     <AddUserPath/>
    </svg>
    },
    User: (props: LucideProps)=> {
        return <svg viewBox="0 0 32 32" {...props} >
            <UserIconPath/>
        </svg>
    }
}

export type Icon = keyof typeof Icons;

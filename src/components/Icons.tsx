import {LucideProps} from "lucide-react";
import Logopath from "@/assets/svgPaths/logopath";
import AddUserPath from "@/assets/svgPaths/addUserPath";

export const Icons = {
    Logo: (props: LucideProps)=>{
        return <svg data-testid="logo-component" {...props}  viewBox="0 0 32 32" >
           <Logopath/>
        </svg>
    },
    AddUser: (props: LucideProps)=>{
        return <svg viewBox="0 0 32 32" data-test-id='adduser-component' {...props} >
     <AddUserPath/>
    </svg>
    }
}

export type Icon = keyof typeof Icons;

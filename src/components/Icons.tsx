import {LucideProps, UserPlus, User} from "lucide-react";
import Logopath from "@/assets/svgPaths/logopath";

export const Icons = {
    Logo: (props: LucideProps)=>{
        return <svg data-testid="logo-component" {...props}  viewBox="0 0 32 32" >
           <Logopath/>
        </svg>
    },
    UserPlus,
    User
}

export type Icon = keyof typeof Icons;

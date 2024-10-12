import {LucideProps, UserPlus} from "lucide-react";
import Logopath from "@/assets/svgPaths/logopath";

export const Icons = {
    Logo: (props: LucideProps)=>{
        return <svg data-testid="logo-component" {...props} viewBox='0 -375 2000 2250'>
            <Logopath/>
        </svg>
    },
    UserPlus
}

export type Icon = keyof typeof Icons;
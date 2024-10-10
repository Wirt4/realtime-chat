import {LucideProps, UserPlus} from "lucide-react";
import Gatorpath from "@/assets/svgPaths/gatorpath";

export const Icons = {
    Logo: (props: LucideProps)=>{
        return <svg {...props} viewBox='0 0 2000 2000'>
            <Gatorpath/>
        </svg>
    },
    UserPlus
}

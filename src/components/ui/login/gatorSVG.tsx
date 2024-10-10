import {FC} from "react";
import Gatorpath from "@/assets/svgPaths/gatorpath";
interface gatorGraphicProps{}

const GatorGraphic: FC<gatorGraphicProps> = ({}) =>{
    return<svg width="350px" height="350px" viewBox="0 0 1024 1024" className="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg">
        <Gatorpath/>
    </svg>
}

export default GatorGraphic

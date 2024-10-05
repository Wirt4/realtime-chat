import {FC} from "react";
import {ButtonProps} from "@/components/ui/button/buttonProps";
import {Loader2} from "lucide-react";

const Button:FC<ButtonProps> = (args: ButtonProps)=>{
    const {isLoading, children, ...props} = args
    return <button disabled={isLoading} {...props}>
        {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin'/> :null}
        {children}
    </button>
}
export default Button

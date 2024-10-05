import {FC} from "react";
import {ButtonProps} from "@/components/ui/button/buttonProps";

const Button:FC<ButtonProps> = (args: ButtonProps)=>{
    const {...props} = args
    return <button disabled={args.isLoading} {...props}></button>
}
export default Button

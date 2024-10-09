"use client"
import {FC} from "react";
import {ButtonProps} from "@/components/ui/button/buttonProps";
import {Loader2} from "lucide-react";
import {Utils} from "@/lib/utils";

const Button:FC <ButtonProps> = (args: ButtonProps)=>{
    const {variant, size, className, isLoading, children, ...props} = args
    const cName = Utils.buttonClassNames({variant, size, className})
    return <button className={cName} disabled={isLoading} {...props}>
        {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin'/> :null}
        {children}
    </button>
}

export default Button

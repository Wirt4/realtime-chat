import {ButtonHTMLAttributes} from "react"
import {VariantProps} from "class-variance-authority"
import ButtonVariants from "@/components/ui/button/buttonVariants"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants>{
    isLoading?: boolean
}

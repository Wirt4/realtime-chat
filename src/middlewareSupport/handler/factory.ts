import { IHandler } from "@/middlewareSupport/handler/interface"
import { Handler } from "@/middlewareSupport/handler/handler"
export function handlerFactory(): IHandler {
    return new Handler()
}
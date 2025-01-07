import { IRouteHandler } from "@/middlewareSupport/handler/interface"
import { RouteHandler } from "@/middlewareSupport/handler/implementation"
import { NextRequest } from "next/server"

export function handlerFactory(request: NextRequest, protectedEndpoint: string): IRouteHandler {
    return new RouteHandler(request, protectedEndpoint)
}

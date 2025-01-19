import { IRouteHandler } from "@/services/middleware/handler/interface"
import { RouteHandler } from "@/services/middleware/handler/implementation"
import { NextRequest } from "next/server"

export function handlerFactory(request: NextRequest, protectedEndpoint: string): IRouteHandler {
    return new RouteHandler(request, protectedEndpoint)
}

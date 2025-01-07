import { handlerFactory } from "@/middlewareSupport/handler/factory"
import { NextRequest } from "next/server"
import { RouteHandler } from "@/middlewareSupport/handler/implementation"
import { IRouteHandler } from "@/middlewareSupport/handler/interface"

jest.mock("@/middlewareSupport/authenticator/implementation")
jest.mock("@/middlewareSupport/handler/implementation")

describe('factories tests', () => {
    it('parameter passed to authenticator factory should be passed to the constructor', () => {
        const request = {} as NextRequest;
        const endpoint = '/forbidden'
        const handler: IRouteHandler = handlerFactory(request, endpoint)
        expect(RouteHandler as jest.Mock).toHaveBeenCalledWith(request, endpoint);
    })
})

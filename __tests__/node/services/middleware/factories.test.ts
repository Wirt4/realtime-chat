import { handlerFactory } from "@/services/middleware/handler/factory"
import { NextRequest } from "next/server"
import { RouteHandler } from "@/services/middleware/handler/implementation"
import { IRouteHandler } from "@/services/middleware/handler/interface"

jest.mock("@/services/middleware/authenticator/implementation")
jest.mock("@/services/middleware/handler/implementation")

describe('factories tests', () => {
    it('parameter passed to authenticator factory should be passed to the constructor', () => {
        const request = {} as NextRequest;
        const endpoint = '/forbidden'
        const handler: IRouteHandler = handlerFactory(request, endpoint)
        expect(RouteHandler as jest.Mock).toHaveBeenCalledWith(request, endpoint);
    })
})

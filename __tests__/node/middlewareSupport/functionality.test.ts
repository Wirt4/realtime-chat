import { Middleware } from "@/middlewareSupport/functionality/implementation"
import { NextRequest } from "next/server";
import { IRouteHandler } from "@/middlewareSupport/handler/interface";
import { handlerFactory } from "@/middlewareSupport/handler/factory";
import { IAuthenticator } from "@/middlewareSupport/authenticator/interface";
import { authenticatorFactory } from "@/middlewareSupport/authenticator/factory";

jest.mock("@/middlewareSupport/handler/factory")
jest.mock("@/middlewareSupport/authenticator/factory")

const createMockRequest = (pathname: string, url: string) => ({
    nextUrl: { pathname },
    url,
});

describe('Middleware, functionality tests', () => {
    let middleware: Middleware
    let mockHandler: IRouteHandler
    let mockAuthenticator: IAuthenticator

    beforeEach(() => {
        jest.resetAllMocks();
        mockHandler = {
            isAccessingProtectedroute: jest.fn(),
            redirectTo: jest.fn(),
            next: jest.fn(),
            isPointingTo: jest.fn()
        };
        mockAuthenticator = {
            fetchJWT: jest.fn(),
            isValid: jest.fn()
        }
        middleware = new Middleware();
    });

    test('if user is trying to access login page and is not authenticated, then middleware directs them through', async () => {
        const MockRequest = createMockRequest('/login', 'http://localhost:8000');
        mockAuthenticator.isValid = jest.fn().mockReturnValueOnce(false);
        (authenticatorFactory as jest.Mock).mockReturnValueOnce(mockAuthenticator);
        mockHandler.isPointingTo = jest.fn().mockReturnValue(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);


        await middleware.processRequest(MockRequest as NextRequest);

        expect(mockHandler.next).toHaveBeenCalled();
    });

    test("if user is trying to access login page and is  authenticated, then middleware doesn't call next", async () => {
        const MockRequest = createMockRequest('/login', 'http://localhost:8000');
        mockAuthenticator.isValid = jest.fn().mockReturnValueOnce(true);
        (authenticatorFactory as jest.Mock).mockReturnValueOnce(mockAuthenticator);
        mockHandler.isPointingTo = jest.fn().mockReturnValueOnce(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);

        await middleware.processRequest(MockRequest as NextRequest);

        expect(mockHandler.next).not.toHaveBeenCalled();
    });

    test('if is login page and user is authenticated, then redirect to dashboard, different data', async () => {
        const MockRequest = createMockRequest('/login', 'http://liveendpoint.com');

        mockAuthenticator.isValid = jest.fn().mockReturnValueOnce(true);
        (authenticatorFactory as jest.Mock).mockReturnValueOnce(mockAuthenticator);
        mockHandler.isPointingTo = jest.fn().mockReturnValueOnce(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);


        await middleware.processRequest(MockRequest as NextRequest);

        expect(mockHandler.redirectTo).toHaveBeenCalledWith('/dashboard')
        expect(mockHandler.isPointingTo).toHaveBeenCalledWith('/login')
    });

    test('if request is not authenticated and accessing a pathname that starts with "/dashboard", then redirect to login', async () => {
        const MockRequest = createMockRequest('/dashboard-extra-path-values', 'http://liveendpoint.com');
        mockAuthenticator.isValid = jest.fn().mockReturnValueOnce(false);
        (authenticatorFactory as jest.Mock).mockReturnValueOnce(mockAuthenticator);
        mockHandler.isAccessingProtectedroute = jest.fn().mockReturnValueOnce(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);

        await middleware.processRequest(MockRequest as NextRequest);
        expect(mockHandler.redirectTo).toHaveBeenCalledWith('/login')
    });

    test('if request is for the home page, then redirect to dashboard', async () => {
        mockAuthenticator.isValid = jest.fn().mockReturnValueOnce(true);
        (authenticatorFactory as jest.Mock).mockReturnValueOnce(mockAuthenticator);
        mockHandler.isPointingTo = jest.fn().mockReturnValue(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);

        const MockRequest = createMockRequest('/', 'http://liveendpoint.com');

        await middleware.processRequest(MockRequest as NextRequest);

        expect(mockHandler.redirectTo).toHaveBeenCalledWith('/dashboard')
    });

    test('the handler should fetch the token', async () => {
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);
        const MockRequest = createMockRequest('/', 'http://liveendpoint.com');
        (authenticatorFactory as jest.Mock).mockReturnValue(mockAuthenticator);
        await middleware.processRequest(MockRequest as NextRequest);
        expect(mockAuthenticator.fetchJWT).toHaveBeenCalled()
    })
});

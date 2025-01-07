import { Middleware } from "@/middlewareSupport/functionality"
import { NextRequest } from "next/server";
import { IHandler } from "@/middlewareSupport/handler/interface";
import { handlerFactory } from "@/middlewareSupport/handler/factory";

jest.mock("@/middlewareSupport/handler/factory")

const createMockRequest = (pathname: string, url: string) => ({
    nextUrl: { pathname },
    url,
});


describe('Middleware, functionality tests', () => {
    let middleware: Middleware
    let mockHandler: IHandler

    beforeEach(() => {
        jest.resetAllMocks();
        mockHandler = {
            isAccessingSensitiveRoute: jest.fn(),
            isAuthenticated: jest.fn(),
            redirectToLogin: jest.fn(),
            redirectToDashboard: jest.fn(),
            isLogin: jest.fn(),
            next: jest.fn(),
            isPointingToHome: jest.fn(),
            setRequest: jest.fn(),
            setJWT: jest.fn()
        }
        middleware = new Middleware(mockHandler);
    });

    test('if user is trying to access login page and is not authenticated, then middleware directs them through', async () => {
        const MockRequest = createMockRequest('/login', 'http://localhost:8000');
        mockHandler.isAuthenticated = jest.fn().mockReturnValueOnce(false)
        mockHandler.isLogin = jest.fn().mockReturnValueOnce(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);
        middleware = new Middleware();
        await middleware.processRequest(MockRequest as NextRequest);

        expect(mockHandler.next).toHaveBeenCalled();
    });

    test("if user is trying to access login page and is  authenticated, then middleware doesn't call next", async () => {
        const MockRequest = createMockRequest('/login', 'http://localhost:8000');
        mockHandler.isAuthenticated = jest.fn().mockReturnValueOnce(true)
        mockHandler.isLogin = jest.fn().mockReturnValueOnce(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);
        middleware = new Middleware();
        await middleware.processRequest(MockRequest as NextRequest);

        expect(mockHandler.next).not.toHaveBeenCalled();
    });

    test('if is login page and user is authenticated, then redirect to dashboard, different data', async () => {
        const MockRequest = createMockRequest('/login', 'http://liveendpoint.com');

        mockHandler.isAuthenticated = jest.fn().mockReturnValueOnce(true);
        mockHandler.isLogin = jest.fn().mockReturnValueOnce(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);
        middleware = new Middleware();

        await middleware.processRequest(MockRequest as NextRequest);

        expect(mockHandler.redirectToDashboard).toHaveBeenCalled()
    });

    test('if request is not authenticated and accessing a pathname that starts with "/dashboard", then redirect to login', async () => {
        const MockRequest = createMockRequest('/dashboard-extra-path-values', 'http://liveendpoint.com');
        mockHandler.isAuthenticated = jest.fn().mockReturnValueOnce(false)
        mockHandler.isAccessingSensitiveRoute = jest.fn().mockReturnValueOnce(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);
        middleware = new Middleware();
        await middleware.processRequest(MockRequest as NextRequest);
        expect(mockHandler.redirectToLogin).toHaveBeenCalled()
    });

    test('if request is for the home page, then redirect to dashboard', async () => {
        mockHandler.isAuthenticated = jest.fn().mockReturnValueOnce(true);
        mockHandler.isPointingToHome = jest.fn().mockReturnValue(true);
        (handlerFactory as jest.Mock).mockReturnValue(mockHandler);

        middleware = new Middleware();
        const MockRequest = createMockRequest('/', 'http://liveendpoint.com');

        await middleware.processRequest(MockRequest as NextRequest);

        expect(mockHandler.redirectToDashboard).toHaveBeenCalled()
    });
});

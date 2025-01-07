import { RouteHandler } from "@/middlewareSupport/handler/implementation";
import { NextRequest } from "next/server";
import { NextResponseWrapper } from "@/lib/nextResponseWrapper";

jest.mock("@/lib/nextResponseWrapper", () => ({
    NextResponseWrapper: {
        next: jest.fn(),
        redirect: jest.fn(),
    }
}));

const createMockRequest = (pathname: string, url: string) => ({
    nextUrl: { pathname },
    url,
} as unknown as NextRequest);

describe('Handler', () => {
    let handler: RouteHandler;
    let mockRequest: NextRequest;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('isLogin returns true when path starts with /login', () => {
        mockRequest = createMockRequest('/login', 'http://localhost:8000');
        handler = new RouteHandler(mockRequest, '/dashboard');

        expect(handler.isPointingTo('/login')).toBe(true);
    });

    test('isLogin returns false when path does not start with /login', () => {
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new RouteHandler(mockRequest, '/dashboard');

        expect(handler.isPointingTo('/login')).toBe(false);
    });

    test('next calls NextResponseWrapper.next', () => {
        handler = new RouteHandler(mockRequest, '/dashboard');

        handler.next();

        expect(NextResponseWrapper.next).toHaveBeenCalled();
    });

    test('redirectToDashboard calls redirect with /dashboard', () => {
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new RouteHandler(mockRequest, '/dashboard');

        handler.redirectTo('/dashboard');

        expect(NextResponseWrapper.redirect).toHaveBeenCalledWith(new URL('/dashboard', 'http://localhost:8000'));
    });

    test('redirectToLogin calls redirect with /login', () => {
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new RouteHandler(mockRequest, '/dashboard');

        handler.redirectTo('/login');

        expect(NextResponseWrapper.redirect).toHaveBeenCalledWith(new URL('/login', 'http://localhost:8000'));
    });

    test('isAccessingSensitiveRoute returns true when path starts with /dashboard', () => {
        mockRequest = createMockRequest('/dashboard/some-path', 'http://localhost:8000');
        handler = new RouteHandler(mockRequest, '/dashboard');

        expect(handler.isAccessingProtectedroute()).toBe(true);
    });

    test('isAccessingSensitiveRoute returns false when path does not start with /dashboard', () => {
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new RouteHandler(mockRequest, '/dashboard');

        expect(handler.isAccessingProtectedroute()).toBe(false);
    });

    test('isPointingToHome returns true when path is /', () => {
        mockRequest = createMockRequest('/', 'http://localhost:8000');
        handler = new RouteHandler(mockRequest, '/dashboard');

        expect(handler.isPointingTo('/')).toBe(true);
    });

    test('isPointingToHome returns false when path is not /', () => {
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new RouteHandler(mockRequest, '/dashboard');

        expect(handler.isPointingTo('/')).toBe(false);
    });
});

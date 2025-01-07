import { Handler } from "@/middlewareSupport/handler/handler";
import { NextRequest } from "next/server";
import { NextResponseWrapper } from "@/lib/nextResponseWrapper";
import { JWT } from "next-auth/jwt";

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
    let handler: Handler;
    let mockRequest: NextRequest;
    let mockJWT: JWT | null;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('isAuthenticated returns true when JWT is present', () => {
        mockJWT = { sub: '123' } as JWT;
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        expect(handler.isAuthenticated()).toBe(true);
    });

    test('isAuthenticated returns false when JWT is null', () => {
        mockJWT = null;
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        expect(handler.isAuthenticated()).toBe(false);
    });

    test('isLogin returns true when path starts with /login', () => {
        mockRequest = createMockRequest('/login', 'http://localhost:8000');
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        expect(handler.isLogin()).toBe(true);
    });

    test('isLogin returns false when path does not start with /login', () => {
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        expect(handler.isLogin()).toBe(false);
    });

    test('next calls NextResponseWrapper.next', () => {
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        handler.next();

        expect(NextResponseWrapper.next).toHaveBeenCalled();
    });

    test('redirectToDashboard calls redirect with /dashboard', () => {
        mockJWT = null;
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new Handler();
        handler.setRequest(mockRequest)
        handler.setJWT(mockJWT)

        handler.redirectToDashboard();

        expect(NextResponseWrapper.redirect).toHaveBeenCalledWith(new URL('/dashboard', 'http://localhost:8000'));
    });

    test('redirectToLogin calls redirect with /login', () => {
        mockJWT = null;
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        handler.redirectToLogin();

        expect(NextResponseWrapper.redirect).toHaveBeenCalledWith(new URL('/login', 'http://localhost:8000'));
    });

    test('isAccessingSensitiveRoute returns true when path starts with /dashboard', () => {
        mockJWT = null;
        mockRequest = createMockRequest('/dashboard/some-path', 'http://localhost:8000');
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        expect(handler.isAccessingSensitiveRoute()).toBe(true);
    });

    test('isAccessingSensitiveRoute returns false when path does not start with /dashboard', () => {
        mockJWT = null;
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        expect(handler.isAccessingSensitiveRoute()).toBe(false);
    });

    test('isPointingToHome returns true when path is /', () => {
        mockJWT = null;
        mockRequest = createMockRequest('/', 'http://localhost:8000');
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        expect(handler.isPointingToHome()).toBe(true);
    });

    test('isPointingToHome returns false when path is not /', () => {
        mockJWT = null;
        mockRequest = createMockRequest('/some-path', 'http://localhost:8000');
        handler = new Handler();
        handler.setJWT(mockJWT)
        handler.setRequest(mockRequest)

        expect(handler.isPointingToHome()).toBe(false);
    });
});
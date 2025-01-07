import {Middleware} from "@/middlewareSupport/function"
import {NextRequest} from "next/server";
import {getToken} from "next-auth/jwt";
import {NextResponseWrapper} from "@/lib/nextResponseWrapper";

jest.mock("next-auth/jwt", () => ({
    getToken: jest.fn(),
}));

jest.mock("@/lib/nextResponseWrapper", () => ({
    NextResponseWrapper: {
        next: jest.fn(),
        redirect: jest.fn(),
    }
}));

const createMockRequest = (pathname: string, url: string) => ({
    nextUrl: { pathname },
    url,
});

const mockToken = (value: any) => {
    (getToken as jest.Mock).mockResolvedValue(value);
};
describe('Middleware, functionality tests', () => {
    let middleware: Middleware
    beforeEach(() => {
        jest.resetAllMocks();
        middleware = new Middleware();
    });

    test('if user is trying to access login page and is not authenticated, then middleware directs them to /login', async () => {
        mockToken(null);
        const MockRequest = createMockRequest('/login', 'http://localhost:8000');

        await middleware.processRequest(MockRequest as NextRequest);

        expect(NextResponseWrapper.next).toHaveBeenCalled();
    });

    test("if user is trying to access login page and is authenticated, then middleware doesn't call next", async () => {
        mockToken(true);
        const MockRequest = createMockRequest('/login', 'http://localhost:8000');

        await middleware.processRequest(MockRequest as NextRequest);

        expect(NextResponseWrapper.next).not.toHaveBeenCalled();
    });

    test('if is login page and user is authenticated, then redirect to dashboard', async () => {
        mockToken(true);
        const MockRequest = createMockRequest('/login', 'http://localhost:8000');

        await middleware.processRequest(MockRequest as NextRequest);

        expect(NextResponseWrapper.redirect).toHaveBeenCalledWith(new URL("http://localhost:8000/dashboard"));
    });

    test('if is login page and user is authenticated, then redirect to dashboard, different data', async () => {
        mockToken(true);
        const MockRequest = createMockRequest('/login', 'http://liveendpoint.com');

        await middleware.processRequest(MockRequest as NextRequest);

        expect(NextResponseWrapper.redirect).toHaveBeenCalledWith(new URL("http://liveendpoint.com/dashboard"));
    });

    test('if request is not authenticated and accessing a pathname that starts with "/dashboard", then redirect to login', async () => {
        mockToken(null);
        const MockRequest = createMockRequest('/dashboard-extra-path-values', 'http://liveendpoint.com');

        await middleware.processRequest(MockRequest as NextRequest);

        expect(NextResponseWrapper.redirect).toHaveBeenCalledWith(new URL("http://liveendpoint.com/login"));
    });

    test('if request is for the home page, then redirect to dashboard', async () => {
        mockToken(null);
        const MockRequest = createMockRequest('/', 'http://liveendpoint.com');

        await middleware.processRequest(MockRequest as NextRequest);

        expect(NextResponseWrapper.redirect).toHaveBeenCalledWith(new URL("http://liveendpoint.com/dashboard"));
    });
});

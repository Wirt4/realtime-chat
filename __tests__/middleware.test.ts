import {config, middleware} from "@/middleware";
import {getToken} from "next-auth/jwt";
import {NextRequest, NextResponse} from "next/server";

jest.mock("next-auth/jwt", () => ({
    getToken: jest.fn(),
}));

describe('Middleware, config tests', () => {
    test('config has a "matchers" key', () => {
        expect(config).toEqual(
            expect.objectContaining({matchers: expect.anything()}))
    });
    test('"matchers" includes /login, root and all dashboard pages', () => {
        const expected  = ['login', '/', '/dashboard/:path*']
        expect(config).toEqual(
            expect.objectContaining({matchers:
                    expect.arrayContaining(expected)}));
    });
});

describe('Middleware, functionality tests', () => {
    afterEach(()=>{
        jest.resetAllMocks();
    });
    
    test('if user is trying to access login page and is not authenticated, then middleware  directs them to /login',
       async () => {
            (getToken as jest.Mock).mockResolvedValue(null);
            const nextSpy = jest.spyOn(NextResponse, 'next');
            const MockRequest = {nextUrl:{pathname:'/login'}, url: 'http://localhost:8000'};
            await middleware(MockRequest as NextRequest);
            expect(nextSpy).toHaveBeenCalled();
    });

    test("if user is trying to access login page and is authenticated, then middleware doesn't call next",
        async () => {
            (getToken as jest.Mock).mockResolvedValue(true);
            const nextSpy = jest.spyOn(NextResponse, 'next');
            const MockRequest = {nextUrl:{pathname:'/login'}, url: 'http://localhost:8000'};

            await middleware(MockRequest as NextRequest);

            expect(nextSpy).not.toHaveBeenCalled();
        });

    test('if is login page and user is authenticated, then redirect to dashboard',async()=>{
        const MockRequest = {nextUrl:{pathname:'/login'}, url: 'http://localhost:8000'};
        (getToken as jest.Mock).mockResolvedValue(true);
        const mockURL = jest.spyOn(global, 'URL').mockImplementation((url) => {
            return {
                href: url,
                toString: () => url,
                // Add more properties as needed
            };
        });
        const redirectSpy = jest.spyOn(NextResponse, 'redirect');
        await middleware(MockRequest as NextRequest);
        expect(mockURL).toHaveBeenCalledWith("/dashboard", "http://localhost:8000");
        expect(redirectSpy).toHaveBeenCalled();
    });

    test('if is login page and user is authenticated, then redirect to dashboard, different data',async()=>{
        const MockRequest = {nextUrl:{pathname:'/login'}, url: 'http://liveendpoint.com'};
        (getToken as jest.Mock).mockResolvedValue(true);
        const mockURL = jest.spyOn(global, 'URL').mockImplementation((url) => {
            return {
                href: url,
                toString: () => url,
                // Add more properties as needed
            };
        });
        await middleware(MockRequest as NextRequest);
        const redirectSpy = jest.spyOn(NextResponse, 'redirect');
        expect(mockURL).toHaveBeenCalledWith("/dashboard", "http://liveendpoint.com");
        expect(redirectSpy).toHaveBeenCalled();
    });

    test('if request is not authenticated and accessing a pathname that starts with "/dashboard", then redirect to login',
        async()=>{
            const MockRequest = {nextUrl:{pathname:'/dashboard-extra-path-values'}, url: 'http://liveendpoint.com'};
            (getToken as jest.Mock).mockResolvedValue(null);
            const mockURL = jest.spyOn(global, 'URL').mockImplementation((url) => {
                return {
                    href: url,
                    toString: () => url,
                    // Add more properties as needed
                };
            });
            const redirectSpy = jest.spyOn(NextResponse, 'redirect');
            await middleware(MockRequest as NextRequest);
            expect(mockURL).toHaveBeenCalledWith("/login", "http://liveendpoint.com");
            expect(redirectSpy).toHaveBeenCalled();
        });

    test('if request is for the home page, then redirect to dashboard',
        async()=>{
            const MockRequest = {nextUrl:{pathname:'/'}, url: 'http://liveendpoint.com'};
            (getToken as jest.Mock).mockResolvedValue(null);
            const mockURL = jest.spyOn(global, 'URL').mockImplementation((url) => {
                return {
                    href: url,
                    toString: () => url,
                    // Add more properties as needed
                };
            });

            await middleware(MockRequest as NextRequest);
            expect(mockURL).toHaveBeenCalledWith("/dashboard", "http://liveendpoint.com");
        });
});

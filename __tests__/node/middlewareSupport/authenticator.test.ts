import { Authenticator } from "@/middlewareSupport/authenticator/implementation";
import { IAuthenticator } from "@/middlewareSupport/authenticator/interface";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
jest.mock("next-auth/jwt")

const createMockRequest = (pathname: string, url: string) => ({
    nextUrl: { pathname },
    url,
} as NextRequest);

describe('authenticator tests', () => {
    let authenticator: IAuthenticator
    let request: NextRequest

    beforeEach(() => {
        request = createMockRequest('/', 'www.example.com')
        authenticator = new Authenticator()
    })

    it('if getToken returns a valid string, then isAuthenticated should be true', async () => {
        (getToken as jest.Mock).mockResolvedValue('valid JWT');
        await authenticator.fetchJWT(request);
        expect(authenticator.isValid()).toEqual(true);
    })

    it('if getToken returns null, then isAuthenticated should be false', async () => {
        (getToken as jest.Mock).mockResolvedValue(null);
        await authenticator.fetchJWT(request);
        expect(authenticator.isValid()).toEqual(false);
    })
})

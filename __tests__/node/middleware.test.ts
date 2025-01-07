import {config} from "@/middleware";

describe('Middleware, config tests', () => {
    test('config has a "matchers" key', () => {
        expect(config).toEqual(
            expect.objectContaining({ matchers: expect.anything() })
        );
    });

    test('"matchers" includes /login, root, and all dashboard pages', () => {
        const expected = ['login', '/', '/dashboard/:path*'];

        expect(config).toEqual(
            expect.objectContaining({ matchers: expect.arrayContaining(expected) })
        );
    });
});

import {config} from "@/middleware"
describe('Middleware, config tests', () => {
    test('config needs a machers key', () => {
        expect(config).toEqual(expect.objectContaining({matchers: expect.anything()}))
    });
});
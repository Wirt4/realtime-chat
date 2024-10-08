import {Auth} from "@/lib/auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter"

jest.mock('@next-auth/upstash-redis-adapter', () => ({
    UpstashRedisAdapter: jest.fn()
}))


describe('properties of AuthOptions object', ()=>{
    afterEach(()=>{
        jest.resetAllMocks()
    })

    beforeEach(()=>{
        jest.spyOn(Auth, '_db').mockReturnValue('stub')
        jest.spyOn(Auth, 'getGoogleCredentials').mockReturnValue({clientId:'stub', clientSecret:'stub'})
    })

    afterAll(()=>{
        jest.restoreAllMocks()
    })

    test('adapter property should be set with the output of UpstashRedisAdapter',()=>{
        (UpstashRedisAdapter as jest.Mock).mockReturnValue('a very cromulent adapter');
        const opts = Auth.options()
        expect(opts).toEqual(expect.objectContaining({adapter:'a very cromulent adapter' }))
    })

    test('adapter property should be set with the output of UpstashRedisAdapter',()=>{
        (UpstashRedisAdapter as jest.Mock).mockReturnValue('a very lovely adapter');
        const opts = Auth.options()
        expect(opts).toEqual(expect.objectContaining({adapter:'a very lovely adapter' }))
    })

    test('adapter property should be set with the output of UpstashRedisAdapter',()=>{
        (UpstashRedisAdapter as jest.Mock)
        // @ts-expect-error coercing types for abstraction
        jest.spyOn(Auth, '_db').mockReturnValueOnce('a fabulous database')
        Auth.options()
        expect(UpstashRedisAdapter).toHaveBeenCalledWith('a fabulous database');
    })

    test('adapter property should be set with the output of UpstashRedisAdapter',()=>{
        (UpstashRedisAdapter as jest.Mock)
        // @ts-expect-error coercing types for abstraction
        jest.spyOn(Auth, '_db').mockReturnValueOnce('a different database')
        Auth.options()
        expect(UpstashRedisAdapter).toHaveBeenCalledWith('a different database');
    })

    test('session strategy should be JWT',()=>{
        const opts = Auth.options()
        expect(opts)
            .toEqual(expect
                .objectContaining({session: expect
                        .objectContaining({strategy: 'jwt'})}))
    })

    test('signIn page should be /login', ()=>{
        const opts = Auth.options()
        expect(opts)
            .toEqual(expect
                .objectContaining({pages: expect
                        .objectContaining({signIn: '/login'})}))
    })

    test('should have a providers array', ()=>{
        const opts = Auth.options()
        expect(opts)
            .toEqual(expect
                .objectContaining({providers: expect.arrayContaining([expect.anything()])}))
    })

    test('should have a google oauth provider', ()=>{
        const opts = Auth.options()
        expect(opts)
            .toEqual(expect
                .objectContaining({providers: expect.arrayContaining([expect.
                    objectContaining({type: 'oauth', name: 'Google'})])}))
    })

    test('getGoogleCredentials Throws', ()=>{
        // @ts-expect-error coercing type to nail down call logic
        jest.spyOn(Auth, 'getGoogleCredentials').mockImplementationOnce(()=>{
            throw new Error('Google credentials error')
        })
        try{
            Auth.options()
            expect(true).toBeFalsy()
        }catch(e){
            expect(e).toEqual(new Error('Google credentials error'))
        }
    })

    test('options needs a callbacks member', ()=>{
        const opts = Auth.options()
        expect(opts).toEqual(
            expect.objectContaining({callbacks:
                    expect.anything()}))
    })

    test('callbacks needs a member named jwt', ()=>{
        const opts = Auth.options()
        expect(opts).toEqual(
            expect.objectContaining({callbacks:
                    expect.objectContaining({'jwt':
                            expect.anything()})}))
    })

    test('jwt callback should be the method JWTCallback', async ()=>{
        const spy = jest.spyOn(Auth, 'JWTCallback').mockReturnValue({})
        const opts = Auth.options()
        await opts.callbacks.jwt({foo: 'bar'})
        expect(spy).toHaveBeenCalledWith({foo: 'bar'})
    })

    test('callbacks needs a member named session',()=>{
        const opts = Auth.options()
        expect(opts).toEqual(
            expect.objectContaining({callbacks:
                    expect.objectContaining({'session':
                            expect.anything()})}))
    })

    test('session callback should be the method sessionCallback', async ()=>{
        const spy = jest.spyOn(Auth, 'sessionCallback').mockReturnValue({})
        const opts = Auth.options()
        await opts.callbacks.session({foo: 'bar'})
        expect(spy).toHaveBeenCalledWith({foo: 'bar'})
    })

    test('callbacks need a member named redirect', ()=>{
        const opts = Auth.options()
        expect(opts).toEqual(
            expect.objectContaining({callbacks:
                    expect.objectContaining({'redirect':
                            expect.anything()})}))
    })

    test('session callback should be the method redirectCallback', async ()=>{
        const spy = jest.spyOn(Auth, 'redirectCallback').mockReturnValue({})
        const opts = Auth.options()
        const param = {url:'foo', baseUrl: 'bar'}
        await opts.callbacks.redirect(param)
        expect(spy).toHaveBeenCalledWith(param)
    })
})

describe('getGoogleCredentials tests', ()=>{
    let env: NodeJS.ProcessEnv

    beforeAll(()=>{
        env = process.env
    })

    beforeEach(()=>{
        jest.resetModules()
    })

    afterEach(()=>{
        process.env = env
    })

    test('no GOOGLE_CLIENT_ID, function throws',()=>{
        process.env = {
            ...env, GOOGLE_CLIENT_ID: undefined
        }
        try{
            Auth.getGoogleCredentials()
            expect(true).toBeFalsy()
        }catch(e){
            expect(e).toEqual(new Error('missing GOOGLE_CLIENT_ID .env variable'))
        }
    })

    test('GOOGLE_CLIENT_ID, but no GOOGLE_CLIENT_SECRET, function throws',()=>{
        process.env = {
            ...env, GOOGLE_CLIENT_ID: 'valid id', GOOGLE_CLIENT_SECRET: undefined
        }
        try{
            Auth.getGoogleCredentials()
            expect(true).toBeFalsy()
        }catch(e){
            expect(e).toEqual(new Error('missing GOOGLE_CLIENT_SECRET .env variable'))
        }
    })

    test('GOOGLE_CLIENT_ID and GOOGLE CLIENT_SECRET are set, function dows not throw',()=>{
        process.env = {
            ...env, GOOGLE_CLIENT_ID: 'valid id', GOOGLE_CLIENT_SECRET: 'valid secret'
        }
        try{
            Auth.getGoogleCredentials()
            expect(true).toBeTruthy()
        }catch(e){
            expect(true).toBeFalsy()
        }
    })

    test ('clientID member should have the value from GOOGLE_CLIENT_ID', ()=>{
        process.env = {
            ...env, GOOGLE_CLIENT_ID: 'valid id', GOOGLE_CLIENT_SECRET: 'valid secret'
        }
        const googleAuth = Auth.getGoogleCredentials()
        expect(googleAuth).toEqual(expect.objectContaining({clientId: 'valid id'}))
    })

    test ('clientID member should have the value from GOOGLE_CLIENT_ID, different data', ()=>{
        process.env = {
            ...env, GOOGLE_CLIENT_ID: 'a different id', GOOGLE_CLIENT_SECRET: 'valid secret'
        }
        const googleAuth = Auth.getGoogleCredentials()
        expect(googleAuth).toEqual(expect.objectContaining({clientId: 'a different id'}))
    })

    test ('clientID member should have the value from GOOGLE_CLIENT_SECRET', ()=>{
        process.env = {
            ...env, GOOGLE_CLIENT_ID: 'valid id', GOOGLE_CLIENT_SECRET: 'valid secret'
        }
        const googleAuth = Auth.getGoogleCredentials()
        expect(googleAuth).toEqual(expect.objectContaining({clientSecret: 'valid secret'}))
    })

    test ('clientID member should have the value from GOOGLE_CLIENT_SECRET', ()=>{
        process.env = {
            ...env, GOOGLE_CLIENT_ID: 'valid id', GOOGLE_CLIENT_SECRET: 'a different secret'
        }
        const googleAuth = Auth.getGoogleCredentials()
        expect(googleAuth).toEqual(expect.objectContaining({clientSecret: 'a different secret'}))
    })
})

describe('JWT callback tests', ()=>{
    afterEach(()=>{
        jest.resetAllMocks()
    })

    test('_db().get() is called with the correct argument', async()=>{
        const argument = 'user:1701'
        const token = {id: '1701'}
        const user= {id: 'stub'}
        const spy = jest.fn()
        jest.spyOn(Auth, '_db').mockImplementation(()=>{
            return{
                get: spy
            }
        })
        await Auth.JWTCallback({token, user})
        expect(spy).toHaveBeenCalledWith(argument)

    })

    test('_db().get() is called with a different id', async()=>{
        const argument = 'user:c3-po'
        const token = {id: 'c3-po'}
        const user= {id: 'stub'}
        const spy = jest.fn()
        jest.spyOn(Auth, '_db').mockImplementation(()=>{
            return{
                get: spy
            }
        })
        await Auth.JWTCallback({token, user})
        expect(spy).toHaveBeenCalledWith(argument)

    })

    test('_db().get() does not return a user', async()=>{
        const token = {id: 'c3-po', name:'funkymonkey'}
        const user = {id: 'r2-d2'}
        jest.spyOn(Auth, '_db').mockImplementation(()=>{
            return{
                get: ()=>{
                    return null
                }
            }
        })

        const jwt = await Auth.JWTCallback({token,user})
        expect(jwt).toEqual(expect.objectContaining({id:'r2-d2',name:'funkymonkey'}))
    })

    test('_db().get() does not return a user, different data', async()=>{
        const token = {id: 'harddaysnight', name:'paulmccartney'}
        const user = {id: 'yesterday'}
        jest.spyOn(Auth, '_db').mockImplementation(()=>{
            return{
                get: ()=>{
                    return null
                }
            }
        })

        const jwt = await Auth.JWTCallback({token,user})
        expect(jwt).toEqual(expect.objectContaining({id:'yesterday',name:'paulmccartney'}))
    })

    test('_db().get() returns a valid user', async()=>{
        const user =  {
            id:'1969',
            name:'zoinks',
            email:'shaggyrogers@aol.com',
            image: 'stub'
        }
        jest.spyOn(Auth, '_db').mockImplementation(()=>{
            return{
                get: ()=>{
                    return user
                }
            }
        })

        const jwt = await Auth.JWTCallback({})

        expect(jwt).toEqual(expect.objectContaining(user))
    })

    test('_db().get() returns a valid user, different data', async()=>{
        const user =  {
            id:'1930',
            name:'king',
            email:'kong@skullisle.com',
            image: 'image address'
        }
        jest.spyOn(Auth, '_db').mockImplementation(()=>{
            return{
                get: ()=>{
                    return user
                }
            }
        })

        const jwt = await Auth.JWTCallback({})

        expect(jwt).toEqual(expect.objectContaining(user))
    })
})

describe('Session callback tests', ()=>{
    test('token is nullish, return session', async()=>{
        const token = null
        const session = {
            user:{
                id: 'blues',
                name:'jake',
                email: 'missionfromgod@joliet.gov',
                image: ' a valid image address'
            }
        }

        const actual = await Auth.sessionCallback({session, token})
        expect(actual).toEqual(session)
    })

    test('token is valid, update and return session',async ()=>{
        const token ={
            id: 'motorhead',
            name: 'ellwood',
            email:'wrigleyfield@chicago.com',
            image:'another valid image address'
        }
        const session = {}
        const actual = await Auth.sessionCallback({session, token})
        expect(actual).toEqual({user:{
                id: 'motorhead',
                name: 'ellwood',
                email:'wrigleyfield@chicago.com',
                image:'another valid image address'
            }})
    })
})

describe('redirect callback tests',()=>{
    test('url starts with a "/"', ()=>{
        const url = "/007"
        const baseUrl = "http://mi5.uk"
        const actual = Auth.redirectCallback({url, baseUrl})
        expect(actual).toEqual(baseUrl + url)
    })
    test('url starts with a "/", different data', ()=>{
        const url = "/doo"
        const baseUrl = "http://scooby.com"
        const actual = Auth.redirectCallback({url, baseUrl})
        expect(actual).toEqual(baseUrl + url)
    })
    test('url doesn\'t start with a "/", origin is the same', ()=>{
        const url = "doo"
        const baseUrl = "http://scooby.com"
        jest.spyOn(global, 'URL').mockImplementation(()=>{
            return  {origin: baseUrl}
        })
        const actual = Auth.redirectCallback({url, baseUrl})
        expect(actual).toEqual(url)
    })
    test('url doesn\'t start with a "/", origin is different', ()=>{
        const url = "doo"
        const baseUrl = "http://scooby.com"
        jest.spyOn(global, 'URL').mockImplementation(()=>{
            return  {origin: "different"}
        })
        const actual = Auth.redirectCallback({url, baseUrl})
        expect(actual).toEqual(baseUrl)
    })
})

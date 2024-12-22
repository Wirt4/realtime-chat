import PusherServer from "pusher"
import PusherClient from "pusher-js"
import {getPusherServer, getPusherClient} from "@/lib/pusher"

jest.mock("pusher")
jest.mock("pusher-js")

describe('pusher server creation tests', () => {
    let original_env:NodeJS.ProcessEnv

    beforeAll(()=>{
        original_env = process.env
    })

    beforeEach(()=>{
        (PusherServer as unknown as jest.Mock).mockClear()
    })

    afterAll(()=>{
         process.env = original_env
    })

    test('make sure pusher server is created with correct appId', ()=>{
        testServerAppId('appname')
    })

    test('make sure pusher server is created with correct appId', ()=>{
        testServerAppId('different_id')
    })

    test('make sure pusher server is created with correct key', ()=>{
        testServerKey('keyOne')
    })

    test('make sure pusher server is created with correct key', ()=>{
        testServerKey('columbo')
    })

    test('make sure pusher server is created with correct secret', ()=>{
        testServerAppSecret('secret')
    })

    test('make sure pusher server is called with US-3 cluster', ()=>{
        expectServerContaining({cluster:'us3'})
    })

    test('make sure pusher server is called with useTLS:true', ()=>{
        expectServerContaining({useTLS:true})
    })
})

describe('pusher client creation tests', ()=>{
    let original_env:NodeJS.ProcessEnv

    beforeAll(()=>{
        original_env = process.env
    })

    beforeEach(()=>{
        (PusherClient as unknown as jest.Mock).mockClear()
    })

    afterAll(()=>{
        process.env = original_env
    })

    test('make sure pusher client is created with correct key', ()=>{
        testClientKey('secretKey')
    })

    test('make sure pusher client is created with correct key', ()=>{
        testClientKey('antibacterial')
    })

    test('make sure pusher client is called with us3 cluster', ()=>{
        getPusherClient()
        expect(PusherClient).toHaveBeenCalledWith(expect.anything(),
            expect.objectContaining({cluster: 'us3'}));
    })
})

function testClientKey(pusherKey:string){
    process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY = pusherKey
    getPusherClient()
    expect(PusherClient).toHaveBeenCalledWith(pusherKey, expect.anything())
}

function testServerAppId(id:string){
    process.env.NEXT_PUBLIC_PUSHER_APP_ID = id
    expectServerContaining({appId:id})
}

function testServerKey(pusherKey:string){
    process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY = pusherKey
    expectServerContaining({key:pusherKey})
}

function testServerAppSecret(secret:string){
    process.env.NEXT_PUBLIC_PUSHER_SECRET = secret
    expectServerContaining({secret:secret})
}

function expectServerContaining(prop: object){
    getPusherServer()
    expect(PusherServer).toHaveBeenCalledWith(expect.objectContaining(prop))
}


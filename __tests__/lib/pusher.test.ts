import PusherServer from "pusher"
import {getPusherServer} from "@/lib/pusher"

jest.mock("pusher")
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
        testAppId('appname')
    })

    test('make sure pusher server is created with correct appId', ()=>{
        testAppId('different_id')
    })

    test('make sure pusher server is created with correct key', ()=>{
        testAppKey('keyOne')
    })

    test('make sure pusher server is created with correct key', ()=>{
        testAppKey('columbo')
    })

    test('make sure pusher server is created with correct secret', ()=>{
        testAppSecret('secret')
    })

    test('make sure pusher server is called with US-3 cluster', ()=>{
        expectContainting({cluster:'us3'})
    })

    test('make sure pusher server is called with useTLS:true', ()=>{
        expectContainting({useTLS:true})
    })
})

function testAppId(id:string){
    process.env.PUSHER_APP_ID = id
    expectContainting({appId:id})
}

function testAppKey(pusherKey:string){
    process.env.PUSHER_KEY = pusherKey
    expectContainting({key:pusherKey})
}

function testAppSecret(secret:string){
    process.env.PUSHER_SECRET =secret
    expectContainting({secret:secret})
}

function expectContainting(prop: object){
    getPusherServer()
    expect(PusherServer).toHaveBeenCalledWith(expect.objectContaining(prop))
}


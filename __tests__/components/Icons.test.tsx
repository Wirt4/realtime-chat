import {Icons} from '@/components/Icons'

describe('Icons', ()=>{
    test ('should have a component called Logo',()=>{
        expect(Icons).toEqual(
            expect.objectContaining({Logo: expect.anything()}))
    })
    test ('Logo should be a function',()=>{
       expect(typeof Icons.Logo).toEqual('function');
    })
})
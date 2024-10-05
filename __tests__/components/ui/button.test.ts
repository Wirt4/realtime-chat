import Button from "@/components/ui/button/Button";
describe('Button',()=>{
    test('Button type test',()=>{
        const button = Button({})
        expect(button?.type).toEqual('button')
    })
    test('Miscellaneous props passed to React Parent', ()=>{
        const button =  Button( { color:"#841584"})
        expect(button?.props.color).toEqual("#841584")
    })
    test('Miscellaneous props passed to React Parent', ()=>{
        const button =  Button({})
        console.log({button})
        expect(button?.props).not.toEqual(expect.objectContaining({color:"#841584"}))
    })
    test('if isLoading is false, then disabled is false', ()=>{
        const button =  Button({isLoading: false})
        expect(button?.props.disabled).toEqual(false)
    })
    test('if isLoading is true, then disabled is true', ()=>{
        const button =  Button({isLoading: true})
        expect(button?.props.disabled).toEqual(true)
    })
})

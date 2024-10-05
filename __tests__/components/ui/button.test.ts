import Button from "@/components/ui/button/Button";
describe('Button',()=>{
    test('default button content test',()=>{
        const button =  Button()
        expect(button.props.children).toEqual('Button')
    })
})

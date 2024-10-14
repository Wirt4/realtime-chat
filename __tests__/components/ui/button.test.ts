import Button from "@/components/ui/button/Button";
import {Loader2} from "lucide-react";
import {Utils} from "@/lib/utils";

describe('Button',()=>{

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Button type test',()=>{
        const button = Button({})
        expect(button?.type)
            .toEqual('button')
    })

    test('Miscellaneous props passed to React Parent', ()=>{
        const button =  Button( { color:"#841584"})
        expect(button?.props.color)
            .toEqual("#841584")
    })

    test('Miscellaneous props passed to React Parent', ()=>{
        const button =  Button({})
        expect(button?.props)
            .not
            .toEqual(expect.objectContaining({color:"#841584"}))
    })

    test('if isLoading is false, then disabled is false', ()=>{
        const button =  Button({isLoading: false})
        expect(button?.props.disabled)
            .toEqual(false)
    })

    test('if isLoading is true, then disabled is true', ()=>{
        const button =  Button({isLoading: true})
        expect(button?.props.disabled)
            .toEqual(true)
    })

    test ('if isLoading is false, then do not expect a Loader2 icon to be rendered', ()=>{
        const button =  Button({isLoading: false})
        expect(button?.props?.children?.type)
            .not
            .toEqual(Loader2)
    })

    test ('if isLoading is true, then expect a Loader2 icon to be rendered', ()=>{
        const button =  Button({isLoading: true})
        expect(button?.props?.children)
            .toEqual(expect
                .arrayContaining([expect
                    .objectContaining({type: Loader2})]))
    })

    test ('The children field of the argument should be rendered in the final button', ()=>{
        const button =  Button({isLoading: true, children: "TK421, why aren't you at your post?"})
        expect(button?.props?.children)
            .toEqual(expect
                .arrayContaining(["TK421, why aren't you at your post?"]))
    })

    test ('The children field of the argument should be rendered in the final button, different data', ()=>{
        const button =  Button({isLoading: true, children: "Boring conversation anyway"})
        expect(button?.props?.children)
            .toEqual(expect
                .arrayContaining(["Boring conversation anyway"]))
    })
})

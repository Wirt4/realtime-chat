import Login from "@/components/ui/login/Login";

describe('Login', () => {

    test('confirm styling is in outermost wrapper', ()=>{
        const styling = 'flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'
        const login = Login({})
        expect(login?.props.children.props.className).toEqual(styling)
    })
    
    test('confirm styling in nested div', ()=>{
        const styling='w-full flex flex-col items-center max-w-md space-y-8'
        const login = Login({})
        expect(login?.props.children.props.children.props.className).toEqual(styling)
    })

    test('confirm styling in third nested div', ()=>{
        const styling='flex flex-col items-center gap-8'
        const login = Login({})
        console.log(login?.props.children.props.children.props.children)
        expect(login?.props.children.props.children.props.children.props.className).toEqual(styling)
    })

    test('placeholder test for logo', ()=>{
        const login = Login({})
        expect(login?.props.children.props.children.props.children.props.children).toEqual(
            expect.arrayContaining(['logo']))
    })

    test('confirm placement of h2 component',()=>{
        const login = Login({})
        console.log(login?.props.children.props.children.props.children.props.children)
        expect(login?.props.children.props.children.props.children.props.children).toEqual(
            expect.arrayContaining([
                expect.objectContaining({type: 'h2'})]))
    })

    test('confirm styling of h2 component',()=>{
        const login = Login({})
       // const loginMessage = 'Sign in with Google'
        const styling = 'mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'
        expect(login?.props.children.props.children.props.children.props.children).toEqual(
            expect.arrayContaining([expect.objectContaining({props:
                    expect.objectContaining({className: styling})})]))
    })

    test('confirm content of h2 component',()=>{
        const login = Login({})
        const loginMessage = 'Sign in with Google'
        expect(login?.props.children.props.children.props.children.props.children).toEqual(
            expect.arrayContaining([expect.objectContaining({props:
                    expect.objectContaining({children: loginMessage})})]))
    })

})

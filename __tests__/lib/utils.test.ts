import {Utils} from "@/lib/utils"

describe('classNames test', ()=>{
    test('want to make sure the inputs are passed to clsx', ()=>{
        const spy = jest.spyOn(Utils, '_cslx')
        Utils.classNames(['Tom', 'Dick', 'Harry'])
        expect(spy).toHaveBeenCalledWith([['Tom', 'Dick', 'Harry']])
    })

    test('want to make sure the inputs are passed to clsx', ()=>{
        const spy = jest.spyOn(Utils, '_cslx')
        Utils.classNames(['Blanche', 'Dorothy', 'Rose'])
        expect(spy).toHaveBeenCalledWith([['Blanche', 'Dorothy', 'Rose']])
    })

    test('want to make sure the results of cslx are passed to twMerge', ()=>{

        jest.spyOn(Utils, '_cslx').mockReturnValueOnce('my what a lovely return')
        const spy = jest.spyOn(Utils, '_twMerge')
        Utils.classNames(['Blanche', 'Dorothy', 'Rose'])
        expect(spy).toHaveBeenCalledWith('my what a lovely return')
    })

    test('the method should return the results of _twMerge', ()=>{
        jest.spyOn(Utils, '_cslx').mockReturnValueOnce('my what a lovely return')
        jest.spyOn(Utils, '_twMerge').mockReturnValueOnce("That's my final answer, Regis")
        expect(Utils.classNames(['Blanche', 'Dorothy', 'Rose'])).toEqual("That's my final answer, Regis")
    })
})

describe('buttonClassNames test', ()=>{
    test('should return the results of classNames', ()=>{
        jest.spyOn(Utils, 'classNames').mockReturnValueOnce('ta-daa')
        expect(Utils.buttonClassNames({})).toEqual('ta-daa')
    })

    test('should return the results of classNames, different data', ()=>{
        jest.spyOn(Utils, 'classNames').mockReturnValueOnce("Here's looking at you kid")
        expect(Utils.buttonClassNames({})).toEqual("Here's looking at you kid")
    })

    test('expect classNames to be called with the output of _buttonVariants', ()=>{
        jest.spyOn(Utils, '_buttonVariants').mockReturnValueOnce("Here's looking at you kid")
        const spy = jest.spyOn(Utils, 'classNames').mockReturnValueOnce('stub')
        Utils.buttonClassNames({})
        expect(spy).toHaveBeenCalledWith("Here's looking at you kid")
    })
})

import fetchRedis from "@/helpers/redis";


describe('fetchRedis', () => {
    const positiveResolution = {ok: true, json: async()=>{return {result:""}}}
    let originalFetch: any
    let originalToken: any
    let originalUrl: any

    beforeAll(()=>{
        originalFetch = global.fetch
        global.fetch = jest.fn()
        originalToken = process.env.REDIS_TOKEN
        originalUrl = process.env.REDIS_URL
    })

    afterEach(()=>{
        jest.resetAllMocks()
    })

    afterAll(()=>{
        global.fetch = originalFetch
        process.env.REDIS_TOKEN = originalToken
        process.env.REDIS_URL = originalUrl
    })

    test('should fetch redis', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockReturnValue(positiveResolution);
        const command ='sismember'
        const args = ['somestuff','12345']
        process.env.REDIS_URL ='www.sampleurl.com'
        await fetchRedis(command, args)
        expect(fetchSpy).toHaveBeenCalledWith('www.sampleurl.com/sismember/somestuff/12345', expect.anything())
    })

    test('should fetch redis', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockReturnValue(positiveResolution);
        const args = ['dostuff','54321','63457']
        const command ='zrange'
        process.env.REDIS_URL ='www.otherurl.com'
        await fetchRedis(command, args)
        expect(fetchSpy).toHaveBeenCalledWith('www.otherurl.com/zrange/dostuff/54321/63457', expect.anything())
    })

    test('should fetch redis, example fot type coercion', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockReturnValue(positiveResolution);
        const args = ['dostuff','54321', 63457]
        const command ='zrange'
        process.env.REDIS_URL ='www.otherurl.com'
        await fetchRedis(command, args)
        expect(fetchSpy).toHaveBeenCalledWith('www.otherurl.com/zrange/dostuff/54321/63457', expect.anything())
    })

    test('options test, should include bearer token', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(positiveResolution);
        const args = ['dostuff','54321', 63457]
        const command ='zrange'
        process.env.REDIS_TOKEN ='fooeyMartindale'
        await fetchRedis(command, args)
        const opts= {
            headers: {
                Authorization: `Bearer fooeyMartindale`,
            },
            cache: 'no-store',
        }
        expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), opts)
    })

    test('options test, should include bearer token', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(positiveResolution);
        const args = ['dostuff','54321', 63457]
        const command ='zrange'
        process.env.REDIS_TOKEN ='goliath'
        await fetchRedis(command, args)
        const opts= {
            headers: {
                Authorization: `Bearer goliath`,
            },
            cache: 'no-store',
        }
        expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), opts)
    })

    test('options test, if the status is not okay, then the method should throw', async () => {
        const status = "The Monkeys have escaped"
        jest.spyOn(global, 'fetch')
            .mockResolvedValue({ok: false, statusText: status});

        const args = ['dostuff','54321', 63457]
        const command ='zrange'
        process.env.REDIS_TOKEN ='goliath'
        try{
            await fetchRedis(command, args)
            expect(true).toBe(false)
        }catch(e){
            expect(e).toEqual(new Error(`error executing Redis command: ${status}`))
        }
    })

    test('options test, if the status is not okay, then the method should throw', async () => {
        const status = "Jim, I think you better get down here"
        jest.spyOn(global, 'fetch')
            .mockResolvedValue({ok: false, statusText: status, json: jest.fn(async()=>{
                return {result: 'foo'}
                })});

        const args = ['dostuff','54321', 63457]
        const command ='zrange'
        process.env.REDIS_TOKEN ='goliath'
        try{
            await fetchRedis(command, args)
            expect(true).toBe(false)
        }catch(e){
            expect(e).toEqual(new Error(`error executing Redis command: ${status}`))
        }
    })

    test('options test, if the status is  okay, then the method should parse and return the appropriate payload', async () => {
        const expected= {foo: 'bar'}
        jest.spyOn(global, 'fetch')
            .mockResolvedValue({ok: true, json: async()=>{return {result: expected, json: async()=>{return {result:''}}}}});

        const args = ['dostuff','54321', 63457]
        const command ='zrange'
        process.env.REDIS_TOKEN ='goliath'
        const result = await fetchRedis(command, args)
       expect(result).toEqual(expected);
    })
})

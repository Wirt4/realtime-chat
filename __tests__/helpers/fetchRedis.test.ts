import fetchRedis from "@/helpers/redis";


describe('fetchRedis', () => {
    let originalFetch: any
    let originalToken: any
    let originalUrl: any
    beforeAll(()=>{
        originalFetch = global.fetch
        global.fetch = jest.fn()
        originalToken = process.env.REDIS_TOKEN
        originalUrl = process.env.REDIS_URL
    })
    afterAll(()=>{
        global.fetch = originalFetch
        process.env.REDIS_TOKEN = originalToken
        process.env.REDIS_URL = originalUrl
    })
    test('should fetch redis', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockReturnValue("s'good");
        await fetchRedis()
        expect(fetchSpy).toHaveBeenCalledWith('www.sampleurl.com/sismember/dostuff/12345')
    })
})
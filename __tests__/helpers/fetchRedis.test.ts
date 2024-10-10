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
    afterEach(()=>{
        jest.resetAllMocks()
    })
    afterAll(()=>{
        global.fetch = originalFetch
        process.env.REDIS_TOKEN = originalToken
        process.env.REDIS_URL = originalUrl
    })
    test('should fetch redis', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockReturnValue("s'good");
        const command ='sismember'
        const args = ['somestuff','12345']
        process.env.REDIS_URL ='www.sampleurl.com'
        await fetchRedis(command, args)
        expect(fetchSpy).toHaveBeenCalledWith('www.sampleurl.com/sismember/somestuff/12345')
    })
    test('should fetch redis', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockReturnValue("s'good");
        const args = ['dostuff','54321','63457']
        const command ='zrange'
        process.env.REDIS_URL ='www.otherurl.com'
        await fetchRedis(command, args)
        expect(fetchSpy).toHaveBeenCalledWith('www.otherurl.com/zrange/dostuff/54321/63457')
    })
})

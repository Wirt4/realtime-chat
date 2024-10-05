import {Redis} from "@upstash/redis"

/**
 * check Redis docs for full functionality
 *
 * db.set(key, value) to store in db
 */
export const db = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
})

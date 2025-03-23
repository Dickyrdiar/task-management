import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
})

redis.on("connect", () => {
  console.log("connect")
})

redis.on("error", () => {
  console.log("error")
})


export default redis

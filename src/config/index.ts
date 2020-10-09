import 'dotenv/config'

export default {
  proxy: {
    user: process.env.PROXY_USER!,
    password: process.env.PROXY_PWD!,
    host: process.env.PROXY_HOST!,
    port: +(process.env.PROXY_PORT!)
  }
}

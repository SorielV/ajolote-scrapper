import { HttpsProxyAgent } from 'https-proxy-agent'
import { IProxy, IProxyOptions } from '../types'

export default class BotProxy implements IProxy {
    user: string;
    password: string;
    host: string;
    port: number;

    constructor (options: IProxyOptions) {
      this.user = options.user
      this.password = options.password
      this.host = options.host
      this.port = options.port
    }

    getHttpsProxyAgentWithSession (session: string): HttpsProxyAgent {
      return new HttpsProxyAgent(this.getCredentialsWithSession(session))
    }

    getHttpsProxyAgent (): HttpsProxyAgent {
      return new HttpsProxyAgent(this.getCredentials())
    }

    getCredentials (): string {
      const { user, password, host, port } = this
      return `http://${user}+us:${password}@${host}:${port}`
    }

    getCredentialsWithSession (session: string): string {
      const { user, password, host, port } = this
      return `http://${user}+us+${session}:${password}@${host}:${port}`
    }
}

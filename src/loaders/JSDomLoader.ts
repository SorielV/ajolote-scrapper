import axios from 'axios'
import { JSDOM } from 'jsdom'

import { IDOMLoader, IProxy } from '../types'

type JSDomLoaderOptions = {
  proxy?: Boolean,
  useRandomSession?: Boolean
}

export default class JSDomLoader implements IDOMLoader<JSDOM> {
  proxy: IProxy | undefined;
  options: JSDomLoaderOptions;

  constructor (options: JSDomLoaderOptions = {}, proxy: IProxy | undefined = undefined) {
    this.proxy = proxy
    this.options = options
  }

  async load (url: string, fetchOptions: any = {}): Promise<JSDOM> {
    fetchOptions.url = url

    if (this.proxy && this.options.proxy) {
      const session = fetchOptions.session || Math.ceil(Math.random() * 1e4)
      const httpsAgent = (fetchOptions.session || this.options.useRandomSession)
        ? this.proxy.getHttpsProxyAgentWithSession(session)
        : this.proxy.getHttpsProxyAgent()
      fetchOptions.httpsAgent = httpsAgent
      fetchOptions.proxy = false
    }

    const { data } = await axios.request(fetchOptions)
    return new JSDOM(data)
  }
}

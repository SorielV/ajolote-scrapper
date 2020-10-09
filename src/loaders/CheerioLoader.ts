import axios from 'axios'
import * as cheerio from 'cheerio'

import { IDOMLoader, IProxy } from '../types'

type CheerioLoaderOptions = {
  proxy?: Boolean,
  useRandomSession?: Boolean
}

export default class CheerioLoader implements IDOMLoader<CheerioStatic> {
  proxy: IProxy | undefined
  options: CheerioLoaderOptions

  constructor (options: CheerioLoaderOptions = {}, proxy: IProxy | undefined = undefined) {
    this.options = options
    this.proxy = proxy
  }

  async load (url: string, fetchOptions: any = {}): Promise<CheerioStatic> {
    fetchOptions.url = url
    fetchOptions.timeout = 10000
    fetchOptions.headers = {
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      referer: 'http://www.google.com/'
    }

    if (this.proxy && this.options.proxy) {
      const session = fetchOptions.session || Math.ceil(Math.random() * 1e4)
      const httpsAgent = (fetchOptions.session || this.options.useRandomSession)
        ? this.proxy.getHttpsProxyAgentWithSession(`${session}`)
        : this.proxy.getHttpsProxyAgent()
      fetchOptions.httpsAgent = httpsAgent
      fetchOptions.proxy = false
    }

    const { data } = await axios.request(fetchOptions)
    return cheerio.load(data)
  }
}

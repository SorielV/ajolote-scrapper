import 'dotenv/config'

import { Category, IProxyOptions } from '../types'
import config from '../config'

import Store from '../stores/JSONStore'
import DOMLoader from '../loaders/CheerioLoader'
import Proxy from '../proxies/BotProxy'
import Controller from '../controllers/DIMERCOM'
import logger from '../utils/logger'
import { append } from '../utils/query'

const store = new Store('./data/DIMERCOM')
const proxyOptions = config.proxy as IProxyOptions
const proxy = new Proxy(proxyOptions)

const domLoader = new DOMLoader({ proxy: true, useRandomSession: true }, proxy)

const page = {
  url: 'https://www.dimercom.mx/index.php',
  queryParams: {
    sucursal: '0',
    route: 'product/category'
  },
  categories: [
    {
      queryParams: {
        path: '27'
      },
      name: 'mobo'
    },
    {
      queryParams: {
        path: '10_123'
      },
      name: 'case'
    },
    {
      queryParams: {
        path: '17'
      },
      name: 'cpu'
    },
    {
      queryParams: {
        path: '26'
      },
      name: 'gpu'
    },
    {
      queryParams: {
        path: '6_109'
      },
      name: 'hdd'
    },
    {
      queryParams: {
        path: '6_110'
      },
      name: 'ssd'
    },
    {
      queryParams: {
        path: '13_138'
      },
      name: 'ram'
    },
    {
      queryParams: {
        path: '13_139'
      },
      name: 'ram',
      sub: 'laptop'
    },
    {
      queryParams: {
        path: '9_116'
      },
      name: 'psu'
    },
    {
      queryParams: {
        path: '14'
      },
      name: 'monitor'
    }
  ]
}

const categories: Category[] = page.categories.map(({ name, queryParams, sub }) => ({
  name,
  sub,
  url: append(page.url, { ...page.queryParams, ...queryParams })
}))

export default function scrap () {
  const controller = new Controller({
    categories,
    store,
    domLoader,
    logger,
    options: {
      delay: 2000,
      maxParallelRequests: 5,
      saveAllCategories: true
    }
  })
  return controller.scrap()
}

import 'dotenv/config'

import { Category, IProxyOptions } from '../types'
import config from '../config'

import Store from '../stores/JSONStore'
import DOMLoader from '../loaders/JSDomLoader'
import Proxy from '../proxies/BotProxy'
import Controller from '../controllers/PCEL'
import logger from '../utils/logger'
import { append } from '../utils/query'

const store = new Store('./data/PCEL')
const proxyOptions = config.proxy as IProxyOptions
const proxy = new Proxy(proxyOptions)

const domLoader = new DOMLoader({ proxy: true, useRandomSession: true }, proxy)

const page = {
  url: 'https://pcel.com',
  queryParams: {
    sucursal: '0'
  },
  categories: [
    {
      url: 'hardware/tarjetas-madre',
      name: 'mobo'
    },
    {
      url: 'hardware/gabinetes',
      name: 'case'
    },
    {
      url: 'hardware/procesadores',
      name: 'cpu'
    },
    {
      url: 'hardware/tarjetas-de-video',
      name: 'gpu'
    },
    {
      url: 'hardware/discos-duros/discos-duros-internos',
      name: 'hdd'
    },
    {
      url: 'hardware/discos-duros/unidades-de-estado-solido-ssd',
      name: 'ssd'
    },
    {
      url: 'hardware/memorias/memorias-ddr',
      name: 'ram'
    },
    {
      url: 'hardware/memorias/memoria-sodimm-laptops',
      name: 'ram',
      sub: 'laptop'
    },
    {
      url: 'hardware/fuentes-de-poder',
      name: 'psu'
    },
    {
      url: 'hardware/monitores',
      name: 'monitor'
    }
  ]
}

const categories: Category[] = page.categories.map(({ name, url }) => ({
  name,
  url: append(`${page.url}/${url}`, page.queryParams)
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

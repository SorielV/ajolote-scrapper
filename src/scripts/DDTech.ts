import 'dotenv/config'

import { Category, IProxyOptions } from '../types'
import config from '../config'

import Store from '../stores/JSONStore'
import DOMLoader from '../loaders/CheerioLoader'
import Proxy from '../proxies/BotProxy'
import Controller from '../controllers/DDTech'
import logger from '../utils/logger'
import { append } from '../utils/query'

const store = new Store('./data/DDTech')
const proxyOptions = config.proxy as IProxyOptions
const proxy = new Proxy(proxyOptions)

const domLoader = new DOMLoader({ proxy: true, useRandomSession: true }, proxy)

const page = {
  url: 'https://ddtech.mx/productos',
  queryParams: {
    stock: 'con-existencia',
    orden: 'nuevos'
  },
  categories: [
    {
      name: 'mobo',
      url: 'componentes/tarjetas-madre'
    },
    {
      name: 'case',
      url: 'componentes/gabinetes'
    },
    {
      name: 'cpu',
      url: 'componentes/procesadores'
    },
    {
      name: 'gpu',
      url: 'componentes/tarjetas-de-video'
    },
    {
      name: 'hdd',
      url: 'componentes/discos-duros-internos'
    },
    {
      name: 'ssd',
      url: 'componentes/unidades-ssd'
    },
    {
      name: 'ram',
      url: 'componentes/memoria-ram'
    },
    {
      name: 'psu',
      url: 'componentes/fuente-de-alimentacion'
    },
    {
      name: 'monitor',
      url: 'monitores/monitores'
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

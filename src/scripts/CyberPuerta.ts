import 'dotenv/config'

import { Category, IProxyOptions } from '../types'

import Store from '../stores/JSONStore'
import DOMLoader from '../loaders/CheerioLoader'
import Proxy from '../proxies/BotProxy'
import Controller from '../controllers/CyberPuerta'
import logger from '../utils/logger'
import { append } from '../utils/query'
import config from '../config'
import { sanitize } from '../utils/string'

const store = new Store('./data/CyberPuerta')
const proxyOptions = config.proxy as IProxyOptions
const proxy = new Proxy(proxyOptions)

const domLoader = new DOMLoader({ proxy: true, useRandomSession: true }, proxy)

const page = {
  url: 'https://www.cyberpuerta.mx/Computo-Hardware',
  urlParams: ['EnviadoDesde/MEX'], // Estatus/En-existencia
  queryParams: {
    listorderby: 'oxinsert',
    listorder: 'desc'
  },
  categories: [
    {
      name: 'mobo',
      url: 'Componentes/Tarjetas-Madre'
    },
    {
      name: 'case',
      url: 'Componentes/Gabinetes'
    },
    {
      name: 'cpu',
      url: 'Componentes/Procesadores/Procesadores-para-PC'
    },
    {
      name: 'gpu',
      url: 'Componentes/Tarjetas-de-Video'
    },
    {
      name: 'hdd',
      url: 'Discos-Duros-SSD-NAS/Discos-Duros-Internos-para-PC'
    },
    {
      name: 'ssd',
      url: 'Discos-Duros-SSD-NAS/SSD'
    },
    {
      name: 'ram',
      sub: 'ddr3',
      url: 'Memorias-RAM-Flash/Memorias-RAM-para-PC/Filtro/Tipo-de-memoria-interna/DDR3L/Tipo-de-memoria-interna/DDR3'
    },
    {
      name: 'ram',
      sub: 'ddr4',
      url: 'Memorias-RAM-Flash/Memorias-RAM-para-PC/Filtro/Tipo-de-memoria-interna/DDR4'
    },
    {
      name: 'psu',
      url: 'Componentes/Fuentes-de-Poder-para-PC-s'
    },
    {
      name: 'monitor',
      url: 'Monitores/Monitores'
    }
  ]
}

const categories: Category[] = page.categories.map(({ name, sub, url }) => ({
  name,
  subCategory: sub,
  url: append(
    sanitize([page.url, url, url.includes('Filtro') ? '' : 'Filtro', page.urlParams.join('/')].join('/')),
    page.queryParams
  )
}
))

export default function scrap () {
  const controller = new Controller({
    categories,
    store,
    domLoader,
    logger,
    options: {
      delay: 10000,
      maxParallelRequests: 3,
      saveAllCategories: true
    }
  })

  return controller.scrap()
}

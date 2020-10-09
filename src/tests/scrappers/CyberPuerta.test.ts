import cheerio from 'cheerio'
import {
  IProductStore,
  IDOMLoader,
  IScrapperMeta
} from '../../types'

import logger from '../../utils/logger'
import CyberPuertaScrapper from '../../scrappers/CyberPuertaScrapper'
import { pagination, woPagination, woProducts } from '../assets/cyberpuerta'

describe('CyberPuerta Scrapper', () => {
  function mockStore () {
    const storeFunctions = {
      save: jest.fn()
    }
    const Store = jest.fn<IProductStore, []>(() => storeFunctions)
    return { Store, storeFunctions }
  }

  function mockDOM () {
    const domFunctions = {
      $: cheerio.load(''),
      load: jest.fn()
    }
    const DOM = jest.fn<IDOMLoader<CheerioStatic>, []>(() => domFunctions)
    return { DOM, domFunctions }
  }

  describe('Scrap Function', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.scrap()).resolves.toBeFalsy()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('When the scrapper is already loaded', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await cyberPuerta.load()
      await cyberPuerta.scrap()

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('Error products not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(woProducts))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.scrap()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('Save Function', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.scrap()).resolves.toBeFalsy()
      await expect(cyberPuerta.save()).resolves.toBeFalsy()

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('Scrap Products', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.load()).resolves.toBeFalsy()
      await expect(cyberPuerta.scrapProducts()).resolves.toEqual(expect.any(Array))
      expect(cyberPuerta.products).toHaveLength(1)
      expect(cyberPuerta.products).toEqual([
        {
          pid: '39a01406ce1fbaeb13825001fcd5486e',
          name: 'Tarjeta de Video Gigabyte NVIDIA GeForce GTX 1660 OC, 6GB 192-bit GDDR5, PCI Express x16 3.0',
          price: 5799,
          hasStock: true,
          pn: 'GV-N1660OC-6GD',
          brand: 'GIGABYTE',
          shippingCost: 99,
          ratting: null,
          url: 'https://www.cyberpuerta.mx/Computo-Hardware/Componentes/Tarjetas-de-Video/Tarjeta-de-Video-Gigabyte-NVIDIA-GeForce-GTX-1660-OC-6GB-192-bit-GDDR5-PCI-Express-x16-3-0.html',
          category: 'Foo',
          store: 'CyberPuerta'
        }
      ])
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('Error when scrapper is  not loader yet', async () => {
      const { Store } = mockStore()
      const { DOM } = mockDOM()

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.scrapProducts()).rejects.toThrow()
    })

    it('Error Products not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(woProducts))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.load()).resolves.toBeFalsy()
      await expect(cyberPuerta.scrapProducts()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('Scrap Pagination', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.load()).resolves.toBeFalsy()
      await expect(cyberPuerta.scrapPagination()).resolves.toEqual(expect.any(Object))
      expect(cyberPuerta.pagination).toBeTruthy()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('Error when is not loader yet', async () => {
      const { Store } = mockStore()
      const { DOM } = mockDOM()

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.scrapPagination()).rejects.toThrow()
    })

    it('Products not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(woPagination))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.load()).resolves.toBeFalsy()
      await expect(cyberPuerta.scrapPagination()).resolves.toBeTruthy()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('Products and pagination not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(woProducts))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'CyberPuerta'
      }

      const cyberPuerta = new CyberPuertaScrapper({ meta, store, domLoader: dom, logger })
      await expect(cyberPuerta.load()).resolves.toBeFalsy()
      await expect(cyberPuerta.scrapPagination()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })
})

import cheerio from 'cheerio'
import {
  IProductStore,
  IDOMLoader,
  IScrapperMeta
} from '../../types'

import logger from '../../utils/logger'
import DDTechScrapper from '../../scrappers/DDTechScrapper'
import { pagination, woPagination, woProducts } from '../assets/ddtech'

describe('DDTech Scrapper', () => {
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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await ddTech.scrap()

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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await ddTech.load()
      await ddTech.scrap()

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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await expect(ddTech.scrap()).rejects.toThrow()
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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await expect(ddTech.scrap()).resolves.toBeFalsy()
      await expect(ddTech.save()).resolves.toBeFalsy()

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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await expect(ddTech.load()).resolves.toBeFalsy()
      await expect(ddTech.scrapProducts()).resolves.toEqual(expect.any(Array))
      expect(ddTech.products).toHaveLength(3)
      expect(ddTech.products).toEqual([
        {
          pid: '7851',
          name: 'Ventilador Naceb Ring Rojo 120mm para gabinete NA-0921R',
          price: 149,
          hasStock: true,
          pn: null,
          brand: null,
          shippingCost: null,
          ratting: null,
          url: 'https://ddtech.mx/producto/ventilador-naceb-ring-rojo-120mm-para-gabinete-na-0921r',
          category: 'Foo',
          store: 'DDTech'
        },
        {
          pid: '3970',
          name: 'Ventilador para Gabinete 120mm con Luz Led Azul Cooler Master SickleFlow / R4-L2R-20AC-GP',
          price: 149,
          hasStock: true,
          pn: null,
          brand: null,
          shippingCost: null,
          ratting: null,
          url: 'https://ddtech.mx/producto/ventilador-para-gabinete-120mm-con-luz-led-azul-cooler-master-sickleflow-r4-l2r-20ac-gp',
          category: 'Foo',
          store: 'DDTech'
        },
        {
          pid: '7850',
          name: 'Ventilador Naceb 15LED Rojo 120mm para gabinete NA-0920R',
          price: 119,
          hasStock: true,
          pn: null,
          brand: null,
          shippingCost: null,
          ratting: null,
          url: 'https://ddtech.mx/producto/ventilador-naceb-15led-rojo-120mm-para-gabinete-na-0920r',
          category: 'Foo',
          store: 'DDTech'
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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await expect(ddTech.scrapProducts()).rejects.toThrow()
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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await expect(ddTech.load()).resolves.toBeFalsy()
      await expect(ddTech.scrapProducts()).rejects.toThrow()
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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await expect(ddTech.load()).resolves.toBeFalsy()
      await expect(ddTech.scrapPagination()).resolves.toEqual(expect.any(Object))
      expect(ddTech.pagination).toBeTruthy()
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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await expect(ddTech.scrapPagination()).rejects.toThrow()
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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await expect(ddTech.load()).resolves.toBeFalsy()
      await expect(ddTech.scrapPagination()).resolves.toBeTruthy()
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
        store: 'DDTech'
      }

      const ddTech = new DDTechScrapper({ meta, store, domLoader: dom, logger })
      await expect(ddTech.load()).resolves.toBeFalsy()
      await expect(ddTech.scrapPagination()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })
})

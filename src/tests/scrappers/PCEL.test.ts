import { JSDOM } from 'jsdom'

import {
  IProductStore,
  IDOMLoader,
  IScrapperMeta
} from '../../types'

import logger from '../../utils/logger'
import PCELScrapper from '../../scrappers/PCELScrapper'
import { pagination, woPagination, woProducts } from '../assets/pcel'

describe('PCEL Scrapper', () => {
  function mockStore () {
    const storeFunctions = {
      save: jest.fn()
    }
    const Store = jest.fn<IProductStore, []>(() => storeFunctions)
    return { Store, storeFunctions }
  }

  function mockDOM () {
    const domFunctions = {
      $: new JSDOM(''),
      load: jest.fn()
    }
    const DOM = jest.fn<IDOMLoader<JSDOM>, []>(() => domFunctions)
    return { DOM, domFunctions }
  }

  describe('Scrap Function', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(new JSDOM(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await pcel.scrap()

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('When the scrapper is already loaded', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(new JSDOM(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await pcel.load()
      await pcel.scrap()

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('Error products not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(new JSDOM(woProducts))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await expect(pcel.scrap()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('Save Function', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(new JSDOM(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await expect(pcel.scrap()).resolves.toBeFalsy()
      await expect(pcel.save()).resolves.toBeFalsy()

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('Scrap Products', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(new JSDOM(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await expect(pcel.load()).resolves.toBeFalsy()
      await expect(pcel.scrapProducts()).resolves.toEqual(expect.any(Array))
      expect(pcel.products).toHaveLength(2)
      expect(pcel.products).toEqual([
        {
          pn: null,
          pid: '362174',
          price: 3699,
          brand: 'ASUS',
          name: 'T. Madre Asus PRIME B550M-A/CSM, Chipset AMD B550M, Soporta: Procesador AMD Ryzen 3ra Generación, Socket AM4, Memoria: DDR4 4600(O.C.)/3866/2133 MHz, 128GB Max, Integrado: Audio HD, Red, USB 3.0, SATA 3.0, Micro-ATX, Ptos: 1xPCIE 4.0 x16.',
          hasStock: true,
          shippingCost: null,
          ratting: null,
          url: 'https://pcel.com/tarjetas-madre/ASUS-PRIME-B550M-A-CSM-T-Madre-Asus-PRIME-B550M-A-CSM-Chipset-AMD-B550M-Soporta-Procesador-AMD-Ryzen-3ra-Generacion-Socket-AM4-Memoria-DDR4-4600-O-C-3866-2133-MHz-128GB-Max-Integr-362174',
          category: 'Foo',
          store: 'PCEL'
        },
        {
          pn: null,
          pid: '364822',
          price: 1599,
          brand: 'Biostar',
          name: 'T. Madre Biostar A10N-9630E, Procesador integrado AMD A10-9630P (hasta 3.3GHz), Memoria: DDR4 2133/2400 MHz, 32GB Max, Integrado: AMD Radeon R5 graphics, Audio, Red, SATA 3.0, Mini-ITX, 1xPCIEx16.',
          hasStock: false,
          shippingCost: null,
          ratting: null,
          url: 'https://pcel.com/tarjetas-madre/Biostar-A10N-9630E-T-Madre-Biostar-A10N-9630E-Procesador-integrado-AMD-A10-9630P-hasta-3-3GHz-Memoria-DDR4-2133-2400-MHz-32GB-Max-Integrado-AMD-Radeon-R5-graphics-Audio-Red-364822',
          category: 'Foo',
          store: 'PCEL'
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
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await expect(pcel.scrapProducts()).rejects.toThrow()
    })

    it('Error Products not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(new JSDOM(woProducts))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await expect(pcel.load()).resolves.toBeFalsy()
      await expect(pcel.scrapProducts()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('Scrap Pagination', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(new JSDOM(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await expect(pcel.load()).resolves.toBeFalsy()
      await expect(pcel.scrapPagination()).resolves.toEqual(expect.any(Object))
      expect(pcel.pagination).toBeTruthy()
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
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await expect(pcel.scrapPagination()).rejects.toThrow()
    })

    it('Products not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(new JSDOM(woPagination))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await expect(pcel.load()).resolves.toBeFalsy()
      await expect(pcel.scrapPagination()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('Products and pagination not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(new JSDOM(woProducts))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'PCEL'
      }

      const pcel = new PCELScrapper({ meta, store, domLoader: dom, logger })
      await expect(pcel.load()).resolves.toBeFalsy()
      await expect(pcel.scrapPagination()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })
})

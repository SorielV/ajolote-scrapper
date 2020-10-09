import cherrio from 'cheerio'

import {
  IProductStore,
  IDOMLoader,
  IScrapperMeta
} from '../../types'

import logger from '../../utils/logger'
import DIMERCOMScrapper from '../../scrappers/DIMERCOMScrapper'
import { pagination, woPagination, woProducts } from '../assets/dimercom'

describe('DIMERCOM Scrapper', () => {
  function mockStore () {
    const storeFunctions = {
      save: jest.fn()
    }
    const Store = jest.fn<IProductStore, []>(() => storeFunctions)
    return { Store, storeFunctions }
  }

  function mockDOM () {
    const domFunctions = {
      $: cherrio.load(''),
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
        .mockResolvedValueOnce(cherrio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await dimerCom.scrap()

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('When the scrapper is already loaded', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cherrio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await dimerCom.load()
      await dimerCom.scrap()

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('Error products not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cherrio.load(woProducts))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await expect(dimerCom.scrap()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('Save Function', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cherrio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await expect(dimerCom.scrap()).resolves.toBeFalsy()
      await expect(dimerCom.save()).resolves.toBeFalsy()

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('Scrap Products', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cherrio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await expect(dimerCom.load()).resolves.toBeFalsy()
      await expect(dimerCom.scrapProducts()).resolves.toEqual(expect.any(Array))
      expect(dimerCom.products).toHaveLength(2)
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
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await expect(dimerCom.scrapProducts()).rejects.toThrow()
    })

    it('Error Products not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cherrio.load(woProducts))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await expect(dimerCom.load()).resolves.toBeFalsy()
      await expect(dimerCom.scrapProducts()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })

  describe('Scrap Pagination', () => {
    it('Default Behavior', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cherrio.load(pagination.page1))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await expect(dimerCom.load()).resolves.toBeFalsy()
      await expect(dimerCom.scrapPagination()).resolves.toEqual(expect.any(Object))
      expect(dimerCom.pagination).toBeTruthy()
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
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await expect(dimerCom.scrapPagination()).rejects.toThrow()
    })

    it('Products not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cherrio.load(woPagination))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await expect(dimerCom.load()).resolves.toBeFalsy()
      await expect(dimerCom.scrapPagination()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })

    it('Products and pagination not found', async () => {
      const { Store } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cherrio.load(woProducts))

      const dom = new DOM()
      const store = new Store()
      const meta: IScrapperMeta = {
        url: 'foo.com',
        category: 'Foo',
        store: 'DIMERCOM'
      }

      const dimerCom = new DIMERCOMScrapper({ meta, store, domLoader: dom, logger })
      await expect(dimerCom.load()).resolves.toBeFalsy()
      await expect(dimerCom.scrapPagination()).rejects.toThrow()
      expect(domFunctions.load).toHaveBeenCalledTimes(1)
    })
  })
})

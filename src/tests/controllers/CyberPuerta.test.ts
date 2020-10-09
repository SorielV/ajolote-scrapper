import cheerio from 'cheerio'
import {
  Category,
  IProductStore,
  IDOMLoader
} from '../../types'
import * as time from '../../utils/time'

import CyberPuertaController, { replacePageIndex } from '../../controllers/CyberPuerta'
import { pagination, woProducts, woPagination } from '../assets/cyberpuerta'
import logger from './../../utils/logger' // TODO: Mock Logger

describe('CyberPuerta Scrapper Controler', () => {
  describe('Replace Page Index', () => {
    describe('Page 1', () => {
      it('When url has page index', () => {
        const url = 'foo.com/2/'
        expect(replacePageIndex(url, 1)).toBe('foo.com/')
      })

      it('When url not has page index', () => {
        const url = 'foo.com/'
        expect(replacePageIndex(url, 1)).toBe('foo.com/')
      })
    })

    describe('When page is not 1', () => {
      it('When url has page index', () => {
        const url = 'foo.com/2/'
        expect(replacePageIndex(url, 3)).toBe('foo.com/3')
      })

      it('When url not has page index', () => {
        const url = 'foo.com/'
        expect(replacePageIndex(url, 3)).toBe('foo.com/3')
      })
    })

    describe('When url has Filters', () => {
      it('When url has page index', () => {
        const url = 'foo.com/2/Filtro/Foo'
        expect(replacePageIndex(url, 3)).toBe('foo.com/3/Filtro/Foo')
      })

      it('When url not has page index', () => {
        const url = 'foo.com/Filtro/Foo'
        expect(replacePageIndex(url, 3)).toBe('foo.com/3/Filtro/Foo')
      })
    })
  })

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

  describe('Run', () => {
    it('Default Behavior', async () => {
      const categories: Category[] = [{
        url: 'foo.com',
        name: 'gpu'
      }]

      const { Store, storeFunctions } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(pagination.page1))
        .mockResolvedValueOnce(cheerio.load(pagination.page1))
        .mockResolvedValueOnce(cheerio.load(pagination.page2))
        .mockResolvedValueOnce(cheerio.load(pagination.page3))

      const dom = new DOM()
      const store = new Store()

      const cyberPuerta = new CyberPuertaController({ categories, store, domLoader: dom, logger })
      await expect(cyberPuerta.scrap()).resolves.toEqual([])

      expect(domFunctions.load).toHaveBeenCalledTimes(4)
      expect(storeFunctions.save).toHaveBeenCalledTimes(1)
      expect(storeFunctions.save).toHaveBeenCalledWith(expect.any(Array), undefined)
    })

    it('Single page (without pagination)', async () => {
      const categories: Category[] = [{
        url: 'foo.com',
        name: 'gpu'
      }]

      const { Store, storeFunctions } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(woPagination))
        .mockResolvedValueOnce(cheerio.load(woPagination))

      const dom = new DOM()
      const store = new Store()

      const cyberPuerta = new CyberPuertaController({ categories, store, domLoader: dom, logger })
      await cyberPuerta.scrap()

      expect(domFunctions.load).toHaveBeenCalledTimes(2)
      expect(storeFunctions.save).toHaveBeenCalledTimes(1)
      expect(storeFunctions.save).toHaveBeenCalledWith(expect.any(Array), undefined)
    })

    it('Single page without products', async () => {
      const categories: Category[] = [{
        url: 'foo.com',
        name: 'gpu'
      }]

      const { Store, storeFunctions } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(woProducts))

      const dom = new DOM()
      const store = new Store()

      const cyberPuerta = new CyberPuertaController({ categories, store, domLoader: dom, logger })
      const errors = await cyberPuerta.scrap()
      expect(errors).toHaveLength(1)

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
      expect(storeFunctions.save).toHaveBeenCalledTimes(1)
      expect(storeFunctions.save).toHaveBeenCalledWith(expect.any(Array), undefined)
    })

    it('Error fetching page', async () => {
      const categories: Category[] = [{
        url: 'foo.com',
        name: 'gpu'
      }]

      const { Store, storeFunctions } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockResolvedValueOnce(cheerio.load(pagination.page3))
        .mockResolvedValueOnce(cheerio.load(pagination.page1))
        .mockResolvedValueOnce(cheerio.load(pagination.page2))
        .mockRejectedValueOnce(new Error('Foo'))

      const dom = new DOM()
      const store = new Store()

      const cyberPuerta = new CyberPuertaController({ categories, store, domLoader: dom, logger })
      await cyberPuerta.scrap()

      expect(domFunctions.load).toHaveBeenCalledTimes(4)
      expect(storeFunctions.save).toHaveBeenCalledTimes(1)
      expect(storeFunctions.save).toHaveBeenCalledWith(expect.any(Array), undefined)
    })

    it('Error fetching pagination page', async () => {
      const categories: Category[] = [{
        url: 'foo.com',
        name: 'gpu'
      }]

      const { Store, storeFunctions } = mockStore()
      const { DOM, domFunctions } = mockDOM()
      domFunctions.load
        .mockRejectedValueOnce({})

      const dom = new DOM()
      const store = new Store()

      const cyberPuerta = new CyberPuertaController({ categories, store, domLoader: dom, logger })
      const errors = await cyberPuerta.scrap()
      expect(errors).toHaveLength(1)

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
      expect(storeFunctions.save).toHaveBeenCalledTimes(1)
      expect(storeFunctions.save).toHaveBeenCalledWith(expect.any(Array), undefined)
    })

    describe('Options', () => {
      it('Delay', async () => {
        const categories: Category[] = [{
          url: 'foo.com',
          name: 'gpu'
        }]

        const { Store, storeFunctions } = mockStore()
        const { DOM, domFunctions } = mockDOM()
        domFunctions.load
          .mockResolvedValueOnce(cheerio.load(pagination.page1))
          .mockResolvedValueOnce(cheerio.load(pagination.page1))
          .mockResolvedValueOnce(cheerio.load(pagination.page2))
          .mockResolvedValueOnce(cheerio.load(pagination.page3))

        const dom = new DOM()
        const store = new Store()

        const delaySpy = jest.spyOn(time, 'delay')
        delaySpy.mockImplementation(() => Promise.resolve())

        const options = {
          delay: 3000
        }
        const cyberPuerta = new CyberPuertaController({ categories, store, domLoader: dom, options, logger })
        await cyberPuerta.scrap()

        expect(delaySpy).toHaveBeenCalledTimes(3)
        expect(delaySpy).toHaveBeenCalledWith(options.delay)
        expect(domFunctions.load).toHaveBeenCalledTimes(4)
        expect(storeFunctions.save).toHaveBeenCalledTimes(1)
        expect(storeFunctions.save).toHaveBeenCalledWith(expect.any(Array), undefined)
      })
    })
  })
})

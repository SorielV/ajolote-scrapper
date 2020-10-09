import cheerio from 'cheerio'

import {
  Category,
  IProductStore,
  IDOMLoader
} from '../../types'
import * as time from '../../utils/time'

import DIMERCOMController, { replacePageIndex } from '../../controllers/DIMERCOM'
import { pagination, woProducts, woPagination } from '../assets/dimercom'
import logger from './../../utils/logger'

describe('DIMERCOM Scrapper Controler', () => {
  describe('Replace Page Index', () => {
    it('When url not has query params', () => {
      const url = 'foo.com'
      expect(replacePageIndex(url, 1)).toBe('foo.com?page=1')
    })

    it('When url has query params', () => {
      const url = 'foo.com?p=1&pagina=10'
      expect(replacePageIndex(url, 1)).toBe('foo.com?p=1&pagina=10&page=1')
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
        .mockResolvedValueOnce(cheerio.load(pagination.page2))

      const dom = new DOM()
      const store = new Store()

      const ddTech = new DIMERCOMController({ categories, store, domLoader: dom, logger })
      await expect(ddTech.scrap()).resolves.toEqual([])

      expect(domFunctions.load).toHaveBeenCalledTimes(2)
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

      const dom = new DOM()
      const store = new Store()

      const ddTech = new DIMERCOMController({ categories, store, domLoader: dom, logger })
      await ddTech.scrap()

      expect(domFunctions.load).toHaveBeenCalledTimes(1)
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

      const ddTech = new DIMERCOMController({ categories, store, domLoader: dom, logger })
      const errors = await ddTech.scrap()
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
        .mockResolvedValueOnce(cheerio.load(pagination.page1))
        .mockRejectedValueOnce(new Error('Foo'))

      const dom = new DOM()
      const store = new Store()

      const ddTech = new DIMERCOMController({ categories, store, domLoader: dom, logger })
      await ddTech.scrap()

      expect(domFunctions.load).toHaveBeenCalledTimes(2)
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

      const ddTech = new DIMERCOMController({ categories, store, domLoader: dom, logger })
      const errors = await ddTech.scrap()
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
          .mockResolvedValueOnce(cheerio.load(pagination.page2))

        const dom = new DOM()
        const store = new Store()

        const delaySpy = jest.spyOn(time, 'delay')
        delaySpy.mockImplementation(() => Promise.resolve())

        const options = {
          delay: 3000
        }
        const ddTech = new DIMERCOMController({ categories, store, domLoader: dom, logger, options })
        await ddTech.scrap()

        expect(delaySpy).toHaveBeenCalledTimes(1)
        expect(delaySpy).toHaveBeenCalledWith(options.delay)
        expect(domFunctions.load).toHaveBeenCalledTimes(2)
        expect(storeFunctions.save).toHaveBeenCalledTimes(1)
        expect(storeFunctions.save).toHaveBeenCalledWith(expect.any(Array), undefined)
      })
    })
  })
})

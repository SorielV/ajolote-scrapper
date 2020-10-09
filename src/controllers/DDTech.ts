import {
  IScrapperMeta,
  IScrapperPagination
} from '../types'
import BaseScrapperController from './BaseScrapperController'
import DDTechScrapper from '../scrappers/DDTechScrapper'
import { append } from '../utils/query'

export function replacePageIndex (url: string, page: number, query: any = {}) {
  return append(url, { ...query, pagina: page })
}

export default class DDTech extends BaseScrapperController<CheerioStatic> {
    storeName: string = 'DDTech';

    scrapperInstance (meta: IScrapperMeta, page?: number): DDTechScrapper {
      if (page) {
        const pageMeta = {
          ...meta,
          url: replacePageIndex(meta.url, page)
        }
        return new DDTechScrapper({ meta: pageMeta, store: this.store, domLoader: this.domLoader, logger: this.logger })
      }
      return new DDTechScrapper({ meta, store: this.store, domLoader: this.domLoader, logger: this.logger })
    }

    async scrapPagination (meta: IScrapperMeta): Promise<IScrapperPagination> {
      const scrapper = this.scrapperInstance(meta, 25)
      await scrapper.load()
      const pagination = await scrapper.scrapPagination()
      this.pagination.set(meta.category, pagination)
      return pagination
    }
}

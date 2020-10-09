import { JSDOM } from 'jsdom'

import {
  IScrapper,
  IScrapperMeta,
  IScrapperPagination
} from '../types'
import BaseScrapperController from './BaseScrapperController'
import PCELScrapper from '../scrappers/PCELScrapper'
import { append } from '../utils/query'

export const replacePageIndex = (url: string, page: number, query: any = {}) => append(url, { ...query, page })

export default class PCEL extends BaseScrapperController<JSDOM> {
    storeName: string = 'PCEL';

    getScrappersFromPagination (meta: IScrapperMeta, pagination: IScrapperPagination): IScrapper<JSDOM>[] {
      const pageMeta = {
        ...meta,
        url: replacePageIndex(meta.url, 1, { limit: pagination.totalRecords })
      }
      return [this.scrapperInstance(pageMeta)]
    }

    scrapperInstance (meta: IScrapperMeta): PCELScrapper {
      return new PCELScrapper({ meta, store: this.store, domLoader: this.domLoader, logger: this.logger })
    }
}

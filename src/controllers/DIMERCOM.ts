import {
  IScrapper,
  IScrapperMeta,
  IScrapperPagination
} from '../types'
import BaseScrapperController from './BaseScrapperController'
import DIMERCOMScrapper from '../scrappers/DIMERCOMScrapper'
import { append } from '../utils/query'

export const replacePageIndex = (url: string, page: number, query: any = {}) => append(url, { ...query, page })

export default class DIMERCOM extends BaseScrapperController<CheerioStatic> {
    storeName: string = 'DIMERCOM';

    getScrappersFromPagination (meta: IScrapperMeta, pagination: IScrapperPagination): IScrapper<CheerioStatic>[] {
      const pageMeta = {
        ...meta,
        url: replacePageIndex(meta.url, 1, { limit: pagination.totalRecords })
      }
      return [this.scrapperInstance(pageMeta)]
    }

    scrapperInstance (meta: IScrapperMeta): DIMERCOMScrapper {
      return new DIMERCOMScrapper({ meta, store: this.store, domLoader: this.domLoader, logger: this.logger })
    }
}

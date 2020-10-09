import {
  IScrapperMeta
} from '../types'
import BaseScrapperController from './BaseScrapperController'
import CyberPuertaScrapper from '../scrappers/CyberPuertaScrapper'

export function replacePageIndex (url: string, page: number) {
  const hasFilter = url.includes('/Filtro/')
  const value = `/${page !== 1 ? page : ''}${hasFilter ? '/Filtro' : ''}`
    .replace('//', '/')

  return url.replace(
    /(((?:\/\d\/$))|((?:\/\d)(\/Filtro))|((?:\/)(Filtro))|((?:\/$|$)))/,
    value
  )
}

export default class CyberPuerta extends BaseScrapperController<CheerioStatic> {
    storeName: string = 'CyberPuerta';

    scrapperInstance (meta: IScrapperMeta, page?: number): CyberPuertaScrapper {
      if (page) {
        const pageMeta = {
          ...meta,
          url: replacePageIndex(meta.url, page)
        }
        return new CyberPuertaScrapper({ meta: pageMeta, store: this.store, domLoader: this.domLoader, logger: this.logger })
      }
      return new CyberPuertaScrapper({ meta, store: this.store, domLoader: this.domLoader, logger: this.logger })
    }
}

import {
  Product,
  IScrapperPagination,
  ScrapperError
} from '../types'
import BaseScrapper from './BaseScrapper'

import { sanitize } from '../utils/string'

function pricerFormatter (str: string): number {
  return +sanitize(str).replace(/[$,]/g, '')
}

export default class DDTechScrapper extends BaseScrapper<CheerioStatic> {
    dom: CheerioStatic | undefined

    async scrapProducts (): Promise<Product[]> {
      if (!this.isLoaded || !this.dom) {
        throw new ScrapperError('DOM', this.meta)
      }

      const $ = this.dom

      const isEmpty = !$('.product-list > div').html()
      if (isEmpty) {
        throw new ScrapperError('Products not found', this.meta)
      }

      this.products = $('.product-list > div')
        .map((i, el) => {
          const pidMatcher = /product_id=(?<productId>\d+)/
          const url = $(el).find('.name a').attr('href')!
          const price = pricerFormatter($(el).find('.price-fixed').text())
          const name = sanitize($(el).find('.name').text())
          const pid = pidMatcher.test(url || '')
            ? url?.match(pidMatcher)?.groups?.productId
            : null

          const product: Product = {
            pid: pid || null,
            pn: null,
            name,
            price,
            brand: null,
            hasStock: null,
            shippingCost: null,
            ratting: null,
            ...this.meta,
            url
          }
          return product
        })
        .get()

      return this.products
    }

    async scrapPagination (): Promise<IScrapperPagination> {
      if (this.dom === undefined) {
        throw new ScrapperError('DOM', this.meta)
      }

      const $ = this.dom

      const isEmpty = !$('.product-list > div').html()
      if (isEmpty) {
        throw new ScrapperError('Products not found', this.meta)
      }

      const pagination = $('.pagination .results').text()
      if (pagination) {
        const matcher = /Mostrando \d+ al (?<total>\d+) de \d+ \((?<pages>\d+) P.ginas\)/
        if (matcher.test(pagination)) {
          const match = pagination.match(matcher)
          if (match && match.groups) {
            match.includes('index')
            const total = match.groups.total!
            const pages = match.groups.pages!

            this.pagination = {
              meta: this.meta,
              url: this.meta.url,
              page: 1,
              totalPages: +pages,
              totalRecords: +total
            }
          }
        }
      }

      // Not possible
      if (!this.pagination) {
        throw new ScrapperError('Pagination not found', this.meta)
      }

      return this.pagination
    }
}

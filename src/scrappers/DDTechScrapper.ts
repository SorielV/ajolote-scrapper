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

      const isEmpty = !!$('.alert.alert-info.alert-dismissible').html()
      if (isEmpty) {
        throw new ScrapperError('Products not found', this.meta)
      }

      this.products = $('.list-products .row .item .products .product')
        .map((i, el) => {
          const pid = $(el).find('a.add-cart').attr('data-product-id')

          const name = sanitize($(el)
            .find('.product-info .name')
            .text()
          )
          const price = $(el)
            .find('.product-info .price')
            .text()

          const url = $(el)
            .find('.product-info .name a')
            .attr('href')

          const hasStock = !!$(el).find('a.add-cart').html()

          const product: Product = {
            pid: pid || null,
            name,
            price: pricerFormatter(price),
            hasStock,
            pn: null,
            brand: null,
            shippingCost: null,
            ratting: null,
            ...this.meta,
            url: url || '' // TODO: Handle
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

      const isEmpty = !!$('.alert.alert-info.alert-dismissible').html()
      if (isEmpty) {
        throw new ScrapperError('Pagination and products not found', this.meta)
      }

      const pagination = $('.product-pagination .btn-group')
        .children()
        .map((i, el) => ({
          url: $(el).attr('href'),
          page: +$(el).text(),
          active: !!$(el).hasClass('btn-primary')
        }))
        .get()
        .filter(({ page }) => !Number.isNaN(page))

      this.setPagination(pagination)

      if (!this.pagination) {
        this.pagination = {
          meta: this.meta,
          url: this.meta.url,
          page: 1,
          totalPages: 1
        }
      }

      return this.pagination
    }
}

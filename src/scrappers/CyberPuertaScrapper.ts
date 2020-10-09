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

export default class CyberPuertaScrapper extends BaseScrapper<CheerioStatic> {
    dom: CheerioStatic | undefined

    async scrapProducts (): Promise<Product[]> {
      if (!this.isLoaded || !this.dom) {
        throw new ScrapperError('DOM', this.meta)
      }

      const $ = this.dom

      const isEmpty = !!$('.emproductfilter_noproduct').html()
      if (isEmpty) {
        throw new ScrapperError('Products not found', this.meta)
      }

      this.products = $('#productList .productData')
        .map((i, el) => {
          const name = sanitize($(el).find('.emproduct_right_title').text())
          const url = $(el).find('a.cp-picture-container').attr('href')
          const price = pricerFormatter($(el).find('.price').text())
          const hasStock = !$(el).find('.emstock .emstock_nostock').html()
          const shippingCost = $(el).find('.deliveryvalue').text()
          const brand = $(el).find('.product-logo').attr('alt') || null
          // const rating = $(el).find('.cpreviews_stars_box_percent').attr('style')
          const pn = sanitize($(el).find('.emproduct_right_artnum').text())
          const pid = sanitize($(el).find('input[name=anid]').val())

          const product: Product = {
            pid: pid || null,
            name,
            price,
            hasStock,
            pn,
            brand,
            shippingCost: shippingCost ? pricerFormatter(shippingCost) : null,
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

      const isEmpty = !!$('.emproductfilter_noproduct').html()
      if (isEmpty) {
        throw new ScrapperError('Pagination and products not found', this.meta)
      }

      const pagination = $('#emlistpager .page')
        .map((i, el) => ({
          url: $(el).attr('href'),
          page: +$(el).text(),
          active: $(el).hasClass('active')
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

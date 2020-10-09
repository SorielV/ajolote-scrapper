import {
  Product,
  IScrapperPagination,
  ScrapperError
} from '../types'
import BaseScrapper from './BaseScrapper'

import { sanitize } from '../utils/string'
import { JSDOM } from 'jsdom'

function pricerFormatter (str: string): number {
  return +sanitize(str).replace(/[$,]/g, '')
}

export default class DDTechScrapper extends BaseScrapper<JSDOM> {
    dom: JSDOM | undefined

    async scrapProducts (): Promise<Product[]> {
      if (!this.isLoaded || !this.dom) {
        throw new ScrapperError('DOM', this.meta)
      }

      const $ = this.dom
      const { document } = $.window

      const isEmpty = !document.querySelectorAll('.product-list tbody tr:nth-child(odd)').length
      if (isEmpty) {
        throw new ScrapperError('Products not found', this.meta)
      }

      Array.from(document.querySelectorAll('.product-list tbody tr:nth-child(odd)'))
        .forEach((el, i) => {
          const data = el.querySelector('.productClick.detailProduct')

          if (!data) return false
          if (!data.getAttribute('data-price')) return false
          if (!data.getAttribute('data-name')) return false
          if (!data.getAttribute('href')) return false

          const stock = el.querySelectorAll('span.price-tax')
          let hasStock = true
          if (stock.length === 2 && stock[1] && stock[1].textContent === 'agotado') {
            hasStock = false
          }

          const product: Product = {
            pn: null,
            pid: data.getAttribute('data-id'), // It has sku but is not reliable
            price: pricerFormatter(data.getAttribute('data-price')!),
            brand: data.getAttribute('data-brand')!,
            name: data.getAttribute('data-name')!,
            hasStock, // ?
            shippingCost: null,
            ratting: null,
            ...this.meta,
            url: data.getAttribute('href')!
          }

          return this.products.push(product)
        }, [])

      return this.products
    }

    async scrapPagination (): Promise<IScrapperPagination> {
      if (this.dom === undefined) {
        throw new ScrapperError('DOM', this.meta)
      }

      const $ = this.dom
      const { document } = $.window

      const isEmpty = !document.querySelectorAll('.product-list tbody tr:nth-child(odd)').length
      if (isEmpty) {
        throw new ScrapperError('Products not found', this.meta)
      }

      const pagination = document.querySelector('.pagination .results')?.textContent

      if (pagination) {
        const matcher = /Mostrando \d+ al \d+ de (?<total>\d+) \((?<pages>\d+) Páginas\)/
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

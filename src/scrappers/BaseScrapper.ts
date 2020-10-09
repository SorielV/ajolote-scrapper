import { Logger } from 'winston'
import {
  Product,
  IProductStore,
  IScrapperPagination,
  IScrapper,
  IScrapperMeta,
  ScrapperError,
  IDOMLoader,
  BaseScrapperOptions
} from '../types'

export default abstract class BaseScrapper<T> implements IScrapper<T> {
    isLoaded: boolean = false;
    products: Product[] = [];
    error: ScrapperError | undefined;
    pagination: IScrapperPagination | undefined;

    meta: IScrapperMeta
    store: IProductStore;
    domLoader: IDOMLoader<T>;
    logger: Logger
    options: any;

    abstract dom: T | undefined;

    abstract scrapProducts(): Promise<Product[]>;
    abstract scrapPagination(): Promise<IScrapperPagination>;

    constructor (options: BaseScrapperOptions<T>) {
      this.meta = options.meta
      this.store = options.store
      this.domLoader = options.domLoader
      this.logger = options.logger
      this.options = options.options || {}
    }

    setPagination (pagination: Array<any>) {
      const { meta: { url } } = this

      if (pagination.length) {
        const activePage = pagination.find(({ active }) => active)
        const lastPage = pagination[pagination.length - 1]
        const pagesCount = lastPage.page

        this.pagination = {
          meta: this.meta,
          url,
          page: activePage.page,
          totalPages: pagesCount
        }
      }
    }

    async load (): Promise<void> {
      const dom = await this.domLoader.load(this.meta.url, this.options)
      this.dom = dom
      this.isLoaded = true
    }

    async scrap (): Promise<void> {
      if (!this.isLoaded) {
        await this.load()
      }

      await this.scrapPagination()
      await this.scrapProducts()
    }

    // Use Store
    async save (): Promise<void> {
      return this.store.save(this.products, this.meta)
    }
}

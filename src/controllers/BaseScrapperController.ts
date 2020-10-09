import { Logger } from 'winston'
import {
  IProductStore,
  IScrapperController,
  IScrapperPagination,
  IScrapperMeta,
  IDOMLoader,
  ScrapperError,
  ScrapCategoryResponse,
  Category,
  Product,
  IScrapper,
  ScrapperControllerOptions,
  BaseControllerOptions
} from '../types'
import { delay } from '../utils/time'
import { pool } from '../utils/promise'

export default abstract class BaseScrapperController<T> implements IScrapperController {
    protected readonly store: IProductStore;
    protected readonly domLoader: IDOMLoader<T>;
    protected readonly logger: Logger

    public readonly categories: Category[];
    public readonly pagination: Map<string, IScrapperPagination> = new Map();

    public options: ScrapperControllerOptions;

    public readonly abstract storeName: string;

    constructor (options: BaseControllerOptions<T>) {
      this.categories = options.categories
      this.store = options.store
      this.domLoader = options.domLoader
      this.logger = options.logger
      this.options = options.options || { maxParallelRequests: 1 }
    }

    abstract scrapperInstance (meta: IScrapperMeta, page?: number, options?: any): IScrapper<T>

    async scrapPagination (meta: IScrapperMeta): Promise<IScrapperPagination> {
      const scrapper = this.scrapperInstance(meta, 1)
      await scrapper.load()
      const pagination = await scrapper.scrapPagination()
      this.pagination.set(meta.category, pagination)
      return pagination
    }

    getScrappersFromPagination (meta: IScrapperMeta, pagination: IScrapperPagination): IScrapper<T>[] {
      return [...new Array(pagination.totalPages)]
        .map((_, page) => this.scrapperInstance(meta, page + 1))
    }

    async scrapCategory (category: Category): Promise<ScrapCategoryResponse> {
      const meta: IScrapperMeta = {
        url: category.url,
        category: category.name,
        store: this.storeName
      }

      const response: ScrapCategoryResponse = {
        errors: [],
        products: []
      }

      try {
        const pagination = await this.scrapPagination(meta)
        const scrappers = this.getScrappersFromPagination(meta, pagination)

        this.logger.debug(pagination)

        for (const scrapper of scrappers) {
          try {
            await scrapper.scrap()
            response.products.push(...scrapper.products)
          } catch (err) {
            response.errors.push(err)
          }

          if (this.options.delay) {
            await delay(this.options.delay)
          }
        }
      } catch (err) {
        response.errors.push(err)
        return response
      }

      return response
    }

    async scrap (): Promise<ScrapperError[]> {
      const errors: ScrapperError[] = []
      const products: Product[] = []

      const promises = this.categories.map(category => async () => {
        const meta = {
          url: category.url,
          category: category.name,
          store: this.storeName
        }
        this.logger.debug(meta)

        const response = await this.scrapCategory(category)
        errors.push(...response.errors)

        this.logger.info(meta)
        this.logger.info(`${response.products.length} products found`)
        this.logger.info(`${response.errors.length} errors`)

        if (this.options.saveAllCategories) {
          await this.save(response.products, meta)
          this.logger.debug(`${response.products.length} products saved`)
        } else {
          products.push(...response.products)
        }
      })

      await pool(promises, this.options.maxParallelRequests || 1)

      if (!this.options.saveAllCategories) {
        this.logger.info(`${products.length} products found`)
        await this.save(products)
        this.logger.info(`${products.length} products saved`)
      }

      return errors
    }

    async save (products: Product[], meta?: IScrapperMeta): Promise<void> {
      await this.store.save(products, meta)
    }
}

import { HttpsProxyAgent } from 'https-proxy-agent'
import { Logger } from 'winston'

export interface IProductRating {
    scale: number,
    value: number | string
}

export type Product = {
    pid: string | null,
    pn: string | null,
    name: string,
    url: string,
    price: number
    brand: string | null,
    hasStock: boolean | null,
    shippingCost: number | null,
    ratting: IProductRating | null,
    store: string,
    category: string,
    subCategory?: string
}

export interface IScrapperMeta {
    url: string;
    category: string;
    store: string;
}

export interface IProxy {
    user: string,
    password: string,
    host: string,
    port: number,
    getHttpsProxyAgentWithSession(session: string): HttpsProxyAgent,
    getHttpsProxyAgent(): HttpsProxyAgent,
    getCredentials(): string
    getCredentialsWithSession(session: string): string
}

export interface IProxyOptions {
    user: string,
    password: string,
    host: string,
    port: number
}

export interface IDOMLoader<T> {
  // proxy: IProxy | undefined,
  load (url: string, options?: object) : Promise<T>
  // loadWithProxy(url: string, options?: object, session?: string | number): Promise<T>
}

export interface IProductStore {
    save (products: Product[], meta?: IScrapperMeta) : Promise<void>
}

export interface IScrapperPagination {
    url: string,
    meta: IScrapperMeta,
    page: number,
    totalPages: number,
    totalRecords?: number | undefined
}

export interface IScrapper<T> {
    isLoaded: boolean,
    meta: IScrapperMeta,
    products: Product[],
    pagination: IScrapperPagination | undefined,
    domLoader: IDOMLoader<T> | undefined,
    dom: T | undefined,
    load (): Promise<void> // Load Page
    scrap(): Promise<void>, // Scrap products
    scrapProducts (): Promise<Product[]>, // Scrap products
    scrapPagination (): Promise<IScrapperPagination>, // Scrap Pagination
}

// TODO: Remove from Types
export class ScrapperError extends Error {
    meta: IScrapperMeta;

    constructor (message: string, meta: IScrapperMeta) {
      super(message)
      this.name = 'ScrapperError'
      this.stack = (<any> new Error()).stack
      this.meta = meta
    }
}

export interface IScrapperController {
    // load(): Promise<boolean>
    scrap(): Promise<ScrapperError[]>
    save(products: Product[]): Promise<void>
}

export type Category = {
    url: string
    name: string,
    subCategory?: string
}

export type ScrapCategoryResponse = {
    errors: ScrapperError[],
    products: Product[]
}

export type ScrapperControllerOptions = {
    delay?: number,
    saveAllCategories?: boolean,
    maxParallelRequests?: number
}

export type BaseControllerOptions<T> = {
  categories: Category[],
  store: IProductStore,
  domLoader: IDOMLoader<T>,
  logger: Logger
  options?: ScrapperControllerOptions
}

export type BaseScrapperOptions<T> = {
  meta: IScrapperMeta,
  store: IProductStore,
  domLoader: IDOMLoader<T>,
  logger: Logger,
  options?: any
}

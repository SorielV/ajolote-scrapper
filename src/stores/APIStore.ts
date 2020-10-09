import axios, { AxiosRequestConfig } from 'axios'
import { IProductStore, Product } from '../types'

export default class JSONProductStore implements IProductStore {
  enpoint: string;
  config: AxiosRequestConfig;

  constructor (enpoint: string, config: AxiosRequestConfig) {
    this.enpoint = enpoint
    this.config = config
  }

  async save (products: Product[]): Promise<void> {
    console.log({ productsCount: products.length })
    return axios.request({ url: this.enpoint, ...this.config, data: products })
  }
}

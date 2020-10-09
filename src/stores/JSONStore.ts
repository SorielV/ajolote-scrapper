import path from 'path'

import { IProductStore, IScrapperMeta, Product } from '../types'
import { saveFile } from '../utils/files'

export default class JSONProductStore implements IProductStore {
  dir: string

  constructor (dir: string) {
    this.dir = dir
  }

  async save (products: Product[], meta: IScrapperMeta): Promise<void> {
    const filePath = path.join(this.dir, `${meta?.category || 'data'}-${Date.now()}.json`)
    await saveFile(filePath, JSON.stringify(products))
  }
}

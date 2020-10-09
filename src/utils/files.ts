import { promises } from 'fs'

export const saveFile = (path: string, data: string): Promise<void> => promises.writeFile(path, data, 'utf-8')

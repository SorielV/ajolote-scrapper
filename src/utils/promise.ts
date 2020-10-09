import * as array from './array'

export const pool = async (promises: Function[], size: number): Promise<void> => {
  const chunks = array.chunk(promises, size)
  for (const chunk of chunks) {
    await Promise.all(chunk.map(fn => fn()))
  }
}

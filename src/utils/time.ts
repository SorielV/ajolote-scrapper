export const delay = (ms: number): Promise<any> =>
  new Promise(resolve => setTimeout(() => resolve(), ms))

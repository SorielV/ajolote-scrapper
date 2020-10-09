import * as filesUtils from '../../utils/files'
import { promises } from 'fs'

describe('saveFile', () => {
  promises.writeFile = jest.fn()

  it('Default Bahavior', async () => {
    const path = 'foo/'
    const data = '<foo></foo>'

    promises.writeFile = jest.fn()
      .mockReturnValueOnce(Promise.resolve())

    await expect(filesUtils.saveFile(path, data))
      .resolves.toBeFalsy()

    expect(promises.writeFile).toHaveBeenCalled()
    expect(promises.writeFile).toHaveBeenCalledWith(path, data, 'utf-8')
  })

  it('FS error', async () => {
    const path = 'foo/'
    const data = '<foo></foo>'

    promises.writeFile = jest.fn()
      .mockRejectedValueOnce({})

    await expect(filesUtils.saveFile(path, data))
      .rejects.toBeTruthy()

    expect(promises.writeFile).toHaveBeenCalled()
    expect(promises.writeFile).toHaveBeenCalledWith(path, data, 'utf-8')
  })
})

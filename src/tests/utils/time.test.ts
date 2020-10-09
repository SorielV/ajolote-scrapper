import * as timeUtils from '../../utils/time'

// jest.useFakeTimers()

describe('delay', () => {
  it('Default Bahavior', async () => {
    const ms = 1
    await expect(timeUtils.delay(ms)).resolves.toBeFalsy()
  })
})

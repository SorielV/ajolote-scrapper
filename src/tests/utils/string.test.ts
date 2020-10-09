import * as stringUtils from '../../utils/string'

describe('Sanitize string', () => {
  it('Default Behavior', () => {
    const str = '\n\nFoo    1'
    expect(stringUtils.sanitize(str)).toBe('Foo 1')
  })

  describe('Optional flags', () => {
    it('removeWhiteSpaces', () => {
      const str = 'Foo    \n1'
      expect(stringUtils.sanitize(str, { removeWhiteSpaces: true }))
        .toEqual('Foo \n1')
    })

    it('removeLineBreaks', () => {
      const str = '\n\nFoo    1'
      expect(stringUtils.sanitize(str, { removeLineBreaks: true }))
        .toBe('Foo    1')
    })
  })
})

import { coerceToArray } from '../src/utils'

describe('Normalize', () => {
  it('converts everything to an array', () => {
    expect(coerceToArray('test')).toEqual(['test'])
    expect(coerceToArray(['test'])).toEqual(['test'])
    expect(coerceToArray(['test', 'foo'])).toEqual(['test', 'foo'])
    expect(coerceToArray([])).toEqual([])
    expect(coerceToArray()).toEqual([])
  })
})

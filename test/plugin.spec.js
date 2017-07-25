'use strict'

const Plugin = require('../')

describe('Normalize', () => {
  it('converts everything to an array', () => {
    const test = new Plugin()

    expect(test.normalize('test')).toEqual(['test'])
    expect(test.normalize(['test'])).toEqual(['test'])
    expect(test.normalize(['test', 'foo'])).toEqual(['test', 'foo'])
    expect(test.normalize([])).toEqual([])
    expect(test.normalize()).toEqual([])
  })
})

describe('Defaults', () => {
  it('creates object with defaults', () => {
    let config = {
      read: { maximum: 100, usage: 1 },
      write: { minimum: 20 }
    }

    const test = new Plugin()
    const data = test.defaults(config)

    expect(data.read.minimum).toBe(5)
    expect(data.read.maximum).toBe(100)
    expect(data.read.usage).toBe(1)

    expect(data.write.minimum).toBe(20)
    expect(data.write.maximum).toBe(200)
    expect(data.write.usage).toBe(0.75)
  })
})

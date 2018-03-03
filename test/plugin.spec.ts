import * as Plugin from '../src/plugin'

describe('Defaults', () => {
  it('creates object with defaults', () => {
    const config = {
      read: { maximum: 100, usage: 1 },
      write: { minimum: 20 }
    }

    const test = new Plugin({ service: { provider: { stage: 'foo' } } })
    const data = test.defaults(config)

    expect(data.read.minimum).toBe(5)
    expect(data.read.maximum).toBe(100)
    expect(data.read.usage).toBe(1)

    expect(data.write.minimum).toBe(20)
    expect(data.write.maximum).toBe(200)
    expect(data.write.usage).toBe(0.75)
  })
})

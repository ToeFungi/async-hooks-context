import { AsyncHooksContexts } from '../../src'
import { Bar, Foo } from '../mocks/Foo'

describe('AsyncHooksContext', () => {
  const contextId = 'some-context-id'

  it('returns the correct context ID when the class is wrapped immediately', () => {
    const context = AsyncHooksContexts.initContext((context: any) => {
      context.id = contextId
      return new Foo()
        .bar()
    })

    context.should.have.property('id')
    context.id.should.deep.equal(contextId)
  })

  it('returns the correct context ID when the class is injected into another class', () => {
    const foo = new Foo()

    const context = AsyncHooksContexts.initContext((context: any) => {
      context.id = contextId
      return new Bar(foo)
        .bar()
    })

    context.should.have.property('id')
    context.id.should.deep.equal(contextId)
  })
})

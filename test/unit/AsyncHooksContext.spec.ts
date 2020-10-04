import { AsyncHooksContexts } from '../../src/AsyncHooksContext'
import { Bar, Foo } from '../mocks/Foo'

describe('AsyncHooksContext', () => {
  const contextId = 'some-context-id'

  it('returns the correct context ID when the class is wrapped immediately', () => {
    const foo = new Foo()

    const context = AsyncHooksContexts.initContext((context: any) => {
      context.id = contextId
      return foo.bar()
    })

    context.should.have.property('id')
    context.id.should.deep.equal(contextId)
  })

  it('returns the correct context ID when the class is injected into another class', () => {
    const foo = new Foo()
    const bar = new Bar(foo)

    const context = AsyncHooksContexts.initContext((context: any) => {
      context.id = contextId
      return bar.foobar()
    })

    context.should.have.property('id')
    context.id.should.deep.equal(contextId)
  })

  it('returns an empty object when the context cannot be found by execution ID', () => {
    const foo = new Foo()

    const context = foo.bar()
    context.should.deep.equal({})
  })
})

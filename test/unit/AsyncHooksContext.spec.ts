import * as uuid from 'uuid'

import { createSandbox } from 'sinon'

import { Bar, Foo } from '../mocks/Foo'
import { createRequestContext } from '../../src/AsyncHooksContext'

describe('AsyncHooksContext', () => {
  const sandbox = createSandbox()

  const contextId = 'some-context-id'

  it('returns the correct context ID when the class is wrapped immediately', () => {
    const foo = new Foo()

    createRequestContext({}, contextId)

    const { correlationId } = foo.bar()

    correlationId.should.deep.equal(contextId)
  })

  it('returns the correct context ID when the class is injected into another class', () => {
    const foo = new Foo()
    const bar = new Bar(foo)

    createRequestContext({}, contextId)
    const { correlationId } = bar.foobar()

    correlationId.should.deep.equal(contextId)
  })

  it('returns an empty object when the context cannot be found by execution ID', () => {
    const generatedUuid = 'xxxx-xxxx-xxxx-xxxx'

    const foo = new Foo()

    const v4Stub = sandbox.stub(uuid, 'v4')
    v4Stub.returns(generatedUuid)

    createRequestContext()
    const { correlationId } = foo.bar()
    correlationId.should.deep.equal(generatedUuid)
  })

  it('returns the data that was stored for the request context', () => {
    const data = {
      foo: 'bar'
    }
    const expectedResponse = {
      data,
      correlationId: contextId
    }

    const foo = new Foo()

    createRequestContext(data, contextId)

    const context = foo.bar()
    context.should.deep.equal(expectedResponse)
  })
})

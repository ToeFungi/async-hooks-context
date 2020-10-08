import { getCorrelationId, getRequestContext } from '../../src/AsyncHooksContext'

class Foo {
  public getContext() {
    return getRequestContext()
  }

  public getCorrelation() {
    return getCorrelationId()
  }
}

class Bar {
  constructor(private foo: Foo) {
  }

  public getContext() {
    return this.foo.getContext()
  }

  public getCorrelation() {
    return this.foo.getCorrelation()
  }
}

export { Foo, Bar }

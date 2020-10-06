import { getRequestContext } from '../../src/AsyncHooksContext'

class Foo {
  public bar() {
    return getRequestContext()
  }
}

class Bar {
  constructor(private foo: Foo) {
  }

  public foobar() {
    return this.foo.bar()
  }
}

export { Foo, Bar }

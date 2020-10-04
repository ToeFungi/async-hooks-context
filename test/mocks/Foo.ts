import { AsyncHooksContexts } from '../../src/AsyncHooksContext'

class Foo {
  public bar() {
    return AsyncHooksContexts.getContext()
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
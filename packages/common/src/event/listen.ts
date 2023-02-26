type MethodDecoratorFactoryFunction = (
  // the constructor method of the class in which the method is found,
  // or the prototype of the class for an instance member
  target: any,
  // the name of the method
  key: string | number,
  // the property descriptor
  descriptor: PropertyDescriptor
) => void;

export function Listen(
  eventName: string,
  // the element on which we will call add/remove event listener on, otherwise equal to 'this'
  selector?: string
): MethodDecoratorFactoryFunction {
  return function decorator(
    target: any,
    key: string | number,
    // this contains a property named 'value' that equals the actual method being decorated
    descriptor: PropertyDescriptor
  ) {
    // destructure the target and assign its connectedCallback and disconnectedCallback methods to
    // noop functions to prevent overriding the users declared definitions for these functions
    const { connectedCallback = () => {}, disconnectedCallback = () => {} } =
      target;
    // assigning the decorated method to a symbol ensures that is never changes as the symbol is
    // guaranteed to be unique. Can be accessed like so: this[symbolMethod]
    const symbolMethod = Symbol(key);
    // determine if the context is 'this' or an element returned by querySelector in the case of
    // the user passing in the 'selector' argument to the Listen() decorator
    function getContext(context) {
      const root = context.shadowRoot ? context.shadowRoot : context;
      return selector ? root.querySelector(selector) : context;
    }

    function addListener() {
      const handler = (this[symbolMethod] = (...args) => {
        // descriptor.value references the method decorated by Listen()
        descriptor.value.apply(this, args);
      });
      // determine where the listener should be attached then attach our handler defined above
      getContext(this).addEventListener(eventName, handler);
    }

    function removeListener() {
      getContext(this).removeEventListener(eventName, this[symbolMethod]);
    }

    // call the users connectedCallback declared in the same class decorated by Listen()
    // call our custom addListener function
    target.connectedCallback = function connectedCallbackWrapper() {
      connectedCallback.call(this);
      addListener.call(this);
    };

    // call the users disconnectedCallback declared in the same class decorated by Listen()
    // call our custom removeListener function
    target.disconnectedCallback = function disconnectedCallbackWrapper() {
      disconnectedCallback.call(this);
      removeListener.call(this);
    };
  };
}

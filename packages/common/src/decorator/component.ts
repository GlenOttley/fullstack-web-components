export interface ElementMeta {
  custom?: ElementDefinitionOptions;
  // used to register the component via a call to customElements.define()
  selector?: string;
  // the component styles
  style?: string;
  // the component markup
  template?: string;
}

// Component is a factory function, i.e. it returns a function that constructs an object
export function Component(meta: ElementMeta) {
  if (!meta) {
    console.error('Component must include ElementMeta to compile');
    return;
  }
  // target is the class definition of the class that is being decorated
  return (target: any) => {
    if (!meta.style) {
      meta.style = '';
    }
    if (!meta.template) {
      meta.template = '';
    }
    // store the meta on our target so that it may be accessed inside the constructor below
    target.prototype.elementMeta = meta;
    if (meta.selector && !meta.custom) {
      customElements.define(meta.selector, target);
    } else if (meta.selector && meta.custom) {
      customElements.define(meta.selector, target, meta.custom);
    }
    return target;
  };
}

// context is the instance of the class being created
// options is the configuration object passed to attachShadow
export function attachShadow(context: any, options?: ShadowRootInit) {
  const shadowRoot: ShadowRoot = context.attachShadow(
    options || { mode: 'open' }
  );

  const template = document.createElement('template');
  template.innerHTML = `<style>${context.elementMeta.style}</style>${context.elementMeta.template}`;

  shadowRoot.appendChild(template.content.cloneNode(true));
}

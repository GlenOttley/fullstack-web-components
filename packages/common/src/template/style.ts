function closestRoot(base: Element): any {
  // getRootNode returns the elements known root, either a ShadowRoot or document
  if (base.getRootNode() === document) {
    return document.head;
    // if this is truthy, then the root node must be ShadowRoot
  } else if (base.getRootNode()) {
    return base.getRootNode();
  } else {
    return document.head;
  }
}

export function attachStyle(context: any): void {
  const id = `${context.elementMeta.selector}`;
  const closest = closestRoot(context);
  if (closest.tagName === 'HEAD' && document.getElementById(`${id}-in-style`)) {
    return;
  }
  //  if closest has the getElementById method, it must be a shadowRoot
  if (closest.getElementById && document.getElementById(`${id}-in-style`)) {
    return;
  }
  const template = document.createElement('style');
  template.setAttribute('id', `${id}-in-style`);
  template.innerText = context.elementMeta.style;
  closest.appendChild(template);
}

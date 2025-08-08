
Object.defineProperty()
Object.keys(vnode.props).forEach(key => {
    if (key.startsWith('on')) {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, new Function(vnode.props[key]));
    } else {
        element.setAttribute(key, vnode.props[key]);
    }
});


patch(oldVnode, newVnode) {
    // Agar eski tugun yo'q bo'lsa, yangisini yaratamiz
    if (!oldVnode) {
      const newElement = this.renderToDOM(newVnode);
      if (typeof newVnode !== 'string') {
        newVnode.dom = newElement;
      }
      return newElement;
    }
}
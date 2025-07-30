class MyFramework {
  constructor(options) {
    this.el = document.querySelector(options.el);
    this.data = options.data;
    this.template = options.template;
    this.vdom = null; // Virtual DOM daraxtini saqlash uchun
    this.init();
  }

  init() {
    // Ma'lumotlarni reaktiv qilish
    this.makeReactive(this.data);
    // Dastlabki render
    this.render();
  }

  makeReactive(obj) {
    const self = this;
    Object.keys(obj).forEach(key => {
      let value = obj[key];
      Object.defineProperty(obj, key, {
        get() {
          return value;
        },
        set(newValue) {
          value = newValue;
          self.render(); // Ma'lumot o'zgarsa, qayta render qilish
        }
      });
    });
  }

  // Virtual DOM daraxtini yaratish
  createElement(tag, props = {}, children = []) {
    return { tag, props, children };
  }

  // Virtual DOM'ni haqiqiy DOM'ga aylantirish
  renderToDOM(vnode) {
    if (typeof vnode === 'string') {
      const textNode = document.createTextNode(vnode);
      return textNode;
    }

    const element = document.createElement(vnode.tag);
    Object.keys(vnode.props).forEach(key => {
      if (key.startsWith('on')) {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, new Function(vnode.props[key]));
      } else {
        element.setAttribute(key, vnode.props[key]);
      }
    });

    vnode.children.forEach(child => {
      const childElement = this.renderToDOM(child);
      element.appendChild(childElement);
      if (typeof child !== 'string') {
        child.dom = childElement; // dom xususiyatini faqat elementlar uchun o'rnatish
      }
    });

    vnode.dom = element; // dom xususiyatini o'rnatish
    return element;
  }

  // Eski va yangi Virtual DOM'ni solishtirish va yangilash
  patch(oldVnode, newVnode) {
    // Agar eski tugun yo'q bo'lsa, yangisini yaratamiz
    if (!oldVnode) {
      const newElement = this.renderToDOM(newVnode);
      if (typeof newVnode !== 'string') {
        newVnode.dom = newElement;
      }
      return newElement;
    }

    // Matn tugunlarini solishtirish
    if (typeof oldVnode === 'string' || typeof newVnode === 'string') {
      if (oldVnode !== newVnode) {
        return this.renderToDOM(newVnode);
      }
      return oldVnode.dom || document.createTextNode(oldVnode);
    }

    // Tugunlarning turi o'zgargan bo'lsa, yangisini yaratamiz
    if (oldVnode.tag !== newVnode.tag) {
      const newElement = this.renderToDOM(newVnode);
      newVnode.dom = newElement;
      return newElement;
    }

    // Elementni yangilash
    const element = oldVnode.dom || document.createElement(newVnode.tag);
    newVnode.dom = element;

    // Atributlarni yangilash
    const oldProps = oldVnode.props || {};
    const newProps = newVnode.props || {};
    Object.keys(newProps).forEach(key => {
      if (oldProps[key] !== newProps[key]) {
        if (key.startsWith('on')) {
          const eventName = key.slice(2).toLowerCase();
          element.removeEventListener(eventName, new Function(oldProps[key]));
          element.addEventListener(eventName, new Function(newProps[key]));
        } else {
          element.setAttribute(key, newProps[key]);
        }
      }
    });
    Object.keys(oldProps).forEach(key => {
      if (!(key in newProps)) {
        if (key.startsWith('on')) {
          const eventName = key.slice(2).toLowerCase();
          element.removeEventListener(eventName, new Function(oldProps[key]));
        } else {
          element.removeAttribute(key);
        }
      }
    });

    // Bolalarni yangilash
    const oldChildren = oldVnode.children || [];
    const newChildren = newVnode.children || [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];

      if (i < oldChildren.length && i < newChildren.length) {
        const childElement = this.patch(oldChild, newChild);
        if (childElement !== (oldChild?.dom || oldChild)) {
          if (element.childNodes[i]) {
            element.replaceChild(childElement, element.childNodes[i]);
          } else {
            element.appendChild(childElement);
          }
        }
      } else if (i < newChildren.length) {
        const childElement = this.renderToDOM(newChild);
        if (typeof newChild !== 'string') {
          newChild.dom = childElement;
        }
        element.appendChild(childElement);
      } else if (i < oldChildren.length && oldChild?.dom) {
        element.removeChild(oldChild.dom);
      }
    }

    return element;
  }

  render() {
    // Template'dan Virtual DOM daraxtini yaratish
    const newVnode = this.template(this.data, this.createElement.bind(this));
    // Eski va yangi Virtual DOM'ni solishtirib, DOM'ni yangilash
    this.el.innerHTML = ''; // Tozalash
    const dom = this.patch(this.vdom, newVnode);
    this.el.appendChild(dom);
    this.vdom = newVnode; // Yangi Virtual DOM'ni saqlash
  }
}

// Frameworkni ishga tushirish uchun funksiya
function createApp(options) {
  return new MyFramework(options);
}
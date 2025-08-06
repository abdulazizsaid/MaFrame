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

  // String template'ni parse qilish
  // parseTemplate(template, data) {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(`<template>${template}</template>`, 'text/html');
  //   const root = doc.querySelector('template').content.firstChild;

  //   const parseNode = (node) => {
  //     if (node.nodeType === Node.TEXT_NODE) {
  //       let text = node.textContent;
  //       // {{ variable }} ni almashtirish
  //       text = text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
  //         return data[key] || '';
  //       });
  //       return text;
  //     }

  //     if (node.nodeType === Node.ELEMENT_NODE) {
  //       const tag = node.tagName.toLowerCase();
  //       const props = {};
  //       const children = [];

  //       // Atributlarni o'qish
  //       Array.from(node.attributes).forEach(attr => {
  //         if (attr.name === 'v-model') {
  //           props.oninput = `app.data.${attr.value} = this.value`;
  //           props.value = data[attr.value] || '';
  //         } else {
  //           props[attr.name] = attr.value;
  //         }
  //       });

  //       // Bolalarni parse qilish
  //       Array.from(node.childNodes).forEach(child => {
  //         const parsedChild = parseNode(child);
  //         if (parsedChild) {
  //           children.push(parsedChild);
  //         }
  //       });

  //       return this.createElement(tag, props, children);
  //     }

  //     return null;
  //   };

  //   return parseNode(root);
  // }

  parseTemplate(template, data) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${template}</body>`, 'text/html');
    const root = doc.body.firstElementChild;

    const parseNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        text = text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
          return data[key] || '';
        });
        return text;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const props = {};
        const children = [];

        Array.from(node.attributes).forEach(attr => {
          if (attr.name === 'v-model') {
            props.oninput = `app.data.${attr.value} = this.value`;
            props.value = data[attr.value] || '';
          } else {
            props[attr.name] = attr.value;
          }
        });

        Array.from(node.childNodes).forEach(child => {
          const parsedChild = parseNode(child);
          if (parsedChild !== null) {
            children.push(parsedChild);
          }
        });

        return this.createElement(tag, props, children);
      }

      return null;
    };

    return parseNode(root);
  }

  // Virtual DOM'ni haqiqiy DOM'ga aylantirish
  renderToDOM(vnode) {
    console.log(vnode);

    if (typeof vnode === 'string') {
      console.log(vnode);
      return document.createTextNode(vnode);
    }
    console.log(vnode);


    const element = document.createElement(vnode.tag);
    Object.keys(vnode.props).forEach(key => {
      if (key.startsWith('on')) {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, new Function('event', vnode.props[key]));
      } else {
        element.setAttribute(key, vnode.props[key]);
      }
    });

    vnode.children.forEach(child => {
      const childElement = this.renderToDOM(child);
      element.appendChild(childElement);
      if (typeof child !== 'string') {
        child.dom = childElement;
      }
    });

    vnode.dom = element;
    return element;
  }

  // Eski va yangi Virtual DOM'ni solishtirish va yangilash
  patch(oldVnode, newVnode) {
    if (!oldVnode) {
      const newElement = this.renderToDOM(newVnode);
      if (typeof newVnode !== 'string') {
        newVnode.dom = newElement;
      }
      return newElement;
    }

    if (typeof oldVnode === 'string' || typeof newVnode === 'string') {
      if (oldVnode !== newVnode) {
        return this.renderToDOM(newVnode);
      }
      return oldVnode.dom || document.createTextNode(oldVnode);
    }

    if (oldVnode.tag !== newVnode.tag) {
      const newElement = this.renderToDOM(newVnode);
      newVnode.dom = newElement;
      return newElement;
    }

    const element = oldVnode.dom || document.createElement(newVnode.tag);
    newVnode.dom = element;

    const oldProps = oldVnode.props || {};
    const newProps = newVnode.props || {};
    Object.keys(newProps).forEach(key => {
      if (oldProps[key] !== newProps[key]) {
        if (key.startsWith('on')) {
          const eventName = key.slice(2).toLowerCase();
          element.removeEventListener(eventName, new Function('event', oldProps[key]));
          element.addEventListener(eventName, new Function('event', newProps[key]));
        } else {
          element.setAttribute(key, newProps[key]);
        }
      }
    });
    Object.keys(oldProps).forEach(key => {
      if (!(key in newProps)) {
        if (key.startsWith('on')) {
          const eventName = key.slice(2).toLowerCase();
          element.removeEventListener(eventName, new Function('event', oldProps[key]));
        } else {
          element.removeAttribute(key);
        }
      }
    });

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
    const templateString = this.template(this.data);
    const newVnode = this.parseTemplate(templateString, this.data);
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
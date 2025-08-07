
Object.defineProperty()
Object.keys(vnode.props).forEach(key => {
    if (key.startsWith('on')) {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, new Function(vnode.props[key]));
    } else {
        element.setAttribute(key, vnode.props[key]);
    }
});
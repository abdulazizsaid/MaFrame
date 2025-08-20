class MyFramework {
  constructor(options) {
    this.el = document.querySelector(options.el)
    this.data = options.data
    this.template = options.template
    this.vdom = null
  }

  init() {
    this.makeReactive(this.data)
    this.render()
  }
  

  makeReactive(obj) {
     const self = this

     Object.keys(obj).forEach(key => {
      let value = obj[key];
     })

  }




}



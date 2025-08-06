// const app = createApp({
//   el: '#app',
//   data: {
//     message: 'Salom, Dunyo!'
//   },
//   template: function(data) {
//     return `
//       <div>
//         <h1>${data.message}</h1>
//         <input type="text" oninput="app.data.message = this.value" />
//       </div>
//     `;
//   }
// });

// const app = createApp({
//   el: '#app',
//   data: {
//     message: 'Salom, Dunyo!'
//   },
//   template: function(data, h) {
//     return h('div', {}, [
//       h('h1', {}, [data.message]),
//       h('input', {
//         type: 'text',
//         oninput: `app.data.message = this.value`
//       }, []),
//       h('div', {}, [])
//     ]);
//   }
// });

// app.js
// const app = createApp({
//   el: '#app',
//   data: {
//     message: 'Salom, Dunyo!'
//   },
//   template: function(data, h) {
//     return h('div', {}, [
//       h('h1', {}, [data.message]),
//       h('input', {
//         type: 'text',
//         oninput: `app.data.message = this.value`
//       }, []),
//       h('p',{},['sdf'])
//     ]);
//   }
// });

const app = createApp({
  el: '#app',
  data: {
    message: 'Salom, Dunyo!'
  },
  template: function(data, h) {
    return h('div', {}, [
      h('h1', {}, [data.message]),
      h('input', {
        type: 'text',
        oninput: `app.data.message = this.value`
      }, []),
      h('p',{},['sdf'])
    ]);
  }
});
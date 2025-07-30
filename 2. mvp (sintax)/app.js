const app = createApp({
  el: '#app',
  data: {
    message: 'Salom, Dunyo!'
  },
  template: function(data) {
    return `
      <div>
        <h1>{{ message }}</h1>
        <input type="text" v-model="message">
      </div>
    `;
  }
});
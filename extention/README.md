# MyFramework VSCode Extension

Bu extension MyFramework uchun sintaksis highlight va intellisense qo‘shadi.
U `template` funksiyasidagi HTML va `{{ variable }}` ifodalarini aniqlaydi.

## Foydalanish:
- Oddiy `.js` yoki `.ts` fayl oching
- Ichida `template: function(data) { return \`<div>...</div>\`; }` bo‘lsa, VSCode HTML ranglarda highlight qiladi



code example
```js
const app = createApp({
  el: '#app',
  data: {
    message: 'Salom, Dunyo!'
  },
  template: function(data) {
    return 
      ```html 
      `
      <div>
        <h1>{{ message }}</h1>
        <input type="text" v-model="message">
        <div style="color:red;">
          <p>salom</p>
        </div>
      </div>
      `
      ```
    ;
  }
});

```

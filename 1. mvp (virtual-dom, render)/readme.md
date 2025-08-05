MyFramework
MyFramework — bu oddiy, engil va reaktiv frontend framework bo‘lib, React va Vue’dan ilhomlangan. Ushbu framework Virtual DOM va reaktiv ma'lumotlar tizimini qo‘llab-quvvatlaydi, bu esa dinamik veb-ilovalarni yaratishni osonlashtiradi. Frameworkning asosiy maqsadi — minimal funksionallik bilan ishlaydigan, keyinchalik kengaytirilishi mumkin bo‘lgan tizim yaratish.
O‘rnatish va ishga tushirish

Fayl tuzilmasi:

index.html: Asosiy HTML fayl, frameworkni sinash uchun ishlatiladi.
framework.js: Frameworkning asosiy logikasi (Virtual DOM, reaktivlik, rendering).
app.js: Foydalanuvchi tomonidan yoziladigan ilova logikasi (komponentlar, ma'lumotlar).


HTML faylini sozlash:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Framework</title>
</head>
<body>
  <div id="app"></div>
  <script src="framework.js"></script>
  <script src="app.js"></script>
</body>
</html>


app.js misoli:
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
      h('p', {}, ['sdf'])
    ]);
  }
});


Ishga tushirish:

Fayllarni bir papkaga joylashtiring.
index.htmlni brauzerda oching.
Natija: <h1>Salom, Dunyo!</h1> matni, input maydoni va <p>sdf</p> elementi ko‘rinadi. Input maydoniga yozilgan matn h1 elementida avtomatik yangilanadi.



Framework arxitekturasi
MyFramework quyidagi asosiy xususiyatlarni qo‘llab-quvvatlaydi:

Reaktiv ma'lumotlar: Ma'lumotlar o‘zgarganda UI avtomatik yangilanadi.
Virtual DOM: DOM manipulyatsiyalarini optimallashtirish uchun ishlatiladi.
Komponentga asoslangan yondashuv: UI’ni qayta ishlatiladigan qismlarga bo‘lish imkoniyati.

Asosiy sinf va metodlar
MyFramework sinfi
Frameworkning asosiy sinfi bo‘lib, ilovani boshqaradi.
constructor(options)

Tavsif: Frameworkni ishga tushiradi va boshlang‘ich sozlamalarni o‘rnatadi.
Kiruvchi o‘zgaruvchilar:
options.el (String): HTML’dagi asosiy elementning CSS selektori (masalan, '#app').
options.data (Object): Reaktiv ma'lumotlar ob’ekti (masalan, { message: 'Salom, Dunyo!' }).
options.template (Function): Virtual DOM daraxtini qaytaruvchi funksiya. data va createElement (yoki h) parametrlarini qabul qiladi.


Ichki xususiyatlar:
this.el: HTML’dagi asosiy DOM elementi.
this.data: Reaktiv ma'lumotlar ob’ekti.
this.template: Template funksiyasi.
this.vdom: Joriy Virtual DOM daraxti (boshida null).


Qaytarish: Hech narsa qaytarmaydi, init metodini chaqiradi.

init()

Tavsif: Frameworkni ishga tushirish uchun ishlatiladi. Ma'lumotlarni reaktiv qiladi va dastlabki rendering’ni amalga oshiradi.
Kiruvchi o‘zgaruvchilar: Yo‘q.
Qaytarish: Hech narsa qaytarmaydi.

makeReactive(obj)

Tavsif: Ma'lumotlar ob’ektini reaktiv qiladi, ya’ni har bir xususiyat o‘zgarganda render metodi chaqiriladi.
Kiruvchi o‘zgaruvchilar:
obj (Object): Reaktiv qilinadigan ma'lumotlar ob’ekti (masalan, { message: 'Salom' }).


Ichki logika:
Object.defineProperty yordamida har bir xususiyat uchun getter va setter yaratiladi.
Setter’da ma'lumot o‘zgarganda render chaqiriladi.


Qaytarish: Hech narsa qaytarmaydi.

createElement(tag, props = {}, children = [])

Tavsif: Virtual DOM tugunini yaratadi (React’dagi React.createElementga o‘xshaydi).
Kiruvchi o‘zgaruvchilar:
tag (String): HTML tegi (masalan, 'div', 'h1').
props (Object, ixtiyoriy): Element atributlari (masalan, { type: 'text', oninput: '...' }).
children (Array, ixtiyoriy): Bolalar tugunlari (matn yoki boshqa Virtual DOM tugunlari).


Qaytarish: Virtual DOM ob’ekti { tag, props, children } shaklida.

renderToDOM(vnode)

Tavsif: Virtual DOM tugunini haqiqiy DOM elementiga aylantiradi.
Kiruvchi o‘zgaruvchilar:
vnode (Object | String): Virtual DOM tuguni yoki matn tuguni.


Ichki logika:
Agar vnode matn (string) bo‘lsa, TextNode yaratiladi.
Aks holda, HTML elementi yaratiladi, props atributlari qo‘shiladi (hodisalar on bilan boshlansa, addEventListener bilan bog‘lanadi).
Bolalar rekursiv ravishda renderToDOM orqali qayta ishlanadi.
Har bir element uchun dom xususiyati o‘rnatiladi (matn tugunlari bundan mustasno).


Qaytarish: Haqiqiy DOM elementi (HTMLElement yoki TextNode).

patch(oldVnode, newVnode)

Tavsif: Eski va yangi Virtual DOM daraxtlarini solishtirib, faqat o‘zgargan qismlarni haqiqiy DOM’ga yangilaydi.
Kiruvchi o‘zgaruvchilar:
oldVnode (Object | String | null): Eski Virtual DOM tuguni yoki matn.
newVnode (Object | String): Yangi Virtual DOM tuguni yoki matn.


Ichki logika:
Agar oldVnode yo‘q bo‘lsa, yangi tugun to‘liq yaratiladi.
Matn tugunlari solishtiriladi; agar farqli bo‘lsa, yangi TextNode qaytariladi.
Agar teglar farqli bo‘lsa, yangi element to‘liq yaratiladi.
Atributlar yangilanadi: yangi atributlar qo‘shiladi, eski atributlar o‘chiriladi.
Bolalar rekursiv ravishda solishtiriladi va yangilanadi (replaceChild, appendChild, yoki removeChild orqali).


Qaytarish: Yangilangan DOM elementi.

render()

Tavsif: Ilovani qayta render qiladi, Virtual DOM daraxtini yangilaydi va DOM’ga qo‘llaydi.
Kiruvchi o‘zgaruvchilar: Yo‘q.
Ichki logika:
Template funksiyasini chaqirib, yangi Virtual DOM daraxtini yaratadi.
patch metodini ishlatib, eski va yangi daraxtlarni solishtiradi.
el elementining ichki qismini tozalaydi va yangi DOM’ni qo‘shadi.
vdomni yangi daraxt bilan yangilaydi.


Qaytarish: Hech narsa qaytarmaydi.

createApp(options)

Tavsif: Frameworkni ishga tushirish uchun asosiy funksiya.
Kiruvchi o‘zgaruvchilar:
options (Object): el, data, va template xususiyatlarini o‘z ichiga oladi.


Qaytarish: MyFramework sinfining yangi instansiyasi.

Foydalanish misoli
app.jsda ilova quyidagicha sozlanadi:

el: DOM’dagi asosiy elementni ko‘rsatadi.
data: Reaktiv ma'lumotlar ob’ekti.
template: Virtual DOM daraxtini qaytaruvchi funksiya, h (ya’ni createElement) va datani qabul qiladi.

Misol:
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
      h('p', {}, ['sdf'])
    ]);
  }
});

Kelajakdagi kengaytmalar

Template sintaksisi: Vue’ga o‘xshash HTML template’lar ({{ message }}, v-model).
Direktivalar: v-for, v-if, v-bind kabi direktivalarni qo‘shish.
Komponentlar: Alohida komponentlarni qo‘llab-quvvatlash.
Optimallashtirish: Virtual DOM diffing algoritmini yaxshilash.

Eslatmalar

Framework hozircha minimal xususiyatlarni qo‘llab-quvvatlaydi. Katta loyihalar uchun qo‘shimcha sinovlar va optimallashtirish talab qilinadi.
Browser konsolida xatolarni tekshirish uchun F12 → Console’dan foydalaning.
Fayllar bir papkada bo‘lishi va index.htmlda to‘g‘ri yo‘llar ko‘rsatilishi kerak.

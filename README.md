# 🦊 baileys-foxxy

[![npm version](https://img.shields.io/npm/v/baileys-foxxy.svg)](https://www.npmjs.com/package/baileys-foxxy)
[![license](https://img.shields.io/npm/l/baileys-foxxy.svg)](./LICENSE)

Message builder super lengkap buat [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) — bikin bot WhatsApp kamu makin interaktif dengan **button**, **button v2**, **table**, **carousel**, **poster**, **fake link preview**, **fake quoted status**, **album**, **contact**, **location**, **event**, polling, mention all, dan banyak lagi. Terinspirasi dari gaya *baileys mbuilder*, tinggal `require` dan pakai.

**Owner / Developer:** **Wanz**

📢 **Grup:** [chat.whatsapp.com/IWg41xYluxnEURl0I11KeI](https://chat.whatsapp.com/IWg41xYluxnEURl0I11KeI?s=cl&p=a&ilr=1) | **Channel:** [whatsapp.com/channel/0029Vb9Bfwo0LKZF5gGGvb45](https://whatsapp.com/channel/0029Vb9Bfwo0LKZF5gGGvb45)

---

## ✨ Fitur

| Fitur | Deskripsi |
|---|---|
| `sendButton` | Tombol simpel: quick reply + 1 tombol buka link |
| `sendButtonV2` | Tombol lengkap: reply, url, call, copy code, reminder, list/select — bisa digabung, ada header gambar/video |
| `sendTable` | "Tabel" native pakai list message (section + row) |
| `buildAsciiTable` / `sendAsciiTable` | Tabel teks monospace (`\`\`\`` code block), cocok buat rekap/laporan |
| `sendCarousel` | Kartu geser ke samping, tiap kartu punya gambar + tombol sendiri |
| `sendPoster` | Gambar besar + judul + caption + tombol aksi |
| `sendPosterSimple` | Poster ringan tanpa tombol |
| `sendFakeLinkPreview` | Bikin tampilan link (judul, deskripsi, foto, url) yang bisa diatur bebas |
| `sendFakeQuotedStatus` | Kirim pesan seolah membalas status WhatsApp orang |
| `sendFakeQuoted` | Kirim pesan seolah membalas pesan/orang manapun (custom nama & isi) |
| `sendPoll` | Polling native WhatsApp |
| `sendMentionAll` | Mention semua member grup dengan teks bebas |
| `withForwarded` | Tandai pesan sebagai "diteruskan" |
| `randomId` | Generator ID acak buat kebutuhan custom |
| `sendLocation` / `sendLiveLocation` | Kirim pin lokasi biasa atau live location |
| `sendContact` / `sendContactList` | Kirim satu atau banyak kontak (vCard) |
| `sendAlbum` | Kirim beberapa foto/video jadi satu galeri |
| `sendReaction` | Kasih emoji reaction ke pesan |
| `sendViewOnce` | Kirim foto/video sekali lihat |
| `sendEvent` | Kirim kartu undangan acara native WhatsApp |
| `sendFakeLocation` | Kartu lokasi dengan foto & teks (nama/alamat) custom |
| `sendFakeOrderCard` | Kartu bergaya "order via katalog" dengan foto, harga, catatan, tombol |
| `sendNativeTable` | Tabel native WhatsApp (header + rows), otomatis preview & "Lihat semua" |
| `sendCodeCard` / `sendFullCode` | Kartu preview kode + tombol expand "Lihat kode" |

---

## 📦 Instalasi

```bash
npm install @whiskeysockets/baileys
```

Lalu copy folder `baileys-foxxy/` ke dalam project bot kamu (atau publish sendiri ke npm registry pribadi), lalu:

```js
const foxxy = require('./baileys-foxxy')
```

---

## 🚀 Quick Start

```js
const makeWASocket = require('@whiskeysockets/baileys').default
const { useMultiFileAuthState } = require('@whiskeysockets/baileys')
const foxxy = require('./baileys-foxxy')

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({ auth: state, printQRInTerminal: true })
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    const jid = m.key.remoteJid

    await foxxy.sendButton(sock, jid, {
      text: 'Halo! Pilih menu di bawah:',
      buttons: [{ text: 'Menu 1', id: 'menu1' }]
    })
  })
}

start()
```

Contoh pemakaian semua fitur ada di [`example/example.js`](./example/example.js).

---

## 📘 Dokumentasi Fitur

### 1. `sendButton(sock, jid, opts)`

```js
await foxxy.sendButton(sock, jid, {
  text: 'Ini contoh button',
  footer: 'baileys-foxxy',
  buttons: [
    { text: 'Halo', id: 'halo' },
    { text: 'Menu', id: 'menu' }
  ],
  urlButton: { text: 'Buka Website', url: 'https://example.com' },
  image: 'https://picsum.photos/500' // opsional, header gambar
})
```

### 2. `sendButtonV2(sock, jid, opts)`

Mendukung banyak tipe tombol dalam satu pesan:

```js
await foxxy.sendButtonV2(sock, jid, {
  title: 'Foxxy Store',
  text: 'Pilih salah satu aksi:',
  image: 'https://picsum.photos/500',
  buttons: [
    { type: 'reply', text: 'Konfirmasi', id: 'confirm' },
    { type: 'url', text: 'Kunjungi Toko', url: 'https://example.com' },
    { type: 'call', text: 'Hubungi CS', phone: '628123456789' },
    { type: 'copy', text: 'Salin Promo', copy: 'FOXXY2026' },
    {
      type: 'list',
      text: 'Lihat Menu',
      sections: [
        { title: 'Makanan', rows: [{ title: 'Nasi Goreng', id: 'nasgor', description: 'Rp 20.000' }] }
      ]
    }
  ]
})
```

Tipe tombol yang didukung: `reply`, `url`, `call`, `copy`, `reminder`, `list`.

### 3. `sendTable(sock, jid, opts)` & `sendAsciiTable`

```js
// versi native list
await foxxy.sendTable(sock, jid, {
  text: 'Daftar harga produk:',
  buttonText: 'Lihat Harga',
  sections: [
    { title: 'Paket Bulanan', rows: [{ title: 'Paket A', description: 'Rp 50.000' }] }
  ]
})

// versi teks ASCII
await foxxy.sendAsciiTable(sock, jid,
  ['No', 'Nama', 'Harga'],
  [['1', 'Paket A', 'Rp 50.000'], ['2', 'Paket B', 'Rp 100.000']],
  'Rekap harga:'
)
```

### 4. `sendCarousel(sock, jid, opts)`

```js
await foxxy.sendCarousel(sock, jid, {
  text: 'Koleksi produk terbaru:',
  cards: [
    {
      image: 'https://picsum.photos/id/1/500',
      title: 'Produk A',
      body: 'Deskripsi produk A',
      buttons: [{ type: 'url', text: 'Beli', url: 'https://example.com/a' }]
    },
    {
      image: 'https://picsum.photos/id/2/500',
      title: 'Produk B',
      body: 'Deskripsi produk B',
      buttons: [{ type: 'url', text: 'Beli', url: 'https://example.com/b' }]
    }
  ]
})
```

### 5. `sendPoster(sock, jid, opts)`

```js
await foxxy.sendPoster(sock, jid, {
  image: 'https://picsum.photos/700',
  title: 'Promo Spesial!',
  caption: 'Diskon 50% hari ini saja.',
  buttons: [{ type: 'url', text: 'Belanja Sekarang', url: 'https://example.com' }]
})
```

### 6. `sendFakeLinkPreview(sock, jid, opts)`

Bikin "tampilan url" custom — foto, judul, dan deskripsi bisa diatur bebas, terpisah dari isi teks pesan.

```js
await foxxy.sendFakeLinkPreview(sock, jid, {
  text: 'Cek info produk baru kami!',
  title: 'Foxxy Store - Produk Baru',
  body: 'Klik untuk lihat detail produk',
  url: 'https://example.com/produk-baru',
  thumbnail: 'https://picsum.photos/300',
  renderLargerThumbnail: true
})
```

> ⚠️ **Catatan etika:** karena judul/foto/link preview ini bisa berbeda dari isi pesan asli, jangan dipakai untuk menyamarkan tautan berbahaya atau menipu orang lain (phishing). Gunakan untuk kebutuhan wajar seperti kartu info produk, preview promosi, atau tampilan hasil pencarian bot.

### 7. `sendFakeQuotedStatus` & `sendFakeQuoted`

```js
// seolah membalas status WhatsApp
await foxxy.sendFakeQuotedStatus(sock, jid, {
  text: 'Nih aku bales status kamu ya~',
  statusText: 'Lagi healing dulu 😌',
  participant: jid
})

// seolah membalas pesan/orang manapun
await foxxy.sendFakeQuoted(sock, jid, {
  text: 'Setuju banget!',
  quotedText: 'Menurutku ide ini bagus',
  fakeName: 'Admin'
})
```

### 8. Bonus: `sendPoll`, `sendMentionAll`, `withForwarded`

```js
await foxxy.sendPoll(sock, jid, 'Menu favorit?', ['Nasi Goreng', 'Mie Ayam', 'Bakso'])

await foxxy.sendMentionAll(sock, groupJid, 'Woy pada kumpul semua! 📢')
```

### 9. `sendLocation` & `sendLiveLocation`

```js
await foxxy.sendLocation(sock, jid, {
  latitude: -6.200000,
  longitude: 106.816666,
  name: 'Monas',
  address: 'Jakarta Pusat'
})
```

### 10. `sendContact` & `sendContactList`

```js
await foxxy.sendContact(sock, jid, { name: 'Wanz', phone: '628123456789' })

await foxxy.sendContactList(sock, jid, [
  { name: 'CS 1', phone: '628111111111' },
  { name: 'CS 2', phone: '628222222222' }
], 'Kontak Customer Service')
```

### 11. `sendAlbum`

```js
await foxxy.sendAlbum(sock, jid, [
  { type: 'image', url: 'https://picsum.photos/id/10/500', caption: 'Foto 1' },
  { type: 'image', url: 'https://picsum.photos/id/11/500', caption: 'Foto 2' },
  { type: 'video', url: 'https://example.com/video.mp4' }
])
```

### 12. `sendReaction` & `sendViewOnce`

```js
// react ke pesan yang masuk
await foxxy.sendReaction(sock, jid, m.key, '🔥')

// kirim media sekali lihat
await foxxy.sendViewOnce(sock, jid, { type: 'image', media: 'https://picsum.photos/400', caption: 'Rahasia!' })
```

### 13. `sendEvent`

```js
await foxxy.sendEvent(sock, jid, {
  name: 'Meetup Developer Foxxy',
  description: 'Ngumpul bareng bahas bot WhatsApp',
  startTime: new Date('2026-08-15T19:00:00'),
  location: 'Jakarta'
})
```

### 14. `sendFakeLocation`

Kartu lokasi dengan foto dan teks bebas diatur (bukan koordinat GPS asli, cuma buat tampilan).

```js
await foxxy.sendFakeLocation(sock, jid, {
  image: 'https://picsum.photos/500',
  name: 'Haileii',
  address: 'Online · 14.31 WIB'
})
```

### 15. `sendFakeOrderCard`

Kartu bergaya "order via katalog" — foto item, jumlah, harga, catatan, dan tombol aksi.

```js
await foxxy.sendFakeOrderCard(sock, jid, {
  image: 'https://picsum.photos/300',
  itemCount: '1 item',
  price: 'Rp 20.000 (estimasi total)',
  note: '💎 Premium Only! Ketik .benefitpremium untuk info upgrade.',
  actionButton: { text: 'Lihat Permintaan Order', id: 'lihat_order' }
})
```

> ⚠️ Ini kartu tampilan custom buat kebutuhan menu bot, bukan order sungguhan dari sistem WhatsApp Business. Jangan dipakai untuk pura-pura ada transaksi/pesanan yang sebenarnya nggak ada, ke pembeli asli.

### 16. `sendNativeTable`

Tabel native WhatsApp — header kolom + baris, client otomatis nampilin sebagai kartu preview dengan tombol "Lihat semua" kalau barisnya banyak (mirip tabel harga/statistik bawaan WA).

```js
await foxxy.sendNativeTable(sock, jid, {
  title: 'Tabel',
  text: 'Total fitur tersedia:',
  header: ['Kategori', 'Jumlah', 'Persen'],
  rows: [
    ['👑 OWNER', 171, '13.9%'],
    ['💻 PANEL', 159, '12.9%'],
    ['👥 GROUP', 121, '9.8%']
  ]
})
```

> ⚠️ Tipe pesan ini (`TableMessage`) tergolong baru di WhatsApp. Kalau kena error pas dipanggil, update dulu `@whiskeysockets/baileys` ke versi terbaru. Kalau masih error karena nama field beda, buka `lib/nativeTable.js` dan sesuaikan sesuai proto versi kamu — sementara itu pakai `sendTable()` (versi list) atau `sendAsciiTable()` sebagai gantinya.

### 17. `sendCodeCard` & `sendFullCode`

Kartu preview kode (judul bahasa + cuplikan baris) dengan tombol "Lihat kode". **Bukan** replika native UI Meta AI (itu eksklusif untuk bot resmi Meta) — ini kartu + tombol biasa yang kamu tangani sendiri di command handler.

```js
// kirim kartu preview
const codeId = await foxxy.sendCodeCard(sock, jid, {
  code: fullSourceCode,
  language: 'Js',
  previewLines: 5,
  buttonId: 'lihatkode_fakestatus'
})

// di command handler kamu, waktu tombol 'lihatkode_fakestatus' ditekan:
sock.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0]
  const buttonId = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (buttonId && JSON.parse(buttonId.paramsJson).id === 'lihatkode_fakestatus') {
    await foxxy.sendFullCode(sock, m.key.remoteJid, fullSourceCode, 'js')
  }
})
```

---

## 🗂️ Struktur Project

```
baileys-foxxy/
├── index.js              # entry point, export semua fungsi
├── package.json
├── lib/
│   ├── utils.js           # helper relay & wrapper interactive message
│   ├── button.js          # button versi 1
│   ├── buttonV2.js         # button versi 2 (multi tipe)
│   ├── table.js             # table native + ascii
│   ├── carousel.js           # carousel multi kartu
│   ├── poster.js              # poster
│   ├── fakeLinkPreview.js      # fake link preview
│   ├── fakeQuoted.js            # fake quoted status/pesan
│   └── extras.js                 # poll, mention all, dll
└── example/
    └── example.js               # contoh pemakaian lengkap
```

---

## 🔧 Kompatibilitas: Semua Fork & Versi Baileys

`baileys-foxxy` **nggak hardcode ke satu nama paket Baileys tertentu**. Dia otomatis nyoba beberapa nama paket yang umum dipakai (mainline maupun fork populer) dan pakai yang pertama ketemu di `node_modules` kamu:

- `@whiskeysockets/baileys` (mainline)
- `baileys` (nama unscoped terbaru)
- `@adiwajshing/baileys` (legacy)
- Beberapa fork populer lainnya

### Kalau fork kamu nggak ada di daftar otomatis

Panggil `configure()` sekali di awal project kamu, sebelum manggil fungsi `foxxy` lainnya:

```js
const foxxy = require('baileys-foxxy')
foxxy.configure(require('nama-paket-baileys-kamu'))
```

### Catatan soal breaking changes v7

`@whiskeysockets/baileys` v7 punya beberapa breaking changes dari v6:
- Method `proto.Message.X.create()` yang dipakai semua builder di sini **masih ada** di v7
- v7 ngenalin sistem **LID (Local Identifier)**. Kalau `sendFakeQuoted`, `sendMentionAll`, atau fungsi lain yang pakai `participant`/`jid` custom kelihatan aneh ke kontak tertentu, kemungkinan itu efek migrasi LID — cek [panduan migrasi resmi](https://baileys.wiki/docs/migration/to-v7.0.0/)

---

## 👤 Author

**Wanz** — Owner & Developer `baileys-foxxy`

- 📢 Grup: https://chat.whatsapp.com/IWg41xYluxnEURl0I11KeI?s=cl&p=a&ilr=1
- 📣 Channel: https://whatsapp.com/channel/0029Vb9Bfwo0LKZF5gGGvb45

## ⚠️ Disclaimer

- Library ini memakai fitur `InteractiveMessage`/`NativeFlowMessage` dari WhatsApp yang statusnya bisa berubah sewaktu-waktu mengikuti update aplikasi WhatsApp resmi — kalau ada tombol yang nggak muncul, cek versi `@whiskeysockets/baileys` kamu dan update ke versi terbaru.
- Gunakan fitur *fake link preview* dan *fake quoted* secara bertanggung jawab: untuk mempercantik tampilan bot, bukan untuk menipu atau menyamarkan tautan berbahaya ke pengguna lain.
- Ini bukan library resmi dari WhiskeySockets, melainkan kumpulan helper di atas Baileys.

---

Selamat ngoding, semoga bot kamu makin kece! 🦊

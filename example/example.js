const makeWASocket = require('@whiskeysockets/baileys').default
const { useMultiFileAuthState } = require('@whiskeysockets/baileys')
const foxxy = require('../index')

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({ auth: state, printQRInTerminal: true })
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    const jid = m.key.remoteJid
    const text = m.message.conversation || m.message.extendedTextMessage?.text || ''

    if (text === '.button') {
      await foxxy.sendButton(sock, jid, {
        text: 'Ini contoh button versi 1',
        footer: 'baileys-foxxy',
        buttons: [
          { text: 'Halo', id: 'halo' },
          { text: 'Menu', id: 'menu' }
        ],
        urlButton: { text: 'Buka Website', url: 'https://example.com' }
      })
    }

    if (text === '.buttonv2') {
      await foxxy.sendButtonV2(sock, jid, {
        title: 'Foxxy Store',
        text: 'Pilih salah satu aksi di bawah ini ya!',
        footer: 'baileys-foxxy | button v2',
        image: 'https://picsum.photos/500',
        buttons: [
          { type: 'reply', text: 'Konfirmasi', id: 'confirm' },
          { type: 'url', text: 'Kunjungi Toko', url: 'https://example.com' },
          { type: 'call', text: 'Hubungi CS', phone: '628123456789' },
          { type: 'copy', text: 'Salin Kode Promo', copy: 'FOXXY2026' },
          {
            type: 'list',
            text: 'Lihat Menu',
            sections: [
              { title: 'Makanan', rows: [{ title: 'Nasi Goreng', id: 'nasgor', description: 'Rp 20.000' }] },
              { title: 'Minuman', rows: [{ title: 'Es Teh', id: 'esteh', description: 'Rp 5.000' }] }
            ]
          }
        ]
      })
    }

    if (text === '.table') {
      await foxxy.sendTable(sock, jid, {
        text: 'Berikut daftar harga produk kami:',
        buttonText: 'Lihat Daftar Harga',
        sections: [
          {
            title: 'Paket Bulanan',
            rows: [
              { title: 'Paket A', description: 'Rp 50.000/bulan' },
              { title: 'Paket B', description: 'Rp 100.000/bulan' }
            ]
          }
        ]
      })

      // versi ASCII teks biasa
      await foxxy.sendAsciiTable(sock, jid,
        ['No', 'Nama', 'Harga'],
        [
          ['1', 'Paket A', 'Rp 50.000'],
          ['2', 'Paket B', 'Rp 100.000']
        ],
        'Tabel harga versi teks:'
      )
    }

    if (text === '.carousel') {
      await foxxy.sendCarousel(sock, jid, {
        text: 'Cek koleksi produk terbaru kami:',
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
    }

    if (text === '.poster') {
      await foxxy.sendPoster(sock, jid, {
        image: 'https://picsum.photos/700',
        title: 'Promo Spesial!',
        caption: 'Diskon 50% untuk semua produk hari ini saja.',
        buttons: [{ type: 'url', text: 'Belanja Sekarang', url: 'https://example.com' }]
      })
    }

    if (text === '.fakelink') {
      await foxxy.sendFakeLinkPreview(sock, jid, {
        text: 'Cek info produk baru kami!',
        title: 'Foxxy Store - Produk Baru',
        body: 'Klik untuk lihat detail produk',
        url: 'https://example.com/produk-baru',
        thumbnail: 'https://picsum.photos/300',
        renderLargerThumbnail: true
      })
    }

    if (text === '.fakequoted') {
      await foxxy.sendFakeQuotedStatus(sock, jid, {
        text: 'Nih aku bales status kamu ya~',
        statusText: 'Lagi healing dulu 😌',
        participant: jid
      })
    }

    if (text === '.poll') {
      await foxxy.sendPoll(sock, jid, 'Menu favorit kamu apa?', ['Nasi Goreng', 'Mie Ayam', 'Bakso'])
    }
  })
}

start()

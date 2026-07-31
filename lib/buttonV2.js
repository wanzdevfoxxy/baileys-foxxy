'use strict'

const { proto, relay, wrapInteractive, genId, getPrepareWAMessageMedia } = require('./utils')

/**
 * Kirim pesan tombol versi 2 — mendukung banyak tipe tombol sekaligus:
 * quick_reply, cta_url, cta_call, cta_copy, cta_reminder, single_select (list).
 *
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {object} opts
 * @param {string} opts.title - judul header (teks, dipakai kalau tidak ada media)
 * @param {string} opts.text - isi body
 * @param {string} [opts.footer]
 * @param {Buffer|string} [opts.image] - gambar header
 * @param {Buffer|string} [opts.video] - video header (pilih salah satu image/video)
 * @param {Array} opts.buttons - array campuran tombol, contoh di bawah
 *
 * Contoh format opts.buttons:
 * [
 *   { type: 'reply',  text: 'Ya',        id: 'yes' },
 *   { type: 'url',    text: 'Kunjungi',  url: 'https://example.com' },
 *   { type: 'call',   text: 'Telepon',   phone: '628123456789' },
 *   { type: 'copy',   text: 'Salin Kode', copy: 'PROMO2026' },
 *   { type: 'list',   text: 'Pilih Menu', title: 'Menu', sections: [
 *        { title: 'Kategori A', rows: [{ title:'Item 1', id:'item1', description:'desk' }] }
 *      ]
 *   }
 * ]
 */
async function sendButtonV2(sock, jid, opts = {}) {
  const {
    title = '',
    text = '',
    footer = 'baileys-foxxy | button v2',
    image,
    video,
    buttons = []
  } = opts

  const nativeButtons = buttons.map(mapButton)
  const prepareWAMessageMedia = getPrepareWAMessageMedia()

  let header = { title, hasMediaAttachment: false }
  if (image) {
    const media = await prepareWAMessageMedia({ image: typeof image === 'string' ? { url: image } : image }, { upload: sock.waUploadToServer })
    header = { hasMediaAttachment: true, imageMessage: media.imageMessage }
  } else if (video) {
    const media = await prepareWAMessageMedia({ video: typeof video === 'string' ? { url: video } : video }, { upload: sock.waUploadToServer })
    header = { hasMediaAttachment: true, videoMessage: media.videoMessage }
  }

  const interactiveMessage = proto.Message.InteractiveMessage.create({
    body: proto.Message.InteractiveMessage.Body.create({ text }),
    footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
    header: proto.Message.InteractiveMessage.Header.create(header),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: nativeButtons
    })
  })

  const content = wrapInteractive({ interactiveMessage })
  return relay(sock, jid, content)
}

function mapButton(b) {
  switch (b.type) {
    case 'url':
      return {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: b.text,
          url: b.url,
          merchant_url: b.url
        })
      }
    case 'call':
      return {
        name: 'cta_call',
        buttonParamsJson: JSON.stringify({
          display_text: b.text,
          id: `call ${b.phone}`
        })
      }
    case 'copy':
      return {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: b.text,
          id: b.id || genId('copy'),
          copy_code: b.copy
        })
      }
    case 'reminder':
      return {
        name: 'cta_reminder',
        buttonParamsJson: JSON.stringify({
          display_text: b.text,
          id: b.id || genId('reminder')
        })
      }
    case 'list':
      return {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: b.text,
          sections: (b.sections || []).map(sec => ({
            title: sec.title,
            highlight_label: sec.highlight || '',
            rows: (sec.rows || []).map(r => ({
              header: r.header || '',
              title: r.title,
              description: r.description || '',
              id: r.id || genId('row')
            }))
          }))
        })
      }
    case 'reply':
    default:
      return {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: b.text,
          id: b.id || genId('btn')
        })
      }
  }
}

module.exports = { sendButtonV2 }

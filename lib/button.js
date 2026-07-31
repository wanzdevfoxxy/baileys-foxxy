'use strict'

const { proto, relay, wrapInteractive, genId, getPrepareWAMessageMedia } = require('./utils')

/**
 * Kirim pesan tombol versi 1 (simpel: quick_reply & cta_url).
 *
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {object} opts
 * @param {string} opts.text - isi body pesan
 * @param {string} [opts.footer] - teks footer kecil
 * @param {{text:string, id?:string}[]} [opts.buttons] - tombol quick reply (max disaranin 3)
 * @param {{text:string, url:string}} [opts.urlButton] - satu tombol buka link (opsional)
 * @param {Buffer|string} [opts.image] - gambar header (buffer atau url)
 */
async function sendButton(sock, jid, opts = {}) {
  const {
    text = '',
    footer = 'baileys-foxxy',
    buttons = [],
    urlButton,
    image
  } = opts

  const nativeButtons = buttons.map(b => ({
    name: 'quick_reply',
    buttonParamsJson: JSON.stringify({
      display_text: b.text,
      id: b.id || genId('btn')
    })
  }))

  if (urlButton) {
    nativeButtons.push({
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: urlButton.text,
        url: urlButton.url,
        merchant_url: urlButton.url
      })
    })
  }

  let headerMedia = {}
  if (image) {
    headerMedia = {
      hasMediaAttachment: true,
      imageMessage: (await sock.waUploadToServer
        ? await buildImageHeader(sock, image)
        : undefined)
    }
  }

  const interactiveMessage = proto.Message.InteractiveMessage.create({
    body: proto.Message.InteractiveMessage.Body.create({ text }),
    footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
    header: proto.Message.InteractiveMessage.Header.create({
      hasMediaAttachment: !!image,
      ...headerMedia
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: nativeButtons
    })
  })

  const content = wrapInteractive({ interactiveMessage })
  return relay(sock, jid, content)
}

/** Helper internal: upload gambar buat dijadiin header button */
async function buildImageHeader(sock, image) {
  const prepareWAMessageMedia = getPrepareWAMessageMedia()
  const media = await prepareWAMessageMedia(
    { image: typeof image === 'string' ? { url: image } : image },
    { upload: sock.waUploadToServer }
  )
  return media.imageMessage
}

module.exports = { sendButton }

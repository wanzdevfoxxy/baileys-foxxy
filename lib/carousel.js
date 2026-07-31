'use strict'

const { proto, relay, wrapInteractive, genId, getPrepareWAMessageMedia } = require('./utils')

/**
 * Kirim carousel (kartu geser ke samping), tiap kartu punya gambar,
 * judul, body, footer, dan tombolnya sendiri.
 *
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {object} opts
 * @param {string} opts.text - body pesan utama (di atas carousel)
 * @param {string} [opts.footer]
 * @param {Array} opts.cards - daftar kartu
 *
 * Contoh 1 card:
 * {
 *   image: 'https://...jpg' | Buffer,
 *   title: 'Judul Kartu',
 *   body: 'Deskripsi kartu',
 *   footer: 'Footer kecil',
 *   buttons: [
 *     { type: 'reply', text: 'Pilih', id: 'card1' },
 *     { type: 'url', text: 'Beli', url: 'https://example.com' }
 *   ]
 * }
 */
async function sendCarousel(sock, jid, opts = {}) {
  const { text = '', footer = 'baileys-foxxy | carousel', cards = [] } = opts
  const prepareWAMessageMedia = getPrepareWAMessageMedia()

  const cardMessages = await Promise.all(cards.map(async card => {
    const media = await prepareWAMessageMedia(
      { image: typeof card.image === 'string' ? { url: card.image } : card.image },
      { upload: sock.waUploadToServer }
    )

    return proto.Message.InteractiveMessage.CarouselMessage.Card.create({
      header: proto.Message.InteractiveMessage.Header.create({
        title: card.title || '',
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      }),
      body: proto.Message.InteractiveMessage.Body.create({ text: card.body || '' }),
      footer: proto.Message.InteractiveMessage.Footer.create({ text: card.footer || '' }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
        buttons: (card.buttons || []).map(mapCardButton)
      })
    })
  }))

  const interactiveMessage = proto.Message.InteractiveMessage.create({
    body: proto.Message.InteractiveMessage.Body.create({ text }),
    footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
    carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({
      cards: cardMessages
    })
  })

  const content = wrapInteractive({ interactiveMessage })
  return relay(sock, jid, content)
}

function mapCardButton(b) {
  if (b.type === 'url') {
    return {
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({ display_text: b.text, url: b.url, merchant_url: b.url })
    }
  }
  if (b.type === 'call') {
    return {
      name: 'cta_call',
      buttonParamsJson: JSON.stringify({ display_text: b.text, id: `call ${b.phone}` })
    }
  }
  return {
    name: 'quick_reply',
    buttonParamsJson: JSON.stringify({ display_text: b.text, id: b.id || genId('card') })
  }
}

module.exports = { sendCarousel }

'use strict'

const { resolveBaileys } = require('./resolver')

/**
 * Kirim album (beberapa foto/video digabung jadi satu galeri, mirip
 * kirim banyak foto sekaligus di WhatsApp).
 *
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {Array<{type:'image'|'video', url:string|Buffer, caption?:string}>} medias
 */
async function sendAlbum(sock, jid, medias = []) {
  const { generateWAMessageFromContent, prepareWAMessageMedia } = resolveBaileys()

  const albumMessage = await generateWAMessageFromContent(jid, {
    albumMessage: {
      expectedImageCount: medias.filter(m => m.type === 'image').length,
      expectedVideoCount: medias.filter(m => m.type === 'video').length
    }
  }, { userJid: sock.user.id })

  await sock.relayMessage(jid, albumMessage.message, { messageId: albumMessage.key.id })

  for (const media of medias) {
    const prepared = await prepareWAMessageMedia(
      media.type === 'image'
        ? { image: typeof media.url === 'string' ? { url: media.url } : media.url }
        : { video: typeof media.url === 'string' ? { url: media.url } : media.url },
      { upload: sock.waUploadToServer }
    )

    const itemMessage = generateWAMessageFromContent(jid, {
      [media.type === 'image' ? 'imageMessage' : 'videoMessage']: {
        ...(media.type === 'image' ? prepared.imageMessage : prepared.videoMessage),
        caption: media.caption || '',
        contextInfo: { messageAssociation: { associationType: 1, parentMessageKey: albumMessage.key } }
      }
    }, { userJid: sock.user.id })

    await sock.relayMessage(jid, itemMessage.message, { messageId: itemMessage.key.id })
  }

  return albumMessage
}

module.exports = { sendAlbum }

'use strict'

const { proto, relay, wrapInteractive, genId } = require('./utils')

/**
 * Kirim kartu preview kode — judul bahasa, cuplikan beberapa baris,
 * dan tombol "Lihat kode" buat expand ke kode lengkap.
 * Bukan native renderer Meta AI (itu eksklusif buat bot resmi Meta),
 * ini versi kartu + tombol yang bisa kamu tangani sendiri di command handler.
 *
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {object} opts
 * @param {string} opts.code - isi kode lengkap
 * @param {string} [opts.language] - label bahasa, contoh: 'Js', 'Python'
 * @param {number} [opts.previewLines] - jumlah baris yang ditampilkan di preview
 * @param {string} [opts.buttonText] - teks tombol expand
 * @param {string} [opts.buttonId] - id custom buat ditangkap di command handler kamu
 * @param {string} [opts.footer]
 */
async function sendCodeCard(sock, jid, opts = {}) {
  const {
    code = '',
    language = 'Kode',
    previewLines = 4,
    buttonText = 'Lihat kode',
    buttonId,
    footer = 'baileys-foxxy | code'
  } = opts

  const lines = code.split('\n')
  const preview = lines.slice(0, previewLines).join('\n')
  const truncated = lines.length > previewLines ? preview + '\n...' : preview

  const id = buttonId || genId('code')

  const interactiveMessage = proto.Message.InteractiveMessage.create({
    header: proto.Message.InteractiveMessage.Header.create({
      title: `${language} kode`,
      hasMediaAttachment: false
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: '```' + truncated + '```'
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [{
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({ display_text: buttonText, id })
      }]
    })
  })

  const content = wrapInteractive({ interactiveMessage })
  await relay(sock, jid, content)

  return id // simpan id ini kalau mau cocokin manual sama fullCode di handler kamu
}

/**
 * Kirim kode lengkap sebagai balasan (dipanggil di command handler kamu
 * waktu tombol "Lihat kode" dari sendCodeCard ditekan).
 *
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {string} code
 * @param {string} [language]
 */
async function sendFullCode(sock, jid, code = '', language = '') {
  const tag = language ? language.toLowerCase() : ''
  return sock.sendMessage(jid, { text: '```' + tag + '\n' + code + '\n```' })
}

module.exports = { sendCodeCard, sendFullCode }

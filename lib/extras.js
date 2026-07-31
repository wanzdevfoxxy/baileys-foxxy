'use strict'

const crypto = require('crypto')

/**
 * Kirim polling native WhatsApp (bisa pilih 1 atau lebih opsi).
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {string} question
 * @param {string[]} options
 * @param {{selectableCount?:number}} [opts]
 */
async function sendPoll(sock, jid, question, options = [], opts = {}) {
  return sock.sendMessage(jid, {
    poll: {
      name: question,
      values: options,
      selectableCount: opts.selectableCount || 1
    }
  })
}

/**
 * Kirim pesan yang mention semua anggota grup, tapi teks yang tampil
 * bebas kamu atur sendiri (nggak wajib nulisin semua @nomor).
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} groupJid
 * @param {string} text
 */
async function sendMentionAll(sock, groupJid, text) {
  const meta = await sock.groupMetadata(groupJid)
  const mentions = meta.participants.map(p => p.id)
  return sock.sendMessage(groupJid, { text, mentions })
}

/**
 * Bikin channel/broadcast-style forwarded tag di pesan (label "diteruskan").
 */
function withForwarded(content, score = 1) {
  return {
    ...content,
    contextInfo: {
      ...(content.contextInfo || {}),
      isForwarded: true,
      forwardingScore: score
    }
  }
}

/** Generate id unik pendek, umum dipakai buat button/list custom */
function randomId(len = 8) {
  return crypto.randomBytes(len).toString('hex').slice(0, len)
}

module.exports = { sendPoll, sendMentionAll, withForwarded, randomId }

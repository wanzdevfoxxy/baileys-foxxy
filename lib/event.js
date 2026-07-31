'use strict'

const { relay, wrapInteractive } = require('./utils')

/**
 * Kirim event message (kartu undangan acara native WhatsApp, ada
 * tombol "Tertarik/Going" otomatis dari sistem WA).
 *
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {object} opts
 * @param {string} opts.name - nama acara
 * @param {string} [opts.description]
 * @param {Date} opts.startTime - waktu mulai acara
 * @param {Date} [opts.endTime]
 * @param {string} [opts.location]
 */
async function sendEvent(sock, jid, opts = {}) {
  const { name, description = '', startTime, endTime, location = '' } = opts

  const content = {
    eventMessage: {
      isCanceled: false,
      name,
      description,
      location: location ? { name: location } : undefined,
      startTime: Math.floor(startTime.getTime() / 1000),
      endTime: endTime ? Math.floor(endTime.getTime() / 1000) : undefined
    }
  }

  return relay(sock, jid, content)
}

module.exports = { sendEvent }

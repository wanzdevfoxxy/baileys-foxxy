'use strict'

/**
 * Kirim satu kontak (vCard).
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {object} opts
 * @param {string} opts.name - nama tampilan kontak
 * @param {string} opts.phone - nomor tujuan, format: 628123456789
 * @param {string} [opts.organization]
 */
async function sendContact(sock, jid, opts = {}) {
  const { name, phone, organization = '' } = opts
  const vcard =
    'BEGIN:VCARD\n' +
    'VERSION:3.0\n' +
    `FN:${name}\n` +
    (organization ? `ORG:${organization};\n` : '') +
    `TEL;type=CELL;type=VOICE;waid=${phone}:+${phone}\n` +
    'END:VCARD'

  return sock.sendMessage(jid, {
    contacts: { displayName: name, contacts: [{ vcard }] }
  })
}

/**
 * Kirim banyak kontak sekaligus.
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {string} jid
 * @param {{name:string, phone:string, organization?:string}[]} list
 * @param {string} [displayName] - nama grup kontak yang tampil
 */
async function sendContactList(sock, jid, list = [], displayName = 'Daftar Kontak') {
  const contacts = list.map(({ name, phone, organization = '' }) => ({
    vcard:
      'BEGIN:VCARD\n' +
      'VERSION:3.0\n' +
      `FN:${name}\n` +
      (organization ? `ORG:${organization};\n` : '') +
      `TEL;type=CELL;type=VOICE;waid=${phone}:+${phone}\n` +
      'END:VCARD'
  }))

  return sock.sendMessage(jid, { contacts: { displayName, contacts } })
}

module.exports = { sendContact, sendContactList }

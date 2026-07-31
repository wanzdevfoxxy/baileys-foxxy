'use strict'

function printBanner() {
  if (process.env.FOXXY_SILENT) return
  const line = '─'.repeat(42)
  console.log(`\x1b[35m${line}\x1b[0m`)
  console.log('\x1b[35m%s\x1b[0m', '  🦊  baileys-foxxy')
  console.log('\x1b[90m%s\x1b[0m', '  Message builder buat @whiskeysockets/baileys')
  console.log('\x1b[90m%s\x1b[0m', '  Owner / Developer : Wanz')
  console.log(`\x1b[35m${line}\x1b[0m`)
}

module.exports = { printBanner }

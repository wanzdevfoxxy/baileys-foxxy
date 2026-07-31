'use strict'

const { printBanner } = require('./lib/banner')
const { configure } = require('./lib/resolver')
const { sendButton } = require('./lib/button')
const { sendButtonV2 } = require('./lib/buttonV2')
const { sendTable, buildAsciiTable, sendAsciiTable } = require('./lib/table')
const { sendCarousel } = require('./lib/carousel')
const { sendPoster, sendPosterSimple } = require('./lib/poster')
const { sendFakeLinkPreview } = require('./lib/fakeLinkPreview')
const { sendFakeQuotedStatus, sendFakeQuoted } = require('./lib/fakeQuoted')
const { sendPoll, sendMentionAll, withForwarded, randomId } = require('./lib/extras')
const { sendLocation, sendLiveLocation } = require('./lib/location')
const { sendContact, sendContactList } = require('./lib/contact')
const { sendAlbum } = require('./lib/album')
const { sendReaction, sendViewOnce } = require('./lib/reaction')
const { sendEvent } = require('./lib/event')
const { sendFakeLocation } = require('./lib/fakeLocation')
const { sendFakeOrderCard } = require('./lib/fakeOrder')
const { sendNativeTable } = require('./lib/nativeTable')
const { sendCodeCard, sendFullCode } = require('./lib/codeBlock')

printBanner()

module.exports = {
  // meta
  version: require('./package.json').version,
  author: 'Wanz',
  configure,

  // button
  sendButton,
  sendButtonV2,
  // table
  sendTable,
  buildAsciiTable,
  sendAsciiTable,
  // carousel
  sendCarousel,
  // poster
  sendPoster,
  sendPosterSimple,
  // fake link preview
  sendFakeLinkPreview,
  // fake quoted
  sendFakeQuotedStatus,
  sendFakeQuoted,
  // location
  sendLocation,
  sendLiveLocation,
  // contact
  sendContact,
  sendContactList,
  // media lanjutan
  sendAlbum,
  sendReaction,
  sendViewOnce,
  // event
  sendEvent,
  // fake location & order card
  sendFakeLocation,
  sendFakeOrderCard,
  sendNativeTable,
  sendCodeCard,
  sendFullCode,
  // extras
  sendPoll,
  sendMentionAll,
  withForwarded,
  randomId
}

// Who an expense is paid to, from its name: "Netflix", "Spotify Premium", "iCloud 200GB"…
// Word (or phrase) → domain of the logo. Only names that cannot be mistaken for ordinary
// words: better the initials than a wrong logo. To add one, add a line here.
const VENDORS = [
  ['netflix', 'netflix.com'], ['spotify', 'spotify.com'], ['disney', 'disneyplus.com'], ['prime video', 'primevideo.com'],
  ['amazon prime', 'amazon.com'], ['amazon', 'amazon.com'], ['dazn', 'dazn.com'], ['sky', 'sky.it'], ['now tv', 'nowtv.it'],
  ['youtube', 'youtube.com'], ['apple music', 'music.apple.com'], ['apple tv', 'tv.apple.com'], ['icloud', 'icloud.com'],
  ['apple', 'apple.com'], ['macbook', 'apple.com'], ['iphone', 'apple.com'], ['ipad', 'apple.com'], ['airpods', 'apple.com'], ['audible', 'audible.com'], ['kindle', 'amazon.com'], ['playstation', 'playstation.com'],
  ['xbox', 'xbox.com'], ['nintendo', 'nintendo.com'], ['twitch', 'twitch.tv'], ['crunchyroll', 'crunchyroll.com'],
  ['chatgpt', 'openai.com'], ['openai', 'openai.com'], ['claude', 'claude.ai'], ['anthropic', 'anthropic.com'],
  ['gemini', 'gemini.google.com'], ['google one', 'one.google.com'], ['google', 'google.com'], ['microsoft', 'microsoft.com'],
  ['office 365', 'microsoft.com'], ['dropbox', 'dropbox.com'], ['1password', '1password.com'], ['nordvpn', 'nordvpn.com'], ['nordpass', 'nordpass.com'], ['faceit', 'faceit.com'],
  ['expressvpn', 'expressvpn.com'], ['notion', 'notion.so'], ['canva', 'canva.com'], ['adobe', 'adobe.com'],
  ['duolingo', 'duolingo.com'], ['linkedin', 'linkedin.com'], ['patreon', 'patreon.com'], ['substack', 'substack.com'],
  ['tim', 'tim.it'], ['vodafone', 'vodafone.it'], ['iliad', 'iliad.it'], ['fastweb', 'fastweb.it'], ['windtre', 'windtre.it'],
  ['wind tre', 'windtre.it'], ['ho mobile', 'ho-mobile.it'], ['very mobile', 'verymobile.it'], ['kena', 'kenamobile.it'],
  ['enel', 'enel.it'], ['a2a', 'a2a.eu'], ['hera', 'gruppohera.it'], ['iren', 'iren.it'], ['edison', 'edison.it'],
  ['eni', 'eniplenitude.com'], ['plenitude', 'eniplenitude.com'], ['sorgenia', 'sorgenia.it'], ['octopus', 'octopusenergy.it'],
  ['unipol', 'unipol.it'], ['generali', 'generali.it'], ['allianz', 'allianz.it'], ['axa', 'axa.it'], ['genertel', 'genertel.it'],
  ['prima assicurazioni', 'prima.it'], ['verisure', 'verisure.it'], ['mcfit', 'mcfit.com'], ['virgin active', 'virginactive.it'],
  ['technogym', 'technogym.com'], ['uber', 'uber.com'], ['glovo', 'glovoapp.com'], ['deliveroo', 'deliveroo.it'],
  ['just eat', 'justeat.it'], ['trenitalia', 'trenitalia.com'], ['italo', 'italotreno.com'], ['ryanair', 'ryanair.com'],
  ['airbnb', 'airbnb.com'], ['booking', 'booking.com'], ['telepass', 'telepass.com'], ['paypal', 'paypal.com'],
  ['revolut', 'revolut.com'], ['wise', 'wise.com'], ['n26', 'n26.com'], ['satispay', 'satispay.com'], ['klarna', 'klarna.com'],
  ['scalapay', 'scalapay.com'], ['findomestic', 'findomestic.it'], ['compass', 'compass.it'], ['agos', 'agos.it'],
  ['tesla', 'tesla.com'], ['bmw', 'bmw.it'], ['mercedes', 'mercedes-benz.it'], ['audi', 'audi.it'], ['volkswagen', 'volkswagen.it'],
  ['fiat', 'fiat.it'], ['leasys', 'leasys.com'], ['arval', 'arval.it'], ['ayvens', 'ayvens.com'],
]

// The domain of the vendor named in `name`, or null. The word must stand whole
// ("tim" in "TIM Fibra", not in "Timberland"; "eni" in "Eni gas", not in "Venice").
export function vendorDomain(name) {
  const t = ' ' + String(name || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim() + ' '
  if (!t.trim()) return null
  for (const [word, domain] of VENDORS) {
    const at = t.indexOf(` ${word} `)
    if (at >= 0) return domain
  }
  return null
}

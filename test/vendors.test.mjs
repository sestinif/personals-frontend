import { test } from 'node:test'
import assert from 'node:assert/strict'
import { vendorDomain } from '../src/lib/vendors.js'

test('the vendor is read from the expense name, as a whole word', () => {
  assert.equal(vendorDomain('Netflix'), 'netflix.com')
  assert.equal(vendorDomain('Spotify Premium Family'), 'spotify.com')
  assert.equal(vendorDomain('iCloud+ 200GB'), 'icloud.com')
  assert.equal(vendorDomain('Disney+'), 'disneyplus.com')
  assert.equal(vendorDomain('TIM Fibra'), 'tim.it')
  assert.equal(vendorDomain('Abbonamento ChatGPT'), 'openai.com')
  assert.equal(vendorDomain('Amazon Prime'), 'amazon.com')
  assert.equal(vendorDomain('MacBook Pro'), 'apple.com')
  assert.equal(vendorDomain('FACEIT Premium'), 'faceit.com')
  assert.equal(vendorDomain('NordPass'), 'nordpass.com')
  assert.equal(vendorDomain('iPhone 17 a rate'), 'apple.com')
})

test('ordinary words and unknown names give nothing', () => {
  assert.equal(vendorDomain('Timberland'), null)
  assert.equal(vendorDomain('Venice trip'), null)
  assert.equal(vendorDomain('Affitto casa'), null)
  assert.equal(vendorDomain('Palestra sotto casa'), null)
  assert.equal(vendorDomain(''), null)
  assert.equal(vendorDomain(undefined), null)
})

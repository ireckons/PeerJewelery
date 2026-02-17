/**
 * Generate placeholder product images as SVGs for development.
 * Run: node scripts/create-placeholders.mjs
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, '..', 'public', 'products')

const products = [
    { id: 1, name: 'Riviera Tennis\nBracelet Set', emoji: '💎' },
    { id: 2, name: 'Marquise Solitaire\nDiamond Ring', emoji: '💍' },
    { id: 3, name: 'Pear & Round\nCluster Ring', emoji: '✨' },
    { id: 4, name: 'Oval Halo\nEngagement Ring', emoji: '💎' },
    { id: 5, name: 'Floral Diamond\nStatement Ring', emoji: '🌸' },
    { id: 6, name: 'Classic Round\nSolitaire Ring', emoji: '💍' },
    { id: 7, name: 'Emerald\nEternity Band', emoji: '💚' },
    { id: 8, name: 'Double-Row\nDiamond Band', emoji: '✨' },
    { id: 9, name: 'Multi-Row\nDiamond Ring Set', emoji: '💎' }
]

const colors = [
    ['#1a1a2e', '#16213e'],
    ['#0f0f23', '#1a1a3e'],
    ['#1e1e2e', '#2d2d44'],
    ['#141428', '#1f1f3a'],
    ['#0d0d1a', '#1a1a30'],
    ['#1a1a28', '#252540'],
    ['#0f1a2e', '#162940'],
    ['#1a1422', '#2d2038'],
    ['#141a1e', '#1f2d35']
]

function createSVG(product, index) {
    const [bg1, bg2] = colors[index]
    const lines = product.name.split('\n')

    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg1}"/>
      <stop offset="100%" style="stop-color:${bg2}"/>
    </linearGradient>
    <radialGradient id="glow${index}" cx="50%" cy="40%" r="50%">
      <stop offset="0%" style="stop-color:#89B4D4;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#89B4D4;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg${index})"/>
  <rect width="800" height="800" fill="url(#glow${index})"/>
  <!-- Diamond shape -->
  <polygon points="400,200 500,400 400,600 300,400" fill="none" stroke="#89B4D4" stroke-width="1" opacity="0.2"/>
  <polygon points="400,250 470,400 400,550 330,400" fill="none" stroke="#89B4D4" stroke-width="0.5" opacity="0.15"/>
  <!-- Sparkle dots -->
  <circle cx="400" cy="300" r="3" fill="#89B4D4" opacity="0.6"/>
  <circle cx="350" cy="380" r="2" fill="#89B4D4" opacity="0.4"/>
  <circle cx="450" cy="380" r="2" fill="#89B4D4" opacity="0.4"/>
  <circle cx="400" cy="460" r="2.5" fill="#89B4D4" opacity="0.5"/>
  <!-- Text -->
  <text x="400" y="${380 + (lines.length === 1 ? 0 : -15)}" text-anchor="middle" fill="#f5f5f5" font-family="Georgia, serif" font-size="28" font-weight="400" letter-spacing="2">${lines[0]}</text>
  ${lines[1] ? `<text x="400" y="${415}" text-anchor="middle" fill="#f5f5f5" font-family="Georgia, serif" font-size="28" font-weight="400" letter-spacing="2">${lines[1]}</text>` : ''}
  <text x="400" y="460" text-anchor="middle" fill="#89B4D4" font-family="Arial, sans-serif" font-size="14" letter-spacing="4" text-transform="uppercase" opacity="0.6">PEER JEWELRY</text>
</svg>`
}

try {
    mkdirSync(OUTPUT_DIR, { recursive: true })
} catch { }

products.forEach((product, i) => {
    const svg = createSVG(product, i)
    const path = join(OUTPUT_DIR, `ring-${product.id}.jpg`)
    // Save as SVG but with .jpg extension for simplicity (browsers handle this)
    // For production, these would be replaced with real photos
    const svgPath = join(OUTPUT_DIR, `ring-${product.id}.svg`)
    writeFileSync(svgPath, svg)
    console.log(`✓ ring-${product.id}.svg`)
})

console.log(`\n✨ Created ${products.length} placeholder images in public/products/`)
console.log('NOTE: Replace these with real product photos for production.')
console.log('You can also use the crop-grid.mjs script to crop images from a 3x3 grid.')

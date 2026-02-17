/**
 * Image Cropping Script — crops the 3x3 product grid in public/products-grid.jpg
 * into 9 individual product images.
 *
 * Run: node scripts/crop-grid.mjs
 *
 * NOTE: This requires the 'sharp' package: npm install sharp
 * If sharp is unavailable, the product images from the grid are served directly
 * by using CSS object-fit and object-position to show different sections.
 *
 * Alternatively, the products-grid.jpg can be opened in any image editor and
 * manually cropped into 9 equal sections (3 rows × 3 columns).
 */

import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INPUT = join(__dirname, '..', 'public', 'products-grid.jpg')
const OUTPUT_DIR = join(__dirname, '..', 'public', 'products')

async function cropGrid() {
    try {
        mkdirSync(OUTPUT_DIR, { recursive: true })
    } catch { }

    const metadata = await sharp(INPUT).metadata()
    const cellWidth = Math.floor(metadata.width / 3)
    const cellHeight = Math.floor(metadata.height / 3)

    console.log(`Image: ${metadata.width}x${metadata.height}`)
    console.log(`Cell size: ${cellWidth}x${cellHeight}`)

    let index = 1
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const outputPath = join(OUTPUT_DIR, `ring-${index}.jpg`)
            await sharp(INPUT)
                .extract({
                    left: col * cellWidth,
                    top: row * cellHeight,
                    width: cellWidth,
                    height: cellHeight
                })
                .jpeg({ quality: 92 })
                .toFile(outputPath)

            console.log(`✓ ring-${index}.jpg (${col},${row})`)
            index++
        }
    }

    console.log('\nDone! 9 product images created in public/products/')
}

cropGrid().catch(console.error)

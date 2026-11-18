// Usage: npm run qr -- https://your-site.vercel.app
// Writes presentation/qr.svg and presentation/qr.png (1200px, dark on white, with a quiet zone).
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const url = process.argv[2]
if (!url || !/^https?:\/\//i.test(url)) {
  console.error('Pass the full URL, for example:\n  npm run qr -- https://codingquests-concept.vercel.app')
  process.exit(1)
}

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'presentation')
await mkdir(outDir, { recursive: true })

const opts = {
  errorCorrectionLevel: 'M',
  margin: 4, // quiet zone, in modules
  color: { dark: '#000000', light: '#ffffff' },
}

const svg = await QRCode.toString(url, { ...opts, type: 'svg' })
await writeFile(resolve(outDir, 'qr.svg'), svg)
await QRCode.toFile(resolve(outDir, 'qr.png'), url, { ...opts, type: 'png', width: 1200 })

console.log(`QR code for ${url}`)
console.log(`  ${resolve(outDir, 'qr.svg')}`)
console.log(`  ${resolve(outDir, 'qr.png')} (1200 x 1200)`)

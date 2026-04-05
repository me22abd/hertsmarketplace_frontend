import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(__dirname, '..', 'public');
const full = path.join(pub, 'herts-logo-full.png');

const iconExtract = { left: 0, top: 0, width: 400, height: 682 };

function iconPipeline() {
  return sharp(full).extract(iconExtract).ensureAlpha();
}

async function main() {
  await iconPipeline()
    .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(pub, 'favicon-16x16.png'));

  await iconPipeline()
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(pub, 'favicon-32x32.png'));

  await iconPipeline()
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(pub, 'apple-touch-icon.png'));

  await iconPipeline().png().toFile(path.join(pub, 'herts-logo-icon.png'));

  await iconPipeline()
    .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(pub, 'pwa-192.png'));

  await iconPipeline()
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(pub, 'pwa-512.png'));

  console.log(
    'Wrote favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, herts-logo-icon.png, pwa-192.png, pwa-512.png'
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

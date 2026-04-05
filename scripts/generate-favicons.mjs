import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(__dirname, '..', 'public');
const full = path.join(pub, 'herts-logo-full.png');

const iconExtract = { left: 0, top: 0, width: 400, height: 682 };

/** Turn near-white matte into transparency so the logo blends on #F9FAFB */
async function removeLightBackground(srcPath, destPath, threshold = 248) {
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels !== 4) {
    throw new Error(`Expected RGBA, got ${channels} channels`);
  }
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0;
    }
  }
  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(destPath);
}

function iconPipeline() {
  return sharp(full).extract(iconExtract).ensureAlpha();
}

async function main() {
  await removeLightBackground(full, full);

  const transparentBg = { r: 0, g: 0, b: 0, alpha: 0 };

  await iconPipeline()
    .resize(16, 16, { fit: 'contain', background: transparentBg })
    .png()
    .toFile(path.join(pub, 'favicon-16x16.png'));

  await iconPipeline()
    .resize(32, 32, { fit: 'contain', background: transparentBg })
    .png()
    .toFile(path.join(pub, 'favicon-32x32.png'));

  await iconPipeline()
    .resize(180, 180, { fit: 'contain', background: transparentBg })
    .png()
    .toFile(path.join(pub, 'apple-touch-icon.png'));

  await iconPipeline().png().toFile(path.join(pub, 'herts-logo-icon.png'));

  await iconPipeline()
    .resize(192, 192, { fit: 'contain', background: transparentBg })
    .png()
    .toFile(path.join(pub, 'pwa-192.png'));

  await iconPipeline()
    .resize(512, 512, { fit: 'contain', background: transparentBg })
    .png()
    .toFile(path.join(pub, 'pwa-512.png'));

  console.log(
    'Removed light matte from herts-logo-full.png; wrote favicons, herts-logo-icon.png, PWA icons'
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

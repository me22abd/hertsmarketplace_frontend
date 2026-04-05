/**
 * Mobile Safari (and strict autoplay policies) often block the first <audio> play
 * until the document has "unlocked" playback via a user gesture. Stream Chat voice
 * messages can hit this on Netlify/production HTTPS. Running a minimal unlock from
 * pointerdown capture on a parent lets the same tap chain succeed for the play button.
 */
let unlocked = false;

export function unlockWebAudioFromUserGesture(): void {
  if (unlocked || typeof window === 'undefined') return;

  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) {
      const ctx = new AC();
      void ctx.resume();
      const buffer = ctx.createBuffer(1, 1, 8000);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.start(0);
      void ctx.close();
    }
  } catch {
    // ignore
  }

  try {
    const silent = new Audio(
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
    );
    silent.volume = 0.0001;
    const p = silent.play();
    if (p !== undefined) {
      void p.then(() => silent.pause()).catch(() => {});
    }
  } catch {
    // ignore
  }

  unlocked = true;
}

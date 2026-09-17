// Deterministic placeholder image.
//
// cataas returns a DIFFERENT random cat on every request, so the pet's face changed on
// each page load — and because the server-rendered URL differed from the client one, it
// also produced a React hydration mismatch (error #418). placecats serves a fixed set of
// named cats, so keying the name off the cat id gives a stable image per pet.
//
// Not Pexels: it requires an Authorization key, and an EXPO_PUBLIC_* key is inlined into
// the client bundle in plaintext. A curated photo belongs behind the backend, which can
// hold the key and populate cats.image_url.
const NAMES = ['neo', 'millie', 'bella', 'poppy', 'louie'];

export function placeholderCatImage(seed: string | number, size = 512): string {
  const n = typeof seed === 'number' ? seed : seed.length;
  const name = NAMES[Math.abs(n) % NAMES.length];
  return `https://placecats.com/${name}/${size}/${size}`;
}

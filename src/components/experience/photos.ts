// Carregamento automático de fotos da pasta public/fotos
// Convenção: foto1.jpg ... foto20.jpg (também aceita .jpeg, .png, .webp)

const MAX_PHOTOS = 20;
const EXTS = ["jpg", "jpeg", "png", "webp"] as const;

// Vite serve arquivos de /public na raiz, então usamos URLs diretas
// e fazemos um pré-check via HEAD pra detectar quais existem.

export type Photo = {
  index: number;
  src: string | null; // null = ausente (fallback)
};

let cache: Photo[] | null = null;
let inflight: Promise<Photo[]> | null = null;

async function checkExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function resolvePhoto(i: number): Promise<Photo> {
  for (const ext of EXTS) {
    const url = `/fotos/foto${i}.${ext}`;
    // eslint-disable-next-line no-await-in-loop
    if (await checkExists(url)) {
      return { index: i, src: url };
    }
  }
  return { index: i, src: null };
}

export function loadPhotos(): Promise<Photo[]> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = Promise.all(
    Array.from({ length: MAX_PHOTOS }, (_, k) => resolvePhoto(k + 1)),
  ).then((list) => {
    cache = list;
    inflight = null;
    return list;
  });
  return inflight;
}

export function getPhoto(i: number, photos: Photo[]): Photo | undefined {
  return photos.find((p) => p.index === i);
}

export const TOTAL_PHOTOS = MAX_PHOTOS;
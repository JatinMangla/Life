export interface SrcSetSource {
  src?: string;
  srcSet?: string;
  sizes?: string;
}

/**
 * Let the browser resolve a `srcSet` for us and report back which candidate it
 * picked. Used to feed the right resolution into three.js textures, which have
 * no srcSet of their own.
 */
export function loadImageFromSrcSet({ src, srcSet, sizes }: SrcSetSource): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!src && !srcSet) {
      reject(new Error('No image src or srcSet provided'));
      return;
    }

    const tempImage = new Image();

    if (src) tempImage.src = src;
    if (srcSet) tempImage.srcset = srcSet;
    if (sizes) tempImage.sizes = sizes;

    const onLoad = () => {
      tempImage.removeEventListener('load', onLoad);
      resolve(tempImage.currentSrc);
    };

    tempImage.addEventListener('load', onLoad);
    tempImage.addEventListener('error', () =>
      reject(new Error(`Error loading ${srcSet ?? src}`))
    );
  });
}

/** Generate a transparent png of a given width and height as an object URL. */
export function generateImage(width = 1, height = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not acquire a 2d canvas context'));
      return;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, width, height);

    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Canvas failed to produce a blob'));
        return;
      }

      const image = URL.createObjectURL(blob);
      canvas.remove();
      resolve(image);
    });
  });
}

/**
 * Resolve a single `src` out of a `srcSet` by standing in a transparent image
 * of each candidate width and asking the browser to choose.
 */
export async function resolveSrcFromSrcSet({
  srcSet,
  sizes,
}: {
  srcSet: string;
  sizes?: string;
}): Promise<string> {
  const sources = await Promise.all(
    srcSet.split(', ').map(async srcString => {
      const [src, width] = srcString.split(' ');

      if (!src || !width) {
        throw new Error(`Malformed srcSet entry: "${srcString}"`);
      }

      const size = Number(width.replace('w', ''));
      const image = await generateImage(size);

      return { src, image, width };
    })
  );

  const fakeSrcSet = sources.map(({ image, width }) => `${image} ${width}`).join(', ');
  const fakeSrc = await loadImageFromSrcSet({ srcSet: fakeSrcSet, sizes });

  const match = sources.find(source => source.image === fakeSrc);

  if (!match) throw new Error(`Could not resolve a src from srcSet: ${srcSet}`);

  return match.src;
}

// Processamento de imagem no navegador: redimensiona e comprime antes de enviar.
// Isso mantém os uploads leves (e abaixo do limite das funções serverless).

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
    img.src = src;
  });
}

export interface ProcessedImage {
  blob: Blob;
  dataUrl: string;
}

/**
 * Redimensiona a imagem para no máximo `maxSize` px no maior lado e
 * comprime em JPEG. Retorna o blob (para upload) e o data URL (para preview/dev).
 */
export async function processImage(
  file: File,
  maxSize = 1600,
  quality = 0.85
): Promise<ProcessedImage> {
  const sourceUrl = await fileToDataUrl(file);
  const img = await loadImage(sourceUrl);

  let { width, height } = img;
  if (width > height && width > maxSize) {
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  } else if (height >= width && height > maxSize) {
    width = Math.round((width * maxSize) / height);
    height = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a imagem.");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Falha ao processar a imagem."))),
      "image/jpeg",
      quality
    )
  );

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { blob, dataUrl };
}

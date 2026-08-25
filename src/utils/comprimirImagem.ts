export const TAMANHO_MAXIMO_BYTES = 900 * 1024; // 900 KB
export const TIPOS_IMAGEM_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];
export const TIPOS_ACEITOS = [...TIPOS_IMAGEM_ACEITOS, 'application/pdf'];

const QUALIDADES = [0.85, 0.7, 0.55, 0.4];
const DIMENSAO_INICIAL = 1600;
const DIMENSAO_REDUZIDA = 1200;

export async function comprimirParaWebP(arquivo: File): Promise<File> {
  if (!TIPOS_IMAGEM_ACEITOS.includes(arquivo.type)) {
    throw new Error('Formato de imagem não suportado. Envie JPEG, PNG, WebP ou PDF.');
  }

  const bitmap = await createImageBitmap(arquivo, { imageOrientation: 'from-image' });

  let blob = await tentarComprimir(bitmap, DIMENSAO_INICIAL);
  if (!blob || blob.size > TAMANHO_MAXIMO_BYTES) {
    blob = await tentarComprimir(bitmap, DIMENSAO_REDUZIDA);
  }
  bitmap.close();

  if (!blob || blob.size > TAMANHO_MAXIMO_BYTES) {
    throw new Error('Não foi possível comprimir esta imagem abaixo de 1 MB. Tente um print da tela em vez da foto.');
  }

  const extensao = blob.type === 'image/webp' ? 'webp' : 'jpg';
  const nomeBase = arquivo.name.replace(/\.[^.]+$/, '') || 'comprovante';
  return new File([blob], `${nomeBase}.${extensao}`, { type: blob.type });
}

async function tentarComprimir(bitmap: ImageBitmap, dimensaoMaxima: number): Promise<Blob | null> {
  const escala = Math.min(1, dimensaoMaxima / Math.max(bitmap.width, bitmap.height));
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0, largura, altura);

  let melhor: Blob | null = null;

  for (const qualidade of QUALIDADES) {
    const blob = await canvasParaBlob(canvas, 'image/webp', qualidade);
    if (!blob) continue;

    // Alguns navegadores não suportam WebP e devolvem PNG independente do tipo pedido;
    // nesse caso reencoda como JPEG
    const efetivo = blob.type === 'image/webp' ? blob : await canvasParaBlob(canvas, 'image/jpeg', qualidade);
    if (!efetivo) continue;

    melhor = efetivo;
    if (efetivo.size <= TAMANHO_MAXIMO_BYTES) {
      return efetivo;
    }
  }

  return melhor;
}

function canvasParaBlob(canvas: HTMLCanvasElement, tipo: string, qualidade: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, tipo, qualidade));
}

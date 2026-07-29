export function formatarBRL(valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined) return '-';
  const numero = typeof valor === 'string' ? Number(valor) : valor;
  if (Number.isNaN(numero)) return '-';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);
}

export function formatarDataHora(iso: string | null | undefined): string {
  if (!iso) return '-';
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '-';
  return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

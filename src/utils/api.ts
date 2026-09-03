/**
 * Helper centralizado para resolver a URL base da API Spring Boot.
 * No ambiente Docker em produção, resolve dinamicamente para o serviço interno 'evcomp-api:8080'.
 * No ambiente de desenvolvimento local (npm run dev), resolve para 'localhost:8080'.
 */
export function getApiBase(): string {
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  if (process.env.NODE_ENV === 'production') {
    return 'http://evcomp-api:8080/api';
  }
  return 'http://localhost:8080/api';
}

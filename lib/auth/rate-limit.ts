/**
 * Rate limiting implementation para prevenir ataques de fuerza bruta
 * Usa Map en memoria (para producción usar Redis)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimit = new Map<string, RateLimitEntry>();

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimit.entries()) {
    if (now > entry.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Verifica si una IP ha excedido el límite de requests
 * @param identifier - IP address o user ID
 * @param limit - Número máximo de requests permitidos
 * @param windowMs - Ventana de tiempo en milisegundos
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimit.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Nueva ventana de tiempo
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  entry.count++;

  if (entry.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Limpia el contador para un identificador específico
 */
export function resetRateLimit(identifier: string): void {
  rateLimit.delete(identifier);
}

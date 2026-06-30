/**
 * Простий in-memory rate-limit (ковзне вікно) для MVP.
 * За замовчуванням: 20 запитів на IP за 10 хвилин.
 *
 * Обмеження: на serverless кожен інстанс має власну памʼять, тож ліміт є
 * приблизним (best-effort). Для суворого ліміту на проді — перейти на
 * Upstash Redis / @upstash/ratelimit (див. розділ «розширення» в ТЗ).
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 20;

const hits = new Map<string, number[]>();

export function rateLimit(key: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const fresh = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);

  if (fresh.length >= MAX_HITS) {
    hits.set(key, fresh);
    return { ok: false, remaining: 0 };
  }

  fresh.push(now);
  hits.set(key, fresh);

  // запобіжник від нескінченного росту map
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return { ok: true, remaining: MAX_HITS - fresh.length };
}

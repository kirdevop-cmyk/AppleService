/**
 * Декоративний фон героя: рухомі градієнтні плями, обертове сяйво,
 * мерехтливі зорі та частинки, що повільно піднімаються вгору.
 * Суто CSS-анімації, pointer-events вимкнено, вимикається при reduce-motion.
 * Координати детерміновані (без Math.random) — щоб уникнути hydration-mismatch.
 */

// зорі: [left%, top%, розмір px, тривалість s, затримка s]
const STARS: [number, number, number, number, number][] = [
  [8, 18, 2, 4.5, 0], [16, 62, 3, 5.5, 1.2], [24, 34, 2, 4, 2.1],
  [33, 78, 2, 6, 0.6], [41, 12, 3, 5, 1.8], [48, 52, 2, 4.5, 3],
  [57, 28, 2, 5.5, 0.4], [63, 70, 3, 4, 2.4], [71, 40, 2, 6, 1],
  [78, 14, 2, 5, 3.2], [84, 60, 3, 4.5, 0.9], [90, 32, 2, 5.5, 2],
  [12, 86, 2, 4, 1.5], [38, 92, 2, 5, 0.3], [68, 88, 3, 6, 2.7],
  [94, 76, 2, 4.5, 1.1], [4, 46, 2, 5.5, 2.9], [52, 84, 2, 4, 0.7],
];

// частинки, що пливуть угору: [left%, розмір px, тривалість s, затримка s, колір]
const PARTICLES: [number, number, number, number, string][] = [
  [14, 4, 13, 0, 'rgba(124,194,255,0.55)'],
  [30, 3, 16, 3, 'rgba(59,130,246,0.5)'],
  [47, 5, 14, 6, 'rgba(29,78,216,0.5)'],
  [63, 3, 18, 1.5, 'rgba(124,194,255,0.45)'],
  [79, 4, 15, 4.5, 'rgba(59,130,246,0.5)'],
  [90, 3, 17, 7, 'rgba(29,78,216,0.45)'],
];

export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* обертове сяйво (aurora) */}
      <div
        className="absolute left-1/2 top-1/2 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.35] blur-3xl"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(124,194,255,0.18), rgba(59,130,246,0.24), rgba(29,78,216,0.18), rgba(124,194,255,0.18))',
          animation: 'spinSlow 48s linear infinite',
        }}
      />

      {/* рухомі градієнтні плями */}
      <div className="animate-blob absolute right-[8%] top-[6%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.28),transparent_62%)] blur-2xl" />
      <div className="animate-blob-2 absolute left-[6%] top-[42%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(124,194,255,0.22),transparent_62%)] blur-2xl" />
      <div className="animate-blob absolute right-[34%] top-[58%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(29,78,216,0.18),transparent_62%)] blur-2xl [animation-delay:-7s]" />

      {/* мерехтливі зорі */}
      {STARS.map(([left, top, size, dur, delay], i) => (
        <span
          key={`s${i}`}
          className="absolute rounded-full bg-white opacity-40"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            boxShadow: '0 0 6px rgba(255,255,255,0.6)',
            animation: `twinkle ${dur}s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}

      {/* частинки, що піднімаються вгору */}
      {PARTICLES.map(([left, size, dur, delay, color], i) => (
        <span
          key={`p${i}`}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            boxShadow: `0 0 10px ${color}`,
            animation: `driftUp ${dur}s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

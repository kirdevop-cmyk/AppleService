/**
 * Глобальний фон сайту в стилі логотипа MobiDoctor: темне полотно,
 * синє сяйво у верхньому лівому куті та діагональний світловий промінь
 * праворуч-знизу з мерехтливим відблиском, що повільно пробігає по ньому.
 * Фіксований шар позаду всього контенту (z-index: -10), вимикається при
 * prefers-reduced-motion. Без JS-стану — суто декоративний CSS.
 */
export function SiteBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-10] overflow-hidden" aria-hidden="true">
      {/* синє сяйво у верхньому лівому куті (як на логотипі) */}
      <div
        className="absolute -left-[10%] -top-[10%] h-[60vw] max-h-[820px] min-h-[420px] w-[60vw] min-w-[420px] max-w-[820px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.32), rgba(29,78,216,0.14) 45%, transparent 72%)',
          animation: 'glowPulse 9s ease-in-out infinite',
        }}
      />

      {/* діагональний світловий промінь праворуч-знизу */}
      <div
        className="absolute -bottom-[30%] -right-[20%] h-[160vh] w-[55vw] min-w-[480px] origin-bottom-right blur-2xl"
        style={{
          background: 'linear-gradient(100deg, transparent 30%, rgba(59,130,246,0.22) 48%, rgba(124,194,255,0.3) 52%, transparent 70%)',
          animation: 'beamDrift 14s ease-in-out infinite',
        }}
      />
      {/* яскравіший тонкий промінь-«лезо» з відблиском, що пробігає */}
      <div
        className="absolute -bottom-[40%] -right-[15%] h-[170vh] w-[140px] origin-bottom-right opacity-70"
        style={{
          transform: 'rotate(-31deg)',
          background:
            'linear-gradient(90deg, transparent, rgba(124,194,255,0.55) 45%, rgba(255,255,255,0.6) 50%, rgba(124,194,255,0.55) 55%, transparent)',
          backgroundSize: '300% 100%',
          filter: 'blur(2px)',
          animation: 'beamSweep 6s linear infinite',
        }}
      />

      {/* м'яка вінʼєтка, щоб краї полотна не виглядали обрізаними */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(12,12,11,0.65)_100%)]" />
    </div>
  );
}

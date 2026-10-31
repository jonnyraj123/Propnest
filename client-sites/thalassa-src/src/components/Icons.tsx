/** 200x200 illustrated card art for the three expedition cards. */

export function FlaskArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-[200px] w-[200px]" aria-hidden>
      <g className="floaty">
        <path d="M78 30 L122 30 L118 40 L118 82 L158 160 Q164 176 146 178 L54 178 Q36 176 42 160 L82 82 L82 40Z" fill="#cfe0ff" fillOpacity=".35" stroke="#e8f0ff" strokeWidth="4" />
        <path d="M60 128 L140 128 L156 160 Q160 172 146 172 L54 172 Q40 172 44 160Z" fill="#ff5f8f" />
        <path d="M60 128 L140 128 L146 140 L54 140Z" fill="#ff9dbb" />
        <rect x="74" y="22" width="52" height="12" rx="6" fill="#e8f0ff" />
        <circle cx="86" cy="150" r="6" fill="#ffd1df" />
        <circle cx="108" cy="104" r="5" fill="#ffd1df" opacity=".8" />
        <circle cx="98" cy="70" r="4" fill="#ffd1df" opacity=".6" />
      </g>
      <g transform="rotate(18 160 110)"><g className="floaty" style={{ animationDelay: '-1.5s' }}>
        <rect x="150" y="50" width="24" height="110" rx="12" fill="#d8ffe9" fillOpacity=".35" stroke="#e8fff3" strokeWidth="3" />
        <rect x="153" y="100" width="18" height="56" rx="9" fill="#37e0a0" />
      </g></g>
    </svg>
  )
}

export function SubmarineArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-[200px] w-[200px]" aria-hidden>
      <g className="floaty">
        <ellipse cx="100" cy="104" rx="72" ry="40" fill="#ffd166" />
        <path d="M28 104 Q30 84 52 76 L52 132 Q30 124 28 104Z" fill="#ffb84d" />
        <rect x="86" y="46" width="34" height="32" rx="10" fill="#ff5f8f" />
        <rect x="100" y="32" width="6" height="18" fill="#ff5f8f" />
        <rect x="100" y="28" width="20" height="6" rx="3" fill="#ff5f8f" />
        {[70, 104, 138].map(x => (
          <g key={x}><circle cx={x} cy="100" r="13" fill="#3b2fc9" /><circle cx={x} cy="100" r="9" fill="#8fe8ff" /><circle cx={x - 3} cy="97" r="3" fill="#fff" /></g>
        ))}
        <path d="M168 92 L190 76 L190 132 L168 116Z" fill="#ff5f8f" />
      </g>
      {[[30, 170], [56, 182], [150, 168], [174, 180], [124, 186]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}><g className="floaty" style={{ animationDelay: `${-i}s` }}>
          <ellipse cx="0" cy="0" rx="9" ry="4" fill="#7ad8ff" /><path d="M8 0 L15 -4 L15 4Z" fill="#7ad8ff" />
        </g></g>
      ))}
    </svg>
  )
}

export function OrganismArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-[200px] w-[200px]" aria-hidden>
      <g className="floaty">
        <path d="M44 96 Q44 34 100 34 Q156 34 156 96 Q140 90 128 98 Q114 88 100 98 Q86 88 72 98 Q60 90 44 96Z" fill="#ff8f6b" />
        <path d="M58 70 Q70 46 100 44" stroke="#ffd0bf" strokeWidth="6" fill="none" strokeLinecap="round" />
        {[62, 82, 100, 118, 138].map((x, i) => (
          <path key={x} className="sway" style={{ animationDelay: `${-i * .4}s` }}
            d={`M${x} 96 C${x - 12} 120 ${x + 12} 140 ${x} 176`} stroke="#ffb3c7" strokeWidth="5" fill="none" strokeLinecap="round" />
        ))}
      </g>
      {[[150, 40, 10], [170, 70, 6], [34, 50, 8], [30, 140, 5]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#e8f0ff" strokeWidth="2.5" opacity=".7" />
      ))}
    </svg>
  )
}

export function Logo({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const o = size === 'lg' ? 'w-10 h-10' : 'w-7 h-7'
  const i = size === 'lg' ? 'w-5 h-5' : 'w-3 h-3'
  return (
    <span className={`relative inline-flex ${o} items-center justify-center rounded-full border-2 border-foreground/60`}>
      <span className={`${i} rounded-full border border-primary`} />
      <span className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
    </span>
  )
}

import React, { useState, useRef, useMemo, useEffect } from 'react'

const GRID = '#2A2D3E'
const AXIS = '#8B8FA8'

function sentColor(v) {
  const stops = [[0.30,[255,107,107]],[0.55,[255,179,71]],[0.80,[0,217,163]]]
  if (v <= stops[0][0]) return `rgb(${stops[0][1].join(',')})`
  if (v >= stops[2][0]) return `rgb(${stops[2][1].join(',')})`
  let a = stops[0], b = stops[2]
  for (let i = 0; i < stops.length - 1; i++) {
    if (v >= stops[i][0] && v <= stops[i+1][0]) { a = stops[i]; b = stops[i+1]; break }
  }
  const t = (v - a[0]) / (b[0] - a[0])
  const c = a[1].map((ch, i) => Math.round(ch + (b[1][i] - ch) * t))
  return `rgb(${c.join(',')})`
}

function ChartTip({ tip, children }) {
  if (!tip) return null
  return (
    <div style={{
      position: 'absolute', pointerEvents: 'none', zIndex: 30,
      left: tip.x, top: tip.y,
      transform: 'translate(-50%, -115%)',
      background: 'rgba(20,22,33,0.92)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(108,99,255,0.5)', borderRadius: 9,
      padding: '8px 11px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      fontSize: 12, whiteSpace: 'nowrap',
    }}>
      {children}
    </div>
  )
}

/* ---------- Line Chart: sentiment trend ---------- */
export function LineChart({ data = [], height = 280 }) {
  const ref = useRef()
  const [tip, setTip] = useState(null)
  const [w, setW] = useState(640)

  useEffect(() => {
    const ro = new ResizeObserver(es => setW(es[0].contentRect.width))
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  if (!data.length) return <div style={{height}} className="flex items-center justify-center text-text-2 text-sm">No data</div>

  const padL=38, padR=18, padT=18, padB=34
  const iw = w - padL - padR, ih = height - padT - padB
  const xs = i => padL + (data.length === 1 ? iw/2 : (i/(data.length-1))*iw)
  // data has avgScore (0–1) or score
  const val = d => d.avgScore ?? d.score ?? 0
  const ys = v => padT + ih - v * ih
  const pts = data.map((d, i) => [xs(i), ys(val(d))])
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = `${path} L ${pts[pts.length-1][0]} ${padT+ih} L ${pts[0][0]} ${padT+ih} Z`
  const len = useMemo(() => {
    let l = 0
    for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1])
    return l
  }, [w, data])

  const xLabel = d => d.week || d.department || ''

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <svg width={w} height={height} style={{ display: 'block' }} onMouseLeave={() => setTip(null)}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF6B6B"/>
            <stop offset="45%" stopColor="#FFB347"/>
            <stop offset="100%" stopColor="#00D9A3"/>
          </linearGradient>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(108,99,255,0.28)"/>
            <stop offset="100%" stopColor="rgba(108,99,255,0)"/>
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map(g => (
          <g key={g}>
            <line x1={padL} x2={w-padR} y1={ys(g)} y2={ys(g)} stroke={GRID} strokeWidth="1"/>
            <text x={padL-8} y={ys(g)+4} textAnchor="end" fill={AXIS} fontSize="11">{g.toFixed(2)}</text>
          </g>
        ))}
        <path d={area} fill="url(#lineFill)"/>
        <path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: len, strokeDashoffset: 0 }}/>
        {data.map((d, i) => (
          <g key={i}>
            <text x={xs(i)} y={height-12} textAnchor="middle" fill={AXIS} fontSize="11">{xLabel(d)}</text>
            <circle cx={xs(i)} cy={ys(val(d))} r={tip && tip.i === i ? 6 : 4}
              fill="#0F1117" stroke={sentColor(val(d))} strokeWidth="2.5"
              style={{ transition: 'r .15s', cursor: 'pointer' }}
              onMouseEnter={() => setTip({ i, x: xs(i), y: ys(val(d)), d })}/>
            <rect x={xs(i) - iw/(data.length*2)} y={padT} width={iw/data.length} height={ih} fill="transparent"
              onMouseEnter={() => setTip({ i, x: xs(i), y: ys(val(d)), d })}/>
          </g>
        ))}
      </svg>
      <ChartTip tip={tip}>
        {tip && <>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: AXIS, marginBottom: 3 }}>{xLabel(tip.d)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: sentColor(val(tip.d)), display: 'inline-block' }}/>
            <span style={{ fontWeight: 600 }}>Sentiment {val(tip.d).toFixed(2)}</span>
          </div>
        </>}
      </ChartTip>
    </div>
  )
}

/* ---------- Donut Chart: dept breakdown ---------- */
export function DonutChart({ data = [], total, size = 220 }) {
  const [tip, setTip] = useState(null)
  const [hi, setHi] = useState(null)
  const r = size/2, inner = r*0.62, cx = r, cy = r
  let acc = -Math.PI/2

  const segs = data.map((d, idx) => {
    const frac = d.value / total
    const ang = frac * Math.PI * 2
    const a0 = acc, a1 = acc + ang; acc = a1
    const large = ang > Math.PI ? 1 : 0
    const p = (rad, a) => [cx + rad*Math.cos(a), cy + rad*Math.sin(a)]
    const [x0,y0]=p(r,a0),[x1,y1]=p(r,a1),[x2,y2]=p(inner,a1),[x3,y3]=p(inner,a0)
    const path = `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${inner} ${inner} 0 ${large} 0 ${x3} ${y3} Z`
    return { ...d, path, frac, idx }
  })

  const colors = ['#6C63FF','#00D9A3','#FFB347','#8B83FF','#4CC9F0','#F472B6','#FF6B6B','#36D399']

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} onMouseLeave={() => { setTip(null); setHi(null) }}>
          {segs.map((s, i) => (
            <path key={i} d={s.path} fill={s.color || colors[i % colors.length]}
              style={{ transition: 'opacity .15s', opacity: hi == null || hi === i ? 1 : 0.32, cursor: 'pointer' }}
              onMouseEnter={() => { setHi(i); setTip({ d: s, i }) }}/>
          ))}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {hi != null ? segs[hi].value : total}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: AXIS, marginTop: 4 }}>
              {hi != null ? (segs[hi].dept || segs[hi].department) : 'Responses'}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 8, flex: 1, minWidth: 140 }}>
        {segs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, cursor: 'pointer',
            opacity: hi == null || hi === i ? 1 : 0.5, transition: 'opacity .15s' }}
            onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color || colors[i % colors.length], flexShrink: 0 }}/>
              <span style={{ fontSize: 12, color: AXIS, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.dept || s.department}
              </span>
            </span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{Math.round(s.frac*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Bar Chart: avg sentiment per dept ---------- */
export function BarChart({ data = [], height = 300 }) {
  const ref = useRef()
  const [w, setW] = useState(640)
  const [tip, setTip] = useState(null)

  useEffect(() => {
    const ro = new ResizeObserver(es => setW(es[0].contentRect.width))
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  if (!data.length) return <div style={{height}} className="flex items-center justify-center text-text-2 text-sm">No data</div>

  const padL=38, padR=12, padT=16, padB=58
  const iw = w - padL - padR, ih = height - padT - padB
  const bw = iw / data.length, barW = Math.min(46, bw*0.56)
  const val = d => d.avgScore ?? d.score ?? 0
  const ys = v => padT + ih - v * ih
  const label = d => d.department || d.dept || ''

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <svg width={w} height={height} onMouseLeave={() => setTip(null)}>
        {[0, 0.25, 0.5, 0.75, 1].map(g => (
          <g key={g}>
            <line x1={padL} x2={w-padR} y1={ys(g)} y2={ys(g)} stroke={GRID}/>
            <text x={padL-8} y={ys(g)+4} textAnchor="end" fill={AXIS} fontSize="11">{g.toFixed(2)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + i*bw + (bw-barW)/2
          const h = val(d) * ih
          const col = sentColor(val(d))
          return (
            <g key={i} onMouseEnter={() => setTip({ d, x: x+barW/2, y: ys(val(d)) })}>
              <rect x={x} y={ys(val(d))} width={barW} height={h} rx={5} fill={col}
                style={{ opacity: tip && tip.d !== d ? 0.55 : 1, transition: 'opacity .15s', cursor: 'pointer' }}/>
              <text x={x+barW/2} y={height-padB+18} textAnchor="end" fill={AXIS} fontSize="10.5"
                transform={`rotate(-32 ${x+barW/2} ${height-padB+18})`}>{label(d)}</text>
            </g>
          )
        })}
      </svg>
      <ChartTip tip={tip}>
        {tip && <>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: AXIS, marginBottom: 3 }}>{(tip.d.department || tip.d.dept)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: sentColor(val(tip.d)), display: 'inline-block' }}/>
            <span style={{ fontWeight: 600 }}>{val(tip.d).toFixed(2)} avg</span>
          </div>
        </>}
      </ChartTip>
    </div>
  )
}

/* ---------- Area Chart: response volume ---------- */
export function AreaChart({ data = [], height = 280 }) {
  const ref = useRef()
  const [w, setW] = useState(640)
  const [tip, setTip] = useState(null)

  useEffect(() => {
    const ro = new ResizeObserver(es => setW(es[0].contentRect.width))
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  if (data.length < 2) return <div style={{height}} className="flex items-center justify-center text-text-2 text-sm">No data</div>

  const padL=40, padR=18, padT=18, padB=34
  const iw = w - padL - padR, ih = height - padT - padB
  const vals = data.map(d => d.count ?? d.value ?? 0)
  const max = Math.max(...vals) * 1.12
  const xs = i => padL + (i/(data.length-1)) * iw
  const ys = v => padT + ih - (v/max) * ih
  const pts = data.map((d, i) => [xs(i), ys(vals[i])])
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = `${path} L ${pts[pts.length-1][0]} ${padT+ih} L ${pts[0][0]} ${padT+ih} Z`
  const ticks = [0, Math.round(max/2/10)*10, Math.round(max/10)*10]
  const xLabel = d => d.week || d.department || ''

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <svg width={w} height={height} onMouseLeave={() => setTip(null)}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,217,163,0.32)"/>
            <stop offset="100%" stopColor="rgba(0,217,163,0)"/>
          </linearGradient>
        </defs>
        {ticks.map((g, i) => (
          <g key={i}>
            <line x1={padL} x2={w-padR} y1={ys(g)} y2={ys(g)} stroke={GRID}/>
            <text x={padL-8} y={ys(g)+4} textAnchor="end" fill={AXIS} fontSize="11">{g}</text>
          </g>
        ))}
        <path d={area} fill="url(#areaFill)"/>
        <path d={path} fill="none" stroke="#00D9A3" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {data.map((d, i) => (
          <g key={i}>
            <text x={xs(i)} y={height-12} textAnchor="middle" fill={AXIS} fontSize="11">{xLabel(d)}</text>
            <circle cx={xs(i)} cy={ys(vals[i])} r={tip && tip.i === i ? 5.5 : 3.5}
              fill="#0F1117" stroke="#00D9A3" strokeWidth="2.5"
              style={{ transition: 'r .15s', cursor: 'pointer' }}
              onMouseEnter={() => setTip({ i, x: xs(i), y: ys(vals[i]), d })}/>
            <rect x={xs(i)-iw/(data.length*2)} y={padT} width={iw/data.length} height={ih} fill="transparent"
              onMouseEnter={() => setTip({ i, x: xs(i), y: ys(vals[i]), d })}/>
          </g>
        ))}
      </svg>
      <ChartTip tip={tip}>
        {tip && <>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: AXIS, marginBottom: 3 }}>{xLabel(tip.d)}</div>
          <div style={{ fontWeight: 600 }}><span style={{ color: '#00D9A3' }}>{vals[tip.i]}</span> responses</div>
        </>}
      </ChartTip>
    </div>
  )
}

import { useState, useEffect } from 'react'

const FCR = '#E0291A'
const FCR_DARK = '#b81f10'

const COLORS = [FCR, '#c0392b', '#e74c3c', '#ff6b6b']

function RankingBar({ name, votes, maxVotes, totalVotes, rank, color }) {
  const pct = maxVotes > 0 ? (votes / maxVotes) * 100 : 0
  const isFirst = rank === 1

  return (
    <div style={{
      background: isFirst ? 'rgba(224,41,26,0.08)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isFirst ? 'rgba(224,41,26,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 12,
      padding: '20px 24px',
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            background: isFirst ? FCR : 'rgba(255,255,255,0.1)',
            color: '#fff',
            borderRadius: 8,
            width: 36, height: 36,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 800, flexShrink: 0
          }}>
            {isFirst ? '🏆' : `#${rank}`}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>{name}</span>
        </span>
        <span style={{ fontSize: 18, fontWeight: 700, color: isFirst ? FCR : '#ccc' }}>
          {votes} {votes === 1 ? 'Stimme' : 'Stimmen'} · {totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0}%
        </span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 6,
          transition: 'width 1s ease',
          minWidth: votes > 0 ? 10 : 0
        }} />
      </div>
    </div>
  )
}

export default function App() {
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  async function fetchRanking() {
    try {
      const res = await fetch('/api/ranking')
      const data = await res.json()
      setRanking(data)
      setLastUpdate(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRanking()
    const interval = setInterval(fetchRanking, 10000)
    return () => clearInterval(interval)
  }, [])

  const maxVotes = ranking.length > 0 ? Math.max(...ranking.map(r => r.votes), 1) : 1
  const totalVotes = ranking.reduce((s, r) => s + r.votes, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Hero */}
      <div style={{
        position: 'relative',
        height: 340,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src="/hero.png"
          alt="FC Finsing Linienroboter"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(15,15,15,0.85) 100%)'
        }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
          <img src="/logo.png" alt="FC Finsing Logo" style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: 12, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} />
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 6px', textShadow: '0 2px 8px rgba(0,0,0,0.6)', letterSpacing: -0.5 }}>
            Wie soll unser Linienroboter heißen?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0 }}>
            FC Finsing e.V. · Stimme jetzt per PayPal ab · 2€ = 1 Stimme
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 20px 48px' }}>

        {/* Mitmachen Box */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid rgba(224,41,26,0.3)`,
          borderRadius: 14,
          padding: '20px 24px',
          marginBottom: 24,
          display: 'flex',
          gap: 20,
          alignItems: 'center',
        }}>
          <img
            src="/paypal_qr.jpeg"
            alt="PayPal QR Code"
            style={{ width: 110, height: 110, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '3px solid white' }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, color: FCR }}>⚽ So machst du mit</div>
            <ol style={{ paddingLeft: 18, color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.8 }}>
              <li>QR Code scannen &amp; per PayPal überweisen</li>
              <li>Namen im Verwendungszweck angeben</li>
              <li>2€ = 1 Stimme</li>
            </ol>
          </div>
        </div>

        {/* Gesamtstimmen */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <span style={{ color: '#aaa', fontSize: 14 }}>Gesamte Stimmen</span>
          <span style={{ fontWeight: 900, fontSize: 26, color: FCR }}>{totalVotes}</span>
        </div>

        {/* Ranking */}
        <div>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666', padding: 40 }}>Lade Ranking…</p>
          ) : ranking.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: 40 }}>Noch keine Stimmen – sei der Erste!</p>
          ) : (
            ranking.map((item, i) => (
              <RankingBar
                key={item.name}
                name={item.name}
                votes={item.votes}
                maxVotes={maxVotes}
                totalVotes={totalVotes}
                rank={i + 1}
                color={COLORS[i % COLORS.length]}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, color: '#444', fontSize: 12 }}>
          {lastUpdate && <>Zuletzt aktualisiert: {lastUpdate.toLocaleTimeString('de-DE')} · </>}
          Aktualisiert alle 10 Sekunden
          <br />
          <span style={{ color: '#333', marginTop: 8, display: 'block' }}>FC Finsing e.V. 1956</span>
        </div>
      </div>
    </div>
  )
}

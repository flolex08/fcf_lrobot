import { useState, useEffect } from 'react'

const COLORS = ['#22d3ee', '#f97316', '#a78bfa', '#34d399', '#fb7185', '#fbbf24']

function RankingBar({ name, votes, maxVotes, rank, color }) {
  const pct = maxVotes > 0 ? (votes / maxVotes) * 100 : 0
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 700 }}>
          <span style={{
            background: rank === 1 ? '#fbbf24' : '#334155',
            color: rank === 1 ? '#0f172a' : '#94a3b8',
            borderRadius: 6, width: 32, height: 32,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800
          }}>#{rank}</span>
          {name}
        </span>
        <span style={{ fontSize: 20, fontWeight: 800, color }}>
          {votes} {votes === 1 ? 'Stimme' : 'Stimmen'}
        </span>
      </div>
      <div style={{ background: '#1e293b', borderRadius: 8, height: 18, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 8,
          transition: 'width 0.8s ease',
          minWidth: votes > 0 ? 8 : 0
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
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>
          Wie soll unser Linienroboter heißen?
        </h1>
        <p style={{ color: '#64748b', fontSize: 15 }}>
          Überweise per PayPal · Nenne deinen Favoriten im Verwendungszweck · 2€ = 1 Stimme
        </p>
      </div>

      {/* Total */}
      <div style={{
        background: '#1e293b', borderRadius: 12, padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 32
      }}>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>Gesamte Stimmen</span>
        <span style={{ fontWeight: 800, fontSize: 24 }}>{totalVotes}</span>
      </div>

      {/* Ranking */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 28 }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Lade Ranking…</p>
        ) : ranking.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Noch keine Stimmen – sei der Erste!</p>
        ) : (
          ranking.map((item, i) => (
            <RankingBar
              key={item.name}
              name={item.name}
              votes={item.votes}
              maxVotes={maxVotes}
              rank={i + 1}
              color={COLORS[i % COLORS.length]}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 24, color: '#475569', fontSize: 12 }}>
        {lastUpdate && <>Zuletzt aktualisiert: {lastUpdate.toLocaleTimeString('de-DE')} · </>}
        Aktualisiert alle 10 Sekunden
      </div>
    </div>
  )
}

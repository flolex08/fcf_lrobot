import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const SECRET = process.env.VOTE_SECRET

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // Einfacher Schutz: Make.com muss das Secret mitsenden
  if (req.headers['x-vote-secret'] !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { candidate_name, amount_eur, email_message_id } = req.body

  if (!candidate_name || !amount_eur || !email_message_id) {
    return res.status(400).json({ error: 'Fehlende Felder' })
  }

  const votes = Math.floor(parseFloat(amount_eur) / 2)
  if (votes < 1) return res.status(400).json({ error: 'Betrag zu gering (min. 2€)' })

  // Doppelte E-Mails verhindern
  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('email_message_id', email_message_id)
    .single()

  if (existing) return res.status(200).json({ message: 'Bereits verarbeitet' })

  // Stimmen hinzufügen (case-insensitive Suche)
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id, name, votes')
    .ilike('name', candidate_name.trim())
    .single()

  if (!candidate) {
    return res.status(404).json({ error: `Kandidat "${candidate_name}" nicht gefunden` })
  }

  await supabase
    .from('candidates')
    .update({ votes: candidate.votes + votes })
    .eq('id', candidate.id)

  await supabase.from('payments').insert({
    email_message_id,
    candidate_name: candidate.name,
    amount_eur: parseFloat(amount_eur),
    votes_added: votes,
  })

  return res.status(200).json({ success: true, votes_added: votes, candidate: candidate.name })
}

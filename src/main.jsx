import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, ChevronDown, Copy, Heart, Mail, Sparkles, X } from 'lucide-react'
import './styles.css'

const plans = [
  { label: 'Coffee', icon: '☕' },
  { label: 'A movie', icon: '🎞️' },
  { label: 'Dinner', icon: '✦' },
  { label: 'Walk in the park', icon: '🌿' },
  { label: 'Drinks', icon: '🍸' },
  { label: 'Surprise me', icon: '✿' },
]

const pageMotion = { initial: { opacity: 0, y: 16, scale: .985 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -12, scale: .985 } }

function Flower() {
  return <div className="flower-wrap" aria-hidden="true">
    <div className="flower-shadow" />
    <div className="stem" /><div className="leaf leaf-left" /><div className="leaf leaf-right" />
    <div className="bloom"><i /><i /><i /><i /><i /><b /></div>
  </div>
}

function Confetti() {
  return <div className="confetti" aria-hidden="true">{['♥','✦','♥','•','✦','♥','•','♥','✦'].map((v, i) => <motion.span key={i} initial={{ opacity: 0, y: -26, x: i * 28 }} animate={{ opacity: [0, 1, 1, 0], y: [0, 250], rotate: [0, i % 2 ? -80 : 90] }} transition={{ duration: 2.8 + (i % 3) * .35, delay: i * .13, repeat: Infinity, repeatDelay: .7 }} className={'confetti-piece p' + i}>{v}</motion.span>)}</div>
}

function App() {
  const [screen, setScreen] = useState(1)
  const [dodges, setDodges] = useState(0)
  const [noPos, setNoPos] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [plan, setPlan] = useState('')
  const [copied, setCopied] = useState(false)
  const canSeal = date && time && plan
  const formattedDate = useMemo(() => date ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${date}T12:00:00`)) : 'our chosen day', [date])
  const formattedTime = useMemo(() => time ? new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'our chosen time', [time])
  const letter = `Dear you,\n\nSo... it’s official. It’s a date! Let’s meet on ${formattedDate} at ${formattedTime} for ${plan || 'something lovely'}.\n\nI promise good vibes and my very best self.\n\nSee you there. ♡`

  const dodge = () => {
    const maxX = Math.max(12, window.innerWidth - 115)
    const maxY = Math.max(12, window.innerHeight - 56)
    setNoPos({ left: 12 + Math.random() * (maxX - 12), top: 12 + Math.random() * (maxY - 12) })
    setDodges(n => n + 1)
  }
  const copyLetter = async () => {
    try { await navigator.clipboard.writeText(letter) } catch { const area = document.createElement('textarea'); area.value = letter; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove() }
    setCopied(true); window.setTimeout(() => setCopied(false), 2600)
  }

  return <main className="app-shell">
    <div className="grain" /><div className="sun sun-one" /><div className="sun sun-two" />
    <div className="topbar"><span className="brand"><Heart size={14} fill="currentColor" /> a little invitation</span><span className="step">0{screen} / 04</span></div>
    <AnimatePresence mode="wait">
      {screen === 1 && <motion.section key="ask" {...pageMotion} transition={{ duration: .45 }} className="card ask-card">
        <p className="eyebrow">A TINY ASK</p><h1>Will you go out<br />with me?</h1><Flower />
        <p className="support-copy">No pressure. Just a very cute possibility.</p>
        <div className="ask-actions"><button className="button primary" onClick={() => setScreen(2)}>YES <span>♡</span></button>{!noPos && <button className="button no-button" onMouseEnter={dodge} onFocus={dodge} onTouchStart={dodge}>No</button>}</div>
        <p className="dodge-count">{dodges ? `the “No” has escaped ${dodges} ${dodges === 1 ? 'time' : 'times'}` : 'the “No” looks a little nervous'}</p>
      </motion.section>}
      {screen === 2 && <motion.section key="yay" {...pageMotion} transition={{ duration: .45 }} className="card celebration-card"><Confetti />
        <div className="party-mark"><Heart size={28} fill="currentColor" /></div><p className="eyebrow">THIS IS EXCITING</p><h1>Yay — it’s<br />a date.</h1><p className="lead">I knew you had great taste.</p>
        <div className="mini-hearts">♡ &nbsp; ✦ &nbsp; ♡</div><button className="button primary full-button" onClick={() => setScreen(3)}>Now let’s plan it <span>→</span></button>
      </motion.section>}
      {screen === 3 && <motion.section key="plan" {...pageMotion} transition={{ duration: .45 }} className="card plan-card"><p className="eyebrow">THE FUN PART</p><h1>Pick the day,<br />time &amp; plan.</h1><p className="lead small-lead">Make it ours.</p>
        <div className="input-grid"><label><span>DATE</span><div className="input-wrap"><CalendarDays size={17} /><input aria-label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} /></div></label><label><span>TIME</span><div className="input-wrap"><input aria-label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} /><ChevronDown size={16} /></div></label></div>
        <div className="plan-section"><span>THE PLAN</span><div className="pills">{plans.map(item => <button key={item.label} onClick={() => setPlan(item.label)} className={'pill ' + (plan === item.label ? 'chosen' : '')}><i>{item.icon}</i>{item.label}{plan === item.label && <Check size={14} />}</button>)}</div></div>
        <button disabled={!canSeal} className="button primary full-button seal" onClick={() => setScreen(4)}>Seal it with a letter <Mail size={16} /></button>
      </motion.section>}
      {screen === 4 && <motion.section key="letter" {...pageMotion} transition={{ duration: .45 }} className="letter-view"><div className="letter-stamp"><Heart size={16} fill="currentColor" /></div><p className="eyebrow">ONE FOR THE BOOKS</p><div className="letter-paper"><div className="paper-fold" /><p className="salutation">Dear you,</p><p>So... it’s official. It’s a date! Let’s meet on <strong>{formattedDate}</strong> at <strong>{formattedTime}</strong> for <strong>{plan}</strong>.</p><p>I promise good vibes and my very best self.</p><p className="signoff">See you there. <span>♡</span></p><div className="letter-footer">SAVED WITH A VERY HAPPY HEART</div></div><button className="button primary full-button share" onClick={copyLetter}>{copied ? <><Check size={17} /> Copied to clipboard</> : <><Copy size={16} /> Share the good news</>}</button><button className="start-over" onClick={() => { setScreen(1); setNoPos(null); setDodges(0); setCopied(false) }}>start again</button></motion.section>}
    </AnimatePresence>
    {screen === 1 && noPos && <motion.button initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="runaway-no" style={noPos} onMouseEnter={dodge} onTouchStart={dodge}>No</motion.button>}
    <AnimatePresence>{copied && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="toast"><Check size={16} /> Letter copied — send away! </motion.div>}</AnimatePresence>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)

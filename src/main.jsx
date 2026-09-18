import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, Clock3, Copy, Heart, Mail, MapPin } from 'lucide-react'
import './styles.css'

const plans = [
  { label: 'Cà phê', icon: '☕' }, { label: 'Xem phim', icon: '🎞️' },
  { label: 'Ăn tối', icon: '✦' }, { label: 'Dạo công viên', icon: '🌿' },
  { label: 'Đi uống nước', icon: '🍸' }, { label: 'Để anh chọn', icon: '✿' },
  { label: 'Khác', icon: '♡' },
]
const floatingIcons = ['♡', '✦', '✿', '♥', '☁', '⋆', '❀', '•', '♡', '✧', '♥', '❋']
const pageMotion = { initial: { opacity: 0, y: 16, scale: .985 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -12, scale: .985 } }

function Flower() {
  return <div className="flower-wrap" aria-hidden="true"><div className="flower-shadow" /><div className="stem" /><div className="leaf leaf-left" /><div className="leaf leaf-right" /><div className="bloom"><i /><i /><i /><i /><i /><b /></div></div>
}

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ['♥', '✦', '✿', '•', '◆'][i % 5])
  return <div className="confetti" aria-hidden="true">{pieces.map((v, i) => <motion.span key={i} initial={{ opacity: 0, y: -40, x: 0 }} animate={{ opacity: [0, 1, 1, 0], y: [0, 520], x: [0, (i % 2 ? -1 : 1) * (18 + (i % 4) * 15)], rotate: [0, i % 2 ? -160 : 160] }} transition={{ duration: 3.1 + (i % 5) * .36, delay: i * .09, repeat: Infinity, repeatDelay: .2 }} className={'confetti-piece p' + (i % 9)}>{v}</motion.span>)}</div>
}

function App() {
  const [screen, setScreen] = useState(1)
  const [dodges, setDodges] = useState(0)
  const [noPos, setNoPos] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [plan, setPlan] = useState('')
  const [customPlan, setCustomPlan] = useState('')
  const [place, setPlace] = useState('')
  const [copied, setCopied] = useState(false)
  const chosenPlan = plan === 'Khác' ? customPlan.trim() : plan
  const canSeal = date && /^([01]\d|2[0-3]):[0-5]\d$/.test(time) && chosenPlan
  const formattedDate = useMemo(() => date ? new Intl.DateTimeFormat('vi-VN', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${date}T12:00:00`)) : 'ngày mình chọn', [date])
  const formattedTime = time || 'giờ mình chọn'
  const letter = `Gửi em,\n\nVậy là chính thức rồi nhé. Mình có một cuộc hẹn! Hẹn em vào ${formattedDate} lúc ${formattedTime} để ${chosenPlan || 'cùng nhau có một buổi thật vui'}${place ? ` tại ${place}` : ''}.\n\nAnh hứa sẽ mang theo thật nhiều năng lượng vui vẻ và phiên bản tốt nhất của mình.\n\nHẹn gặp em nhé. ♡`

  const dodge = () => { const maxX = Math.max(12, window.innerWidth - 115); const maxY = Math.max(12, window.innerHeight - 56); setNoPos({ left: 12 + Math.random() * (maxX - 12), top: 12 + Math.random() * (maxY - 12) }); setDodges(n => n + 1) }
  const copyLetter = async () => { try { await navigator.clipboard.writeText(letter) } catch { const area = document.createElement('textarea'); area.value = letter; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove() }; setCopied(true); window.setTimeout(() => setCopied(false), 2600) }

  return <main className="app-shell">
    <div className="grain" /><div className="sun sun-one" /><div className="sun sun-two" />
    <div className="topbar"><span className="brand"><Heart size={14} fill="currentColor" /> một lời mời nhỏ</span><span className="step">0{screen} / 04</span></div>
    <AnimatePresence mode="wait">
      {screen === 1 && <motion.section key="ask" {...pageMotion} transition={{ duration: .45 }} className="card ask-card">
        <div className="icon-sprinkles">{floatingIcons.map((icon, i) => <motion.span key={i} animate={{ y: [0, -8, 0], rotate: [0, i % 2 ? 10 : -10, 0] }} transition={{ duration: 2.2 + i * .08, repeat: Infinity, delay: i * .11 }} className={'sprinkle s' + i}>{icon}</motion.span>)}</div>
        <p className="eyebrow">MỘT LỜI HỎI NHỎ</p><h1>Em đi chơi<br />với anh nhé?</h1><Flower />
        <p className="support-copy">Không áp lực đâu. Chỉ là một khả năng rất đáng yêu.</p>
        <div className="ask-actions"><button className="button primary" onClick={() => setScreen(2)}>ĐỒNG Ý <span>♡</span></button>{!noPos && <button className="button no-button" onMouseEnter={dodge} onFocus={dodge} onTouchStart={dodge}>Không</button>}</div>
        <p className="dodge-count">{dodges ? `Nút “Không” đã chạy trốn ${dodges} lần rồi` : 'Nút “Không” đang hơi ngại ngùng'}</p>
      </motion.section>}
      {screen === 2 && <motion.section key="yay" {...pageMotion} transition={{ duration: .45 }} className="card celebration-card"><Confetti />
        <div className="party-mark"><Heart size={28} fill="currentColor" /></div><p className="eyebrow">VUI QUÁ ĐI MẤT</p><h1>Yay — mình<br />có hẹn rồi.</h1><p className="lead">Anh biết em có gu mà.</p>
        <div className="mini-hearts">♡ &nbsp; ✦ &nbsp; ♡</div><button className="button primary full-button" onClick={() => setScreen(3)}>Mình cùng lên kế hoạch nhé <span>→</span></button>
      </motion.section>}
      {screen === 3 && <motion.section key="plan" {...pageMotion} transition={{ duration: .45 }} className="card plan-card"><p className="eyebrow">ĐẾN PHẦN VUI NHẤT</p><h1>Chọn ngày,<br />giờ và kế hoạch.</h1><p className="lead small-lead">Mình cùng chọn điều thật vui nhé.</p>
        <div className="input-grid"><label><span>NGÀY</span><div className="input-wrap"><CalendarDays size={17} /><input aria-label="Ngày hẹn" type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} /></div></label><label><span>GIỜ (nhập 24 giờ)</span><div className="input-wrap"><Clock3 size={17} /><input aria-label="Giờ hẹn" className="time-text" type="text" inputMode="numeric" placeholder="19:30" maxLength={5} value={time} onChange={e => { const v = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5); setTime(v) }} /></div></label></div>
        <div className="plan-section"><span>KẾ HOẠCH</span><div className="pills">{plans.map(item => <button type="button" key={item.label} onClick={() => setPlan(item.label)} className={'pill ' + (plan === item.label ? 'chosen' : '')}><i>{item.icon}</i>{item.label}{plan === item.label && <Check size={14} />}</button>)}</div></div>
        {plan === 'Khác' && <label className="extra-field"><span>EM MUỐN LÀM GÌ?</span><input type="text" placeholder="Ví dụ: đi triển lãm, chơi bowling..." value={customPlan} onChange={e => setCustomPlan(e.target.value)} /></label>}
        <label className="extra-field"><span><MapPin size={12} /> ĐỊA ĐIỂM (KHÔNG BẮT BUỘC)</span><input type="text" placeholder={plan === 'Cà phê' ? 'Tên quán cà phê em thích' : 'Gợi ý một địa điểm nếu em muốn'} value={place} onChange={e => setPlace(e.target.value)} /></label>
        <button disabled={!canSeal} className="button primary full-button seal" onClick={() => setScreen(4)}>Viết thư hẹn em <Mail size={16} /></button>
      </motion.section>}
      {screen === 4 && <motion.section key="letter" {...pageMotion} transition={{ duration: .45 }} className="letter-view"><div className="letter-stamp"><Heart size={16} fill="currentColor" /></div><p className="eyebrow">MỘT BỨC THƯ NHỎ</p><div className="letter-paper"><div className="paper-fold" /><p className="salutation">Gửi em,</p><p>Vậy là chính thức rồi nhé. Mình có một cuộc hẹn! Hẹn em vào <strong>{formattedDate}</strong> lúc <strong>{formattedTime}</strong> để <strong>{chosenPlan}</strong>{place && <> tại <strong>{place}</strong></>}.</p><p>Anh hứa sẽ mang theo thật nhiều năng lượng vui vẻ và phiên bản tốt nhất của mình.</p><p className="signoff">Hẹn gặp em nhé. <span>♡</span></p><div className="letter-footer">LƯU LẠI BẰNG MỘT TRÁI TIM ĐANG VUI</div></div><button className="button primary full-button share" onClick={copyLetter}>{copied ? <><Check size={17} /> Đã sao chép bức thư</> : <><Copy size={16} /> Chia sẻ tin vui</>}</button><button className="start-over" onClick={() => { setScreen(1); setNoPos(null); setDodges(0); setCopied(false) }}>bắt đầu lại</button></motion.section>}
    </AnimatePresence>
    {screen === 1 && noPos && <motion.button initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="runaway-no" style={noPos} onMouseEnter={dodge} onTouchStart={dodge}>Không</motion.button>}
    <AnimatePresence>{copied && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="toast"><Check size={16} /> Đã sao chép — gửi đi thôi!</motion.div>}</AnimatePresence>
  </main>
}
createRoot(document.getElementById('root')).render(<App />)



import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Lottie from 'react-lottie-player'


const sampleLottie = null 

const THEMES = {
  neutral: { bg: 'bg-gradient-to-br from-gray-50 to-white', color: 'text-gray-800' },
  calm: { bg: 'bg-gradient-to-br from-blue-50 to-indigo-50', color: 'text-blue-900' },
  happy: { bg: 'bg-gradient-to-br from-yellow-50 to-pink-50', color: 'text-pink-900' },
  stressed: { bg: 'bg-gradient-to-br from-green-50 to-emerald-50', color: 'text-green-900' },
}

export default function App() {
  return (
    <div>
      <div style={{ padding: 20 }}>
        <h1 className="text-2xl font-bold mb-4">Mood Sanctuary (Prototype)</h1>
        <ScriptRunner />
      </div>

      <MoodSanctuaryUI />
    </div>
  )
}


function ScriptRunner() {
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)

  const runScript = async () => {
    try {
      setOutput('')
      setRunning(true)
      const response = await fetch('http://localhost:4000/run-script')
      if (!response.ok) {
        setOutput(`Server responded with ${response.status}`)
        setRunning(false)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        const text = await response.text()
        setOutput(text)
        setRunning(false)
        return
      }

      const decoder = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: d } = await reader.read()
        done = d
        if (value) {
          // Use function updater to avoid stale closures
          const chunk = decoder.decode(value, { stream: true })
          setOutput((prev) => prev + chunk)
        }
      }
      setRunning(false)
    } catch (err) {
      setOutput((p) => p + `\n[error] ${err.message}`) 
      setRunning(false)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2 items-center">
        <button
          onClick={runScript}
          disabled={running}
          className={`px-4 py-2 rounded ${running ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          {running ? 'Running...' : 'Run Script'}
        </button>
        <div className="text-sm opacity-80">Streams stdout from server (prototype)</div>
      </div>

      <pre className="mt-3 p-3 bg-black text-white rounded max-h-48 overflow-auto">{output || "(no output yet)"}</pre>
    </div>
  )
}


export function MoodSanctuaryUI() {
  const [mood, setMood] = useState('neutral')
  const [journal, setJournal] = useState('')
  const [entries, setEntries] = useState([])
  const [showChat, setShowChat] = useState(false)
  const [focusSeconds, setFocusSeconds] = useState(25 * 60)
  const focusTimer = useRef(null)
  const [isFocusing, setIsFocusing] = useState(false)
  const [gardenScore, setGardenScore] = useState(0)

  useEffect(() => {
   
    const text = journal.toLowerCase()
    if (text.includes('anx') || text.includes('nerv')) setMood('stressed')
    else if (text.includes('happy') || text.includes('good') || text.includes('yay')) setMood('happy')
    else if (text.includes('calm') || text.includes('relax')) setMood('calm')
    else setMood('neutral')
  }, [journal])

  useEffect(() => {
    if (isFocusing) {
      focusTimer.current = setInterval(() => {
        setFocusSeconds((s) => {
          if (s <= 1) {
            clearInterval(focusTimer.current)
            setIsFocusing(false)
            setGardenScore((g) => g + 1)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(focusTimer.current)
  }, [isFocusing])

  function startFocus(minutes = 25) {
    setFocusSeconds(minutes * 60)
    setIsFocusing(true)
  }

  function stopFocus() {
    clearInterval(focusTimer.current)
    setIsFocusing(false)
  }

  function saveJournal() {
    if (journal.trim() === '') return
    const entry = { id: Date.now(), text: journal.trim(), mood }
    setEntries((e) => [entry, ...e])
    setJournal('')
    setGardenScore((g) => g + 0.5)
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const theme = THEMES[mood] || THEMES.neutral

  return (
    <div className={`${theme.bg} min-h-screen p-6 ${theme.color} transition-colors duration-500`}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Mood Ring + Garden */}
        <aside className="col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl p-6 shadow-lg bg-white/60 backdrop-blur-md">
            <h2 className="text-xl font-semibold">Mood Ring</h2>
            <p className="text-sm opacity-80">Your current emotional snapshot — tap to adjust.</p>

            <div className="mt-4 flex items-center gap-4">
              <MoodRing mood={mood} setMood={setMood} />
              <div>
                <div className="font-medium">{mood.toUpperCase()}</div>
                <div className="text-sm opacity-80">Engagement: {gardenScore.toFixed(1)}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className="py-2 rounded-xl bg-blue-50"
                onClick={() => setShowChat((s) => !s)}
              >
                Open AI Assistant
              </button>
              <button
                className="py-2 rounded-xl bg-green-50"
                onClick={() => startFocus(25)}
              >
                Start Focus
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-lg bg-white/60 backdrop-blur-md">
            <h3 className="font-semibold">Growth Garden</h3>
            <p className="text-sm opacity-80">Your garden grows as you practice self-care.</p>
            <div className="mt-4">
              <Garden score={gardenScore} />
            </div>
          </div>
        </aside>

        {/* Middle column: Cards & Journal */}
        <main className="col-span-2 md:col-span-1 lg:col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl p-6 shadow-lg bg-white/60 backdrop-blur-md">
            <h2 className="text-xl font-semibold">Today</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Card title="Breathing Break" desc="3-min guided breathing" onClick={() => alert('Play breathing guide (prototype)')} />
              <Card title="Journaling" desc="Write about your day" onClick={() => document.getElementById('journal')?.focus()} />
              <Card title="Peer Support" desc="Anonymous forum" onClick={() => alert('Open peer support (prototype)')} />
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-lg bg-white/60 backdrop-blur-md">
            <h3 className="font-semibold">Journal</h3>
            <textarea
              id="journal"
              className="mt-3 w-full rounded-xl p-3 border border-gray-200"
              rows={5}
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="How are you feeling? Write anything..."
            />
            <div className="mt-3 flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-indigo-50" onClick={saveJournal}>Save</button>
              <button className="px-4 py-2 rounded-lg bg-gray-100" onClick={() => setJournal('')}>Clear</button>
            </div>

            {entries.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium">Recent Entries</h4>
                <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {entries.map((en) => (
                    <li key={en.id} className="p-3 rounded-lg bg-white/50 border">
                      <div className="text-sm opacity-80">{en.mood.toUpperCase()}</div>
                      <div className="mt-1">{en.text}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl p-6 shadow-lg bg-white/60 backdrop-blur-md">
            <h3 className="font-semibold">Focus Mode</h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-3xl font-mono">{formatTime(focusSeconds)}</div>
              <div className="flex flex-col gap-2">
                {!isFocusing ? (
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-lg bg-blue-50" onClick={() => startFocus(25)}>25</button>
                    <button className="px-3 py-2 rounded-lg bg-blue-50" onClick={() => startFocus(50)}>50</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-lg bg-red-50" onClick={stopFocus}>Stop</button>
                  </div>
                )}
                <div className="text-sm opacity-80">Streak: {Math.floor(gardenScore)}</div>
              </div>
            </div>
          </div>
        </main>

        {/* Right column: Assistant Chat & Emergency */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl p-6 shadow-lg bg-white/60 backdrop-blur-md h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">AI Assistant</h3>
              <div className="text-sm opacity-80">{showChat ? 'Online' : 'Offline'}</div>
            </div>

            <div className="mt-4 flex-1">
              <AnimatePresence>
                {showChat ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-3 h-64 overflow-auto"
                  >
                    <div className="p-3 rounded-lg bg-gray-50">Hi, I'm here to listen. What's on your mind?</div>
                    <div className="p-3 rounded-lg bg-gray-50">(AI chat messages would appear here in a real build.)</div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 flex items-center justify-center opacity-80">
                    Open the assistant to chat.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4">
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-indigo-50" onClick={() => setShowChat(true)}>Open Chat</button>
                <button className="flex-1 py-2 rounded-lg bg-red-100" onClick={() => alert('Emergency: Call campus counselor (prototype)')}>Emergency</button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-lg bg-white/60 backdrop-blur-md">
            <h3 className="font-semibold">Wellness Tips</h3>
            <ul className="mt-3 space-y-2 text-sm opacity-90">
              <li>• Take a 3-min breathing break every hour.</li>
              <li>• Keep a short nightly journal (even 2 lines).</li>
              <li>• Reach out to a friend once a week.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Floating Emergency Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => alert('Emergency: contacting support (prototype)')}
          className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-br from-red-400 to-pink-500 text-white text-sm font-bold"
        >
          SOS
        </button>
      </div>
    </div>
  )
}

/* --- Reusable small components --- */

function Card({ title, desc, onClick = () => {} }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      className="w-full text-left p-4 rounded-xl shadow-sm bg-white/70 flex justify-between items-center"
      onClick={onClick}
    >
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm opacity-80">{desc}</div>
      </div>
      <div className="text-2xl">›</div>
    </motion.button>
  )
}

function MoodRing({ mood, setMood }) {
  const options = ['calm', 'happy', 'neutral', 'stressed']
  return (
    <div className="flex items-center gap-3">
      <svg width="96" height="96" viewBox="0 0 96 96" className="rounded-full shadow-inner">
        <defs>
          <radialGradient id="g1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle cx="48" cy="48" r="44" fill="url(#g1)" stroke="#e6e6e6" strokeWidth="1" />
        {/* color wheel */}
        {options.map((opt, i) => {
          const angle = (i / options.length) * Math.PI * 2
          const x = 48 + Math.cos(angle) * 28
          const y = 48 + Math.sin(angle) * 28
          const color = opt === 'calm' ? '#60a5fa' : opt === 'happy' ? '#f59e0b' : opt === 'neutral' ? '#94a3b8' : '#34d399'
          return (
            <circle
              key={opt}
              cx={x}
              cy={y}
              r={10}
              fill={color}
              onClick={() => setMood(opt)}
              style={{ cursor: 'pointer' }}
            />
          )
        })}
      </svg>
    </div>
  )
}

function Garden({ score = 0 }) {
  const plants = []
  const total = Math.min(6, Math.floor(score))
  for (let i = 0; i < total; i++) plants.push(i)

  return (
    <div className="flex gap-2 items-end h-24">
      {plants.length === 0 ? (
        <div className="text-sm opacity-70">No growth yet — complete small tasks to grow your garden.</div>
      ) : (
        plants.map((p) => (
          <motion.div
            key={p}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-8"
            transition={{ delay: p * 0.12 }}
          >
            <svg viewBox="0 0 24 48" className="w-full h-24">
              <rect x="8" y="28" width="8" height="20" rx="2" fill="#7c3aed" />
              <circle cx="12" cy="20" r="10" fill="#34d399" />
            </svg>
          </motion.div>
        ))
      )}
    </div>
  )
}

// End of file

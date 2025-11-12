import { useEffect, useRef, useState } from 'react'

const initialStats = () => {
  try{
    return JSON.parse(localStorage.getItem('pomodoroStats')) || { sessions: 0, focusMinutes: 0 }
  }catch{
    return { sessions: 0, focusMinutes: 0 }
  }
}

const DEFAULT_DURATION = 25 * 60

export default function Pomodoro(){
  const [seconds, setSeconds] = useState(DEFAULT_DURATION)
  const [running, setRunning] = useState(false)
  const [stats, setStats] = useState(initialStats)
  const intervalRef = useRef(null)
  const sessionLengthRef = useRef(DEFAULT_DURATION)

  const persistStats = (next) => {
    localStorage.setItem('pomodoroStats', JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('pomodoro:update', { detail: next }))
  }

  const handleSessionComplete = () => {
    setRunning(false)
    const minutes = Math.round(sessionLengthRef.current / 60)
    setStats(s => {
      const updated = { sessions: s.sessions + 1, focusMinutes: s.focusMinutes + minutes }
      persistStats(updated)
      return updated
    })
    sessionLengthRef.current = DEFAULT_DURATION
    setSeconds(DEFAULT_DURATION)
  }

  useEffect(() => {
    if(!running) return
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if(prev <= 1){
          clearInterval(intervalRef.current)
          handleSessionComplete()
          return DEFAULT_DURATION
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  useEffect(() => {
    const handler = (event) => {
      const { action, durationSeconds } = event.detail || {}
      if(action === 'start'){
        const target = durationSeconds || DEFAULT_DURATION
        sessionLengthRef.current = target
        setSeconds(target)
        setRunning(true)
      }
      if(action === 'stop'){
        setRunning(false)
      }
      if(action === 'reset'){
        reset()
      }
    }
    window.addEventListener('pomodoro:command', handler)
    return () => window.removeEventListener('pomodoro:command', handler)
  }, [])

  const reset = () => {
    setRunning(false)
    sessionLengthRef.current = DEFAULT_DURATION
    setSeconds(DEFAULT_DURATION)
  }

  const toggle = () => {
    if(running){
      setRunning(false)
    }else{
      sessionLengthRef.current = seconds || DEFAULT_DURATION
      setRunning(true)
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-title text-slate">Pomodoro Timer</h3>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Focus • Break • Repeat</p>
        </div>
        <div className="text-right text-sm text-muted">
          Sessions Today<br/><span className="text-2xl font-title text-slate">{stats.sessions}</span>
        </div>
      </div>

      <div className="rounded-[32px] bg-gradient-to-r from-primary/10 to-accent/10 border border-border p-10 text-center space-y-4">
        <div className="text-5xl font-title text-slate">{mm}:{ss}</div>
        <p className="text-sm text-muted">Focus Time</p>
        <div className="flex justify-center gap-4">
          <button className="btn btn-primary min-w-[120px]" onClick={toggle}>{running ? 'Pause' : 'Start'}</button>
          <button className="btn border border-border" onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-2xl border border-border p-4 bg-white">
          <p className="text-xs uppercase text-muted">Sessions Today</p>
          <p className="text-2xl font-title text-primary">{stats.sessions}</p>
        </div>
        <div className="rounded-2xl border border-border p-4 bg-white">
          <p className="text-xs uppercase text-muted">Total Focus</p>
          <p className="text-2xl font-title text-slate">{stats.focusMinutes}m</p>
        </div>
      </div>
    </div>
  )
}

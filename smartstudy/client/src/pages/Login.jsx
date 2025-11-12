import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Aside = () => (
  <aside className="bg-gradient-to-b from-primary via-plum to-accent text-white p-10 flex flex-col justify-between">
    <div>
      <p className="text-sm uppercase tracking-[0.4em] text-white/70">Achieve more</p>
      <h2 className="text-3xl font-title leading-snug mt-3">Achieve Your Academic Goals</h2>
      <p className="text-white/80 mt-3">Join thousands of students who plan smarter schedules, stay focused, and rely on AI-powered assistance.</p>
      <ul className="mt-6 space-y-3 text-white/90 text-sm">
        <li>• Smart task management</li>
        <li>• Integrated calendar & notes</li>
        <li>• Pomodoro technique timer</li>
        <li>• AI-powered study partner</li>
      </ul>
    </div>
    <div className="bg-white/10 rounded-2xl p-4 text-sm leading-relaxed">
      “This platform completely changed how I manage my studies. I’m more organized and less stressed.”
      <div className="mt-3 font-semibold">Sarah M. — Computer Science</div>
    </div>
  </aside>
)

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => localStorage.getItem('rememberMe') === '1')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if(ok){
      if(remember) localStorage.setItem('rememberMe', '1')
      else localStorage.removeItem('rememberMe')
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-card rounded-[32px] overflow-hidden shadow-soft border border-border">
        <div className="p-10 md:p-14 space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-muted">Welcome Back</p>
            <h1 className="text-3xl font-title text-slate mt-3">Sign in to SmartStudy</h1>
            <p className="text-muted text-sm mt-2">Continue your productivity journey.</p>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate">Email Address</label>
              <input className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@university.edu" required/>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate">Password</label>
              <input className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required/>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="text-primary font-semibold">Forgot password?</button>
            </div>
            <button className="btn btn-primary w-full">Sign In</button>
          </form>
          <div className="text-center text-sm text-muted">
            Don’t have an account? <Link to="/signup" className="text-primary font-semibold">Sign Up</Link>
          </div>
        </div>
        <Aside/>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

export default function Hero(){
  return (
    <section className="max-w-6xl mx-auto px-4 py-16" id="about">
      <div className="rounded-3xl bg-gradient-to-r from-primary via-plum to-accent text-white p-10 lg:p-16 relative overflow-hidden">
        <div className="max-w-2xl space-y-6">
          <p className="uppercase tracking-[0.3em] text-sm font-label text-white/80">Smart productivity</p>
          <h1 className="text-4xl md:text-5xl font-title leading-tight">
            Focus Better. Study Smarter. Achieve More.
          </h1>
          <p className="text-lg text-white/90">
            A unified workspace with calendar, to-dos, notes, Pomodoro, and an AI assistant that understands your schedule.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/signup" className="btn btn-accent bg-white text-slate font-bold">Get Started Free</Link>
            <Link to="/login" className="btn border border-white/40 text-white/90">Live Demo</Link>
          </div>
          <div className="flex gap-8 text-sm font-semibold">
            <div>
              <div className="text-3xl font-title">10k+</div>
              Active Students
            </div>
            <div>
              <div className="text-3xl font-title">50k+</div>
              Tasks Logged
            </div>
            <div>
              <div className="text-3xl font-title">4.8/5</div>
              User Rating
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 space-y-4 w-64">
          <div className="glass rounded-2xl p-4 text-slate bg-white/90 text-left">
            <p className="text-sm text-muted">Task Completed</p>
            <div className="text-3xl font-bold text-primary">12 / 18</div>
          </div>
          <div className="glass rounded-2xl p-4 bg-white/90">
            <p className="text-sm text-muted">Focus Timer</p>
            <div className="text-3xl font-bold text-slate">25:00</div>
          </div>
          <div className="glass rounded-2xl p-4 bg-white/90">
            <p className="text-sm text-muted">Events Today</p>
            <div className="text-3xl font-bold text-accent">3</div>
          </div>
        </div>
      </div>
    </section>
  )
}

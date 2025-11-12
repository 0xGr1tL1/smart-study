import { useState } from 'react'
import { format } from 'date-fns'
import { sendChat } from '../api/chat'
import { Bot, CheckSquare, MapPin, Send, UserRound } from 'lucide-react'

const suggestions = [
  'Add Algorithms lecture tomorrow 10:00-12:00 room B201',
  'Move calculus assignment to Friday 5pm',
  'Start a 25 minute Pomodoro session',
  'Show my open tasks for this week'
]

const formatDateTime = (iso) => {
  if(!iso) return ''
  try{
    return format(new Date(iso), "EEE, MMM d • h:mm a")
  }catch{
    return iso
  }
}

const formatAssistantResponse = (payload) => {
  if(!payload) return { content: 'No response.' }
  if(payload.error) return { content: payload.error, tone: 'error' }
  if(payload.help) return {
    content: payload.help,
    suggestions: payload.suggestions
  }

  switch(payload.action){
    case 'created':
      return {
        content: `Scheduled "${payload.event?.title}" successfully.`,
        event: payload.event,
        shouldRefreshEvents: true
      }
    case 'updated':
      return {
        content: `Updated "${payload.event?.title}" with the requested changes.`,
        event: payload.event,
        shouldRefreshEvents: true
      }
    case 'deleted':
      return { content: 'Event deleted from your calendar.', shouldRefreshEvents: true }
    case 'list':
      return {
        content: `Here are the events that match your request (${payload.events?.length ?? 0} results).`,
        events: payload.events
      }
    case 'task_created':
      return {
        content: `Added task "${payload.task?.title}".`,
        task: payload.task,
        shouldRefreshTasks: true
      }
    case 'task_updated':
      return {
        content: `Updated task "${payload.task?.title}".`,
        task: payload.task,
        shouldRefreshTasks: true
      }
    case 'task_deleted':
      return {
        content: 'Task removed.',
        shouldRefreshTasks: true
      }
    case 'tasks_list':
      return {
        content: `Here ${payload.tasks?.length === 1 ? 'is' : 'are'} your requested task${payload.tasks?.length === 1 ? '' : 's'} (${payload.tasks?.length ?? 0}).`,
        tasks: payload.tasks
      }
    case 'pomodoro':
      return {
        content: payload.message || 'Pomodoro command acknowledged.',
        pomodoroCommand: payload.command
      }
    default:
      return { content: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2) }
  }
}

export default function Chatbot(){
  const [input, setInput] = useState('')
  const [log, setLog] = useState([
    { role:'assistant', content:'Hi! I noticed you have 3 assignments due this week. Would you like me to build a study schedule?' }
  ])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if(!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    setLog(l => [...l, userMsg])
    setLoading(true)
    try{
      const res = await sendChat(input)
      const formatted = formatAssistantResponse(res)
      if(formatted.shouldRefreshTasks){
        window.dispatchEvent(new CustomEvent('tasks:refresh'))
      }
      if(formatted.shouldRefreshEvents){
        window.dispatchEvent(new CustomEvent('events:refresh'))
      }
      if(formatted.pomodoroCommand){
        window.dispatchEvent(new CustomEvent('pomodoro:command', { detail: formatted.pomodoroCommand }))
      }
      const assistantMsg = { role: 'assistant', ...formatted }
      setLog(l => [...l, assistantMsg])
    }catch(err){
      setLog(l => [...l, { role:'assistant', content: err.response?.data?.error || 'Something went wrong.', tone:'error' }])
    }finally{
      setInput('')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-title text-slate">AI Assistant</h3>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Ask anything about your schedule</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-4 space-y-4 h-[320px] flex flex-col">
        <div className="flex-1 overflow-auto space-y-3 pr-2">
          {log.map((msg, idx)=>(
            <div key={idx} className={`flex ${msg.role==='user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role==='user' ? 'bg-primary text-white' : 'bg-bg-soft text-slate'}`}>
                <div className="flex items-center gap-2 font-semibold mb-1 text-xs uppercase tracking-wide">
                  {msg.role==='user' ? <UserRound size={14}/> : <Bot size={14}/>} {msg.role==='user'?'You':'Smart Assistant'}
                </div>
                <p className={`${msg.tone==='error' ? 'text-error font-semibold' : ''}`}>{msg.content}</p>
                {msg.event && (
                  <div className="mt-3 space-y-1 text-[13px] text-muted">
                    <div className="font-semibold text-slate">{msg.event.title}</div>
                    <div>{formatDateTime(msg.event.start)} → {formatDateTime(msg.event.end)}</div>
                    {(msg.event.location || msg.event.notes) && (
                      <div className="flex items-center gap-2">
                        {msg.event.location && (<><MapPin size={12}/> {msg.event.location}</>)}
                        {msg.event.notes && <span className="text-muted/80">• {msg.event.notes}</span>}
                      </div>
                    )}
                  </div>
                )}
                {msg.events && (
                  <div className="mt-3 space-y-2">
                    {msg.events.map(evt => (
                      <div key={evt._id} className="rounded-xl border border-border bg-white text-slate px-3 py-2">
                        <div className="font-semibold">{evt.title}</div>
                        <div className="text-xs text-muted">{formatDateTime(evt.start)} → {formatDateTime(evt.end)}</div>
                        {evt.location && <div className="text-xs text-muted flex items-center gap-1"><MapPin size={10}/> {evt.location}</div>}
                      </div>
                    ))}
                  </div>
                )}
                {msg.task && (
                  <div className="mt-3 rounded-xl border border-border bg-white text-slate px-3 py-2 flex items-start gap-3">
                    <CheckSquare size={16} className={msg.task.done ? 'text-primary' : 'text-muted'}/>
                    <div>
                      <div className="font-semibold">{msg.task.title}</div>
                      {msg.task.due && <div className="text-xs text-muted">Due {formatDateTime(msg.task.due)}</div>}
                      {msg.task.notes && <div className="text-xs text-muted">Notes: {msg.task.notes}</div>}
                    </div>
                  </div>
                )}
                {msg.tasks && (
                  <div className="mt-3 space-y-2">
                    {msg.tasks.map(task => (
                      <div key={task._id} className="rounded-xl border border-border bg-white text-slate px-3 py-2">
                        <div className="font-semibold flex items-center gap-2">
                          <CheckSquare size={14} className={task.done ? 'text-primary' : 'text-muted'}/>
                          {task.title}
                        </div>
                        {task.due && <div className="text-xs text-muted">{formatDateTime(task.due)}</div>}
                        {task.notes && <div className="text-xs text-muted">Notes: {task.notes}</div>}
                      </div>
                    ))}
                  </div>
                )}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.suggestions.map((text, i)=>(
                      <button key={i} onClick={()=>setInput(text)} className="px-3 py-1 rounded-full border border-border text-xs bg-white text-slate hover:border-primary">
                        {text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-muted">Thinking...</div>}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder='e.g., "Plan 2 Pomodoro sessions for Math"'
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') send() }}
          />
          <button className="btn btn-primary flex items-center gap-2" onClick={send} disabled={loading}>
            Send <Send size={16}/>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          {suggestions.map(text => (
            <button key={text} onClick={()=>setInput(text)} className="px-3 py-1 bg-bg-soft rounded-full border border-border text-left">
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

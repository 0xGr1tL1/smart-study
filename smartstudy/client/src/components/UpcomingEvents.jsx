import { useEffect, useMemo, useState } from 'react'
import { listEvents } from '../api/events'
import { CalendarDays, Clock3, MapPin } from 'lucide-react'

const dateFormatter = new Intl.DateTimeFormat('en-US', { weekday:'short', month:'short', day:'numeric' })
const timeFormatter = new Intl.DateTimeFormat('en-US', { hour:'numeric', minute:'2-digit' })

export default function UpcomingEvents(){
  const [events, setEvents] = useState([])

  useEffect(()=>{
    (async ()=>{
      const data = await listEvents()
      setEvents(data)
    })()
  }, [])

  const upcoming = useMemo(()=>(
    events
      .map(evt => ({ ...evt, start: new Date(evt.start), end: new Date(evt.end) }))
      .filter(evt => evt.start >= new Date())
      .sort((a,b)=>a.start - b.start)
      .slice(0,3)
  ), [events])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-primary" size={20}/>
          <h3 className="text-lg font-title text-slate">Upcoming Events</h3>
        </div>
        <span className="text-sm text-muted">{events.length} total</span>
      </div>
      <div className="space-y-3">
        {upcoming.map(evt => (
          <div key={evt._id} className="rounded-2xl border border-border p-4 bg-white flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate">{evt.title}</p>
              <p className="text-xs text-muted flex items-center gap-2 mt-1">
                <Clock3 size={12}/> {dateFormatter.format(evt.start)} · {timeFormatter.format(evt.start)}
              </p>
            </div>
            <div className="text-xs text-muted flex items-center gap-1">
              {evt.location && (<><MapPin size={12}/> {evt.location}</>)}
              {!evt.location && evt.type && <span className="pill capitalize">{evt.type}</span>}
            </div>
          </div>
        ))}
        {upcoming.length===0 && (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-muted text-sm">
            No upcoming events. Use the calendar to add one!
          </div>
        )}
      </div>
    </div>
  )
}

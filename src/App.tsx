import './App.css'
import { useState } from 'react'
import {
  useSession,
  useSupabaseClient,
  useSessionContext
} from '@supabase/auth-helpers-react'
import DateTimePicker from 'react-datetime-picker'

function App() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const { isLoading } = useSessionContext()

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [eventName, setEventName] = useState('')
  const [eventDescription, setEventDescription] = useState('')

  if (isLoading) return <h1>Loading...</h1>

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    })

    if (error) {
      alert('Error logging in to Google provider with Supabase')
      console.log(error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const createGoogleCalendarEvent = async () => {
    const body = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }

    await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.provider_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )
      .then(data => {
        return data.json()
      })
      .then(data => {
        console.log(data)

        if (data.error) return alert('Houve um erro ao registrar')

        alert('Event created successfully, check your Google Calendar')
        setEventName('')
        setEventDescription('')
      })
  }

  return (
    <div className="App">
      <div className="container">
        {session ? (
          <>
            <h1> Hey there {session.user.email}</h1>

            <div>
              <h2>Event name</h2>
              <input
                type="text"
                onChange={e => setEventName(e.target.value)}
                value={eventName}
                autoFocus
              />
            </div>
            <div>
              <h2>Event description</h2>
              <input
                type="text"
                onChange={e => setEventDescription(e.target.value)}
                value={eventDescription}
              />
            </div>

            <div>
              <h2>Event starts at</h2>
              <DateTimePicker
                value={startDate}
                onChange={setStartDate}
                format="dd-MMM-y h:mm:ss a"
              />
            </div>

            <div>
              <h2>Event ends at</h2>
              <DateTimePicker
                value={endDate}
                onChange={setEndDate}
                format="dd-MMM-y h:mm:ss a"
              />
            </div>
            <hr />
            <button onClick={createGoogleCalendarEvent}>
              Create Calendar Event
            </button>
            <hr />
            <button onClick={signOut}>Sign out</button>
          </>
        ) : (
          <>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          </>
        )}
      </div>
    </div>
  )
}

export default App

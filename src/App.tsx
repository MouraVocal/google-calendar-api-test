import './styles/App.css'
import './styles/DateTimePicker.css'
import './styles/Calendar.css'
import './styles/Clock.css'
import { useState } from 'react'
import {
  useSession,
  useSupabaseClient,
  useSessionContext
} from '@supabase/auth-helpers-react'
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle'
import { Button, TextInput } from '@mouravocal/react'

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
        <h1>Google Calendar Event Creation</h1>
        {session ? (
          <>
            <div className="header">
              <h3> Hi there, {session.user.user_metadata.full_name}</h3>
              <Button variant="secondary" onClick={signOut}>
                Sign out
              </Button>
            </div>

            <div>
              <h2>Event name</h2>
              <TextInput
                type="text"
                onChange={e => setEventName(e.target.value)}
                value={eventName}
                autoFocus
              />
            </div>
            <div>
              <h2>Event description</h2>
              <TextInput
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
                format="dd MMM y h:mm a"
              />
            </div>

            <div>
              <h2>Event ends at</h2>
              <DateTimePicker
                value={endDate}
                onChange={setEndDate}
                format="dd MMM y h:mm a"
              />
            </div>
            <div className="divider">
              <hr />
            </div>

            <div className="buttonContainer">
              <Button onClick={createGoogleCalendarEvent}>
                Create Calendar Event
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2>Please login with your google account</h2>
            <div className="buttonContainer">
              <Button onClick={signInWithGoogle}>Sign in with Google</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App

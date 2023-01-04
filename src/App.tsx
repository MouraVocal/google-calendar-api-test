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

  console.log(session)

  return (
    <div className="App">
      <div className="container">
        {session ? (
          <>
            <h1> Hey there {session.user.email}</h1>

            <div>
              <h2>Event name</h2>
              <input type="text" name="eventName" id="eventName" />
            </div>
            <div>
              <h2>Event description</h2>
              <input
                type="text"
                name="eventDescription"
                id="eventDescription"
              />
            </div>

            <div>
              <h2>Event starts at</h2>
              <DateTimePicker value={startDate} onChange={setStartDate} />
            </div>

            <div>
              <h2>Event ends at</h2>
              <DateTimePicker value={endDate} onChange={setEndDate} />
            </div>
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

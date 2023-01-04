import './App.css'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

function App() {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div className="App">
      <h1>Google Calendar API Test</h1>
    </div>
  )
}

export default App

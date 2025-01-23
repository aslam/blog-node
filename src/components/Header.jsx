import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const [token, setToken] = useAuth()

  if (token) {
    const { sub } = jwtDecode(token)
    return (
      <div>
        Logged in as <b>{sub}</b>
        <br />
        <button onClick={() => setToken(null)}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      <Link to='/login'>Log In</Link> | <Link to='/signup'>Sign Up</Link>
    </div>
  )
}

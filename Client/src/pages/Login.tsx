import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  let [error, setError] = useState<string | null>(null)
  let [success, setSuccess] = useState<string | null>(null)
  let [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  // React 19's action prop gives you the freedom to just take a FormData element and use it without constructing it. 😮‍💨
  const handleSubmit = (formData: FormData) => {
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    login_user(username, password)
  }

  type LoginResponse = {                                                                                                
    message: string
  }

  async function login_user(username: string, password: string | number | symbol) {
    try {
      setLoading(true)
      let response = await fetch('/api/loginUser', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({                                                                                                  
          username: username,                                                                                                   
          password: password                                                                                                    
        }) 
      })

      if (!response.ok) {
        let data = await response.json()
        setError(data.message)
        return
      }

      let data: LoginResponse = await response.json()
      setSuccess(data.message)
      setTimeout(()=> {
        navigate('/dashboard')
      }, 1000)
      
    } catch (error){
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <main id="container">
        <form className='login-signup-page' action={handleSubmit}>
          <h1>Login</h1>
          
          <div className='login-signup-component'>
            <label>Username</label><br />
            <input name='username' type="text" placeholder='Username' /><br />
          </div>

          <div className='login-signup-component'>
            <label>Password</label><br />
            <input name='password' type="text" placeholder='Password'/>
          </div>

          <h5 className={error ? 'errorMessage' : success ? 'successMessage' : ''}>
            {error || success}
          </h5>

          <div className="login-signup-buttons">
            <button type='submit'>Login</button>
            <button>Sign up</button>
          </div>
          
        </form>
      </main>
    </>
  )
}

import {useContext, createContext, useState, useEffect} from 'react';

interface UserContextType {
  data: string[]
  message: string
  setData: (data: string[]) => void
}

const userContext = createContext<UserContextType | null>(null)

export default function UserDataContextProvider({children}: {children: React.ReactNode }){
  let [data, setData] = useState<string[]>([])
  let [loading, setLoading] = useState<boolean>(false)
  let [error, setError] = useState<boolean>(false)

  let message: string = 'hello everyone!'
  
  useEffect(()=> {
    // Getting controller for the cleanup function
    const controller = new AbortController()
    
    async function retrieveUserData(){
      try {
        setLoading(true)
        let response = await fetch('api/users')
        
        if (!response.ok) {
          setError(true)
          throw new Error('Bad request!')
        }
        
        let data = await response.json()
        setData(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    retrieveUserData()

    // Clean up function
    return ()=> controller.abort()
  }, [])
  
  return (
    <userContext.Provider value={{
      data,
      message,
      setData,
    }}>
      {children}
    </userContext.Provider>
  )
}

export let useData =()=> {
  let context = useContext(userContext)
  return context
} 
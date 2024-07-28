import { useEffect, useState } from 'react'
import './App.css'
import ListHeader from './Components/ListHeader'
import ListItem from './Components/ListItem'
import Auth from './Components/Auth'
import { useCookies } from 'react-cookie'

const App = () => {

  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [tasks, setTasks] = useState(null)
  const user_email = cookies.Email
  const authToken = cookies.AuthToken

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVERURL}/todos/${user_email}`)
      const json = await response.json()
      setTasks(json)
    } catch (err) {

    }
  }

  useEffect(() => {
    if (authToken) {
      fetchData()
    }
   
  }, [])
  

  //Sort by date

  const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date))

  console.log(tasks)

  return (
    <div className='app'>
      {!authToken && <Auth /> }
      {authToken && 
      <>
        <ListHeader listname={'Todo list'} tasks = {tasks}
        getData = {fetchData}/>
        <p className='user-email'>Welcome back {cookies.Email}</p>
        {sortedTasks?.map((task) => <ListItem key = {task.id} task = {task} getData = {fetchData} />)}
      </>}

      </div>
  )
}

export default App

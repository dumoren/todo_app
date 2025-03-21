import React, {useState} from 'react'
import TickIcon from './TickIcon'
import ProgressBar from './ProgressBar'
import Modal from './Modal'

const ListItem = ({task, getData}) => {

  const [showModal, setShowModal] = useState(false)
  const deleteItem = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVERURL}/todos/${task.id}`, {
        method: 'DELETE'
      })
      if (response.status === 200) {
        getData()
      }
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <li className='list-item'>
      <div className='info-container'>
        <TickIcon />
        <p className='task-title'>{task.title}</p>
        <ProgressBar progress={task.progress}/>
      </div>

      <div className="button-container">
        <button className='edit' onClick={() => {setShowModal(true)}}>EDIT</button>
        <button className='delete' onClick = {deleteItem}>DELETE</button>
      </div>
      {showModal && <Modal mode={'edit'} setShowModal={setShowModal} task = {task} getData = {getData}/>}
    </li>
    
  )
}

export default ListItem
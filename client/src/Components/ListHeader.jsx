import React, { useState } from 'react'
import Modal from './Modal'
import { useCookies } from 'react-cookie'

const ListHeader = ({ listname, tasks, getData }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const signout = () => {
    removeCookie('Email')
    removeCookie('AuthToken')
    window.location.reload()
  }
  const [showModal, setShowModal] = useState(false)
  return (
    <div className='list-header'>
      <h1>{listname}</h1>
      <div className="button-container">
        <button className='create' onClick={() => setShowModal(true)}>ADD NEW</button>
        <button className='signout' onClick={signout}>Sign Out</button>
      </div>
      {showModal && <Modal mode = {"create"} setShowModal = {setShowModal} getData = {getData}/>}
    </div>
  )
}

export default ListHeader
import React from 'react'

const ListHeader = ({ listname }) => {

  const signout = () => {
    console.log(new Date())
  }
  return (
    <div className='list-header'>
      <h1>{listname}</h1>
      <div className="button-container">
        <button className='create'>ADD NEW</button>
        <button className='signout' onClick={signout}>Sign Out</button>
      </div>
    </div>
  )
}

export default ListHeader
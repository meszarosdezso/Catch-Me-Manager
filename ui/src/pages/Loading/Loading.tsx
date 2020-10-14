import React from 'react'
import './Loading.scss'
import busGIF from '../../assets/bus.gif'

const LoadingPage: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="LoadingPage">
      <img src={busGIF} alt="bus" /> <br />
      <p>{text}</p>
    </div>
  )
}

export default LoadingPage

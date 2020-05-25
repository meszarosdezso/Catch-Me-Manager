import React from "react"
import "./Loading.scss"
import { PulseLoader } from "react-spinners"

export default function LoadingPage() {
  return (
    <div id="LoadingPage">
      <h1>Loading</h1>
      <PulseLoader />
    </div>
  )
}

import React from "react"
import "./Footer.scss"

const Footer: React.FC = () => {
  return (
    <footer id="Footer">
      Made by
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/Sh4rK"
        id="antal"
      >
        {" "}
        Antal Szabo{" "}
      </a>
      <span id="heart">❤</span>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/meszarosdezso"
        id="dezso"
      >
        {" "}
        Dezso Meszaros
      </a>
    </footer>
  )
}

export default Footer

import React from "react"
import "./Header.scss"
import { Link } from "react-router-dom"
import logo from "../../assets/logo120.png"
import logo_colored from "../../assets/logo_colored120.png"
import { useChangelog } from "../../providers/changelog.provider"

const Header: React.FC<{ showUpload?: boolean }> = ({ showUpload = true }) => {
  const { version } = useChangelog()

  return (
    <header id="Header">
      <Link style={{ display: "flex", alignItems: "center" }} to="/">
        <div className="logo">
          <img id="logo" src={logo} alt="Logo" />
          <img id="logo_colored" src={logo_colored} alt="Logo" />
        </div>

        <h1 id="main-title">
          Catch Me <span id="creator"> Creator</span>
        </h1>
      </Link>

      {showUpload ? (
        <Link id="upload-link" to="/upload">
          Upload new data
        </Link>
      ) : null}

      <Link to="/changelog">
        <h3
          style={{ marginLeft: showUpload ? "unset" : "auto" }}
          id="app-version"
        >
          {version}
        </h3>
      </Link>
    </header>
  )
}

export default Header

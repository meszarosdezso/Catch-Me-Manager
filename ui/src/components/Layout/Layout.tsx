import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo120.png'
import logo_colored from '../../assets/logo_colored120.png'
import { useChangelog } from '../../providers/changelog.provider'
import './Layout.scss'

type Props = {
  title?: string
  showUpload?: boolean
  showVersion?: boolean
}

const Layout: React.FC<Props> = ({
  children,
  title,
  showUpload = true,
  showVersion = true,
}) => {
  useEffect(() => {
    document.title = title ? `${title} | Catch Me Creator` : 'Catch Me Creator'
  }, [title])

  const { version } = useChangelog()

  return (
    <div className="Layout">
      <header>
        <Link style={{ display: 'flex', alignItems: 'center' }} to="/">
          <div className="logo">
            <img id="logo" src={logo} alt="Logo" />
            <img id="logo_colored" src={logo_colored} alt="Logo" />
          </div>
        </Link>

        {title ? (
          <h1 id="main-title">{title}</h1>
        ) : (
          <h1 id="main-title">
            <span id="catchme"> Catch Me</span> Creator
          </h1>
        )}

        {showUpload ? (
          <Link id="upload-link" to="/upload">
            Upload new data
          </Link>
        ) : null}

        {showVersion ? (
          <Link
            id="app-version"
            style={{ marginLeft: showUpload ? 'unset' : 'auto' }}
            to="/changelog"
          >
            <h3>{version}</h3>
          </Link>
        ) : null}
      </header>
      <div className="body">{children}</div>
      <footer id="Footer">
        Made by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Sh4rK"
          id="antal"
        >
          {' '}
          Antal Szabo{' '}
        </a>
        <span id="heart">❤</span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/meszarosdezso"
          id="dezso"
        >
          {' '}
          Dezso Meszaros
        </a>
      </footer>
    </div>
  )
}

export default Layout

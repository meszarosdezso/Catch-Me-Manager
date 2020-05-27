import React from "react"
import "./404.scss"
import Layout from "../../components/Layout/Layout"

const Error404: React.FC = () => {
  return (
    <Layout showUpload={false} showVersion={false}>
      <div className="Error404">
        <h1>
          <span id="code">404</span>| Stop not found
        </h1>
      </div>
    </Layout>
  )
}

export default Error404

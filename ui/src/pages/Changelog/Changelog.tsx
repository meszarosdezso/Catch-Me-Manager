import React from "react"
import "./Changelog.scss"
import { useChangelog } from "../../providers/changelog.provider"

export default function Changelog() {
  const { commits } = useChangelog()

  return (
    <div className="ChangelogPage">
      <h1>Changelog</h1>
      {commits.map((commit) => (
        <div key={commit.message} className="commit">
          <h4 className="message">{commit.message}</h4>
          <h6 className="date">
            {commit.date.toLocaleDateString()}・{commit.author}{" "}
          </h6>
        </div>
      ))}
    </div>
  )
}

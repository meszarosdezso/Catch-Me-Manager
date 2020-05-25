import { createContext, useContext } from "react"
import { Commit } from "../interfaces"
import React from "react"
import useFetch from "../utils/useFetch"
import LoadingPage from "../pages/Loading/Loading"

type Props = {
  version: string
  commits: Commit[]
}

const ChangelogContext = createContext<Props>({} as Props)

const ChangelogProvider: React.FC = ({ children }) => {
  const version = "0.2.0"

  const [loading, commits] = useFetch(
    `https://api.github.com/repos/meszarosdezso/Catch-Me-creator/commits?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`
  )

  const parseCommits = (commits: []) => {
    return commits.map<Commit>(({ commit }: any) => {
      return {
        message: commit.message,
        author: commit.author.name,
        date: new Date(commit.author.date),
      }
    })
  }

  return loading ? (
    <LoadingPage />
  ) : (
    <ChangelogContext.Provider
      value={{ commits: parseCommits(commits), version }}
    >
      {children}
    </ChangelogContext.Provider>
  )
}

export default ChangelogProvider

export const useChangelog = () => useContext(ChangelogContext)

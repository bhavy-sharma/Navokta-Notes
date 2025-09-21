// /app/semester/page.js
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import SemesterClient from './SemesterClient'

export default function SemesterPage() {
  return <SemesterClient />
}
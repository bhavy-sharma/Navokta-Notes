// /app/subject/page.js — SERVER COMPONENT
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import SubjectClient from './SubjectClient'

export default function SubjectPage() {
  return <SubjectClient />
}
export interface Application {
  id: number
  client: string
  role: string
  status: string
  date: string
}

export const applications: Application[] = [
  {
    id: 1,
    client: 'Terra.do',
    role: 'Growth Strategy Lead',
    status: 'On hold',
    date: 'Applied Nov 14',
  },
]

import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // TODO: Replace with actual database query
  return [
    {
      id: '1',
      name: 'Summer Swing Festival',
      date: '2024-07-15',
      status: 'registration_open',
      dancerCount: 42,
      judgeCount: 3,
      totalRounds: 3
    },
    {
      id: '2',
      name: 'Winter Blues',
      date: '2024-02-20',
      status: 'in_progress',
      dancerCount: 64,
      judgeCount: 5,
      totalRounds: 3,
      currentRound: 2
    }
  ]
}) 
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // TODO: Replace with actual database query
  return [
    {
      id: '1',
      competitionId: '1',
      competitionName: 'Summer Swing Festival',
      date: '2024-07-15',
      round: 'preliminary',
      status: 'pending',
      pairsToJudge: 24
    },
    {
      id: '2',
      competitionId: '2',
      competitionName: 'Winter Blues',
      date: '2024-02-20',
      round: 'final',
      status: 'in_progress',
      pairsToJudge: 6,
      completedPairs: 2
    }
  ]
}) 
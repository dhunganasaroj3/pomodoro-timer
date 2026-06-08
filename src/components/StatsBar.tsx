interface Props {
  today: number
  allTime: number
  totalMinutes: number
}

export function StatsBar({ today, allTime, totalMinutes }: Props) {
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-value">{today}</span>
        <span className="stat-label">Today</span>
      </div>
      <div className="stat">
        <span className="stat-value">{allTime}</span>
        <span className="stat-label">All time</span>
      </div>
      <div className="stat">
        <span className="stat-value">
          {hours > 0 ? `${hours}h ` : ''}
          {mins}m
        </span>
        <span className="stat-label">Focused</span>
      </div>
    </div>
  )
}

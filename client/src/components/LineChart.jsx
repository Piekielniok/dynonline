import { Line } from 'react-chartjs-2';

function LineChart({ chartData }) {
  return (
    <div className="chart-container">
      <Line data={chartData} options={{ plugins: { legend: { display: false } } }} />
    </div>
  )
}

export default LineChart;
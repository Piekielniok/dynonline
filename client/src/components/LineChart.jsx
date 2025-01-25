import { Line } from 'react-chartjs-2';

function LineChart({ chartData, chartOptions }) {
  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default LineChart;
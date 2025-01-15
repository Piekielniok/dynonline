import { Line } from 'react-chartjs-2';

function LineChart({ chartData }) {
  const chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "RPM"
        }
      },
      y: {
        title: {
          display: true,
          text: "Nm, KM"
        }
      }
    }
  }
  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default LineChart;
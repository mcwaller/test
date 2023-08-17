import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, ...other }) {
  // Convert the chartLabels to use time format (HH:mm)
  const timeFormatLabels = chartLabels.map((time) => time.substring(0, 5)); // Assuming the original labels are in "HH:mm:ss" format

  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: '16%' } },
    stroke: {
      curve: 'smooth',
    },
    fill: { type: chartData.map((i) => i.fill) },
    labels: timeFormatLabels, // Use the modified time format labels
    xaxis: { type: 'category' }, // Change x-axis type to 'category' since we are using time labels
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} %`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

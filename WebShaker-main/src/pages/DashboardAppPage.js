import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Alert } from '@mui/material';
// components
// sections
import { useLocation } from 'react-router-dom';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------
/* async function logMovies() {
  const response = await fetch('http://localhost:3001/dashboard/app');
  const movies = await response.json();
  console.log(movies);
} */

export default function DashboardAppPage() {
  const theme = useTheme();
  const [mongoValues, setMongoValues] = useState([]);
  const [earthMoist, setEarthMoist] = useState([]);
  const [airMoisture, setAirMoisture] = useState([]);
  const [airTemperature, setAirTemperature] = useState([]);
  const [luxValues, setLuxianValues] = useState([]);
  const [alertThreshold, setAlertThreshold] = useState(0);
  const location = useLocation();
  const userEmail = location.state?.email || localStorage.getItem('userEmail');

  const fetchData = async () => {
    try {
      const [alertResponse, sensorResponse] = await Promise.all([
        axios.get('http://localhost:3011/api/alert/alert'),
        axios.get('http://localhost:3011/api/depart/departamentos'),
      ]);

      // Process alert data
      const alertDataFromServer = alertResponse.data;
      const sourceValues = alertDataFromServer.map((item) => item.source);
      const highestSourceValue = Math.max(...sourceValues);
      setAlertThreshold(highestSourceValue);
      console.log(highestSourceValue);

      // Process sensor data
      const sensorData = sensorResponse.data.slice(-12);
      setMongoValues(sensorData.map((item) => item.DATE_TIME));
      setEarthMoist(sensorData.map((item) => parseInt(item.HUM, 10)));
      setAirMoisture(sensorData.map((item) => parseInt(item.RH, 10)));
      setLuxianValues(sensorData.map((item) => parseInt(item.LUX, 10)));
      setAirTemperature(sensorData.map((item) => parseInt(item.T, 10)));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  /* const fetchSensorData = () => {
    axios
      .get('http://localhost:3011/api/depart/departamentos')
      .then((response) => {
        console.log(response);
        // Assuming the API response is an array of objects
        const data = response.data.slice(-12);

        // Process the data and update the state arrays
        setMongoValues(data.map((item) => item.DATE_TIME));
        setEarthMoist(data.map((item) => parseInt(item.HUM, 10)));
        setAirMoisture(data.map((item) => parseInt(item.RH, 10)));
        setLuxianValues(data.map((item) => parseInt(item.LUX, 10)));
        setAirTemperature(data.map((item) => parseInt(item.T, 10)));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchSensorData();

    const interval = setInterval(() => {
      fetchSensorData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []); */
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back {userEmail}
        </Typography>
        {alertThreshold <= earthMoist[11] && (
          <Alert variant="outlined" severity="warning" sx={{ marginBottom: 5 }}>
            This is a warning alert — It seems that your plants are recieving more water than they should! Current earth
            moist: ({earthMoist[11]}%) || Current threshold {alertThreshold}%
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Greenhouses" total={1} icon={'simple-icons:homeassistant'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Modules" total={1} color="info" icon={'simple-icons:esphome'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Plants" total={2} color="warning" icon={'cil:plant'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Notes" total={'none'} color="error" icon={'ant-design:woman-outlined'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Module Overview"
              subheader="Quick gathering of the last 24 hours"
              chartLabels={
                mongoValues
                // Assuming it's a 24-hour format
              }
              chartData={[
                {
                  name: 'Earth Humidity',
                  type: 'line',
                  fill: 'solid',
                  data: earthMoist,
                },
                {
                  name: 'Air Temperature',
                  type: 'line',
                  fill: 'solid',
                  data: airTemperature,
                },
                {
                  name: 'Air Humidity',
                  type: 'line',
                  fill: 'solid',
                  data: airMoisture,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current values"
              chartData={[
                { label: 'Earth Humidity', value: earthMoist[11] },
                { label: 'Air Humidity', value: airMoisture[11] },
                { label: 'Air Temperature', value: airTemperature[11] },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

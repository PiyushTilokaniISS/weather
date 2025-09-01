import React, { useState } from 'react';
import './App.css';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Card, CardContent } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

interface WeatherData {
  cod: string;
  name: string;
  main: {
    temp: number;
  };
  weather: { description: string }[];
}

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>('');

  const getWeather = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && city.trim()) {
      if (!API_KEY) {
        alert('API key is missing!');
        return;
      }
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
          setWeatherData(data);
          setCity('');
        });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h3" align="center" gutterBottom color="primary">
          <WbSunnyIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Weather App
        </Typography>
        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} mb={3}>
          <TextField
            label="Enter city name"
            variant="outlined"
            fullWidth
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={getWeather}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => city.trim() && getWeather({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>)}
            sx={{ minWidth: 120 }}
          >
            Get Weather
          </Button>
        </Box>
        {!weatherData || !weatherData.main ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Welcome to my weather app! Enter a city to get its weather.
          </Alert>
        ) : (
          <Card sx={{ mt: 2, bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h5" color="text.primary" gutterBottom>
                {weatherData.name}
              </Typography>
              <Typography variant="h6" color="secondary">
                Temperature: {kelvinToCelsius(weatherData.main.temp).toFixed(2)}°C
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Weather: {weatherData.weather[0].description}
              </Typography>
            </CardContent>
          </Card>
        )}
        {weatherData && weatherData.cod === '404' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            City not found. Please try again.
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default App;

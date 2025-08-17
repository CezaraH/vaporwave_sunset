const apiKey = 'cda0e18597858e371c095a298d7f03a5'; // Replace with your OpenWeatherMap API key
    const lat = 52.2294; // Latitude for Inkberrow
    const lon = -1.9576; // Longitude for Inkberrow
    const units = 'metric'; // Use 'imperial' for Fahrenheit

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        const temperature = data.main.temp;
        const location = data.name;
        document.getElementById('weather').textContent = ` ${temperature}°C in ${location}, UK`;
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather').textContent = 'Failed to load weather data.';
      });
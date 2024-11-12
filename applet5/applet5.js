class WeatherApp {
    constructor() {
        // API Key input
        this.apiKey = document.getElementById('apiKeyInput');

        // City input and weather button
        this.cityInput = document.getElementById('cityInput');
        this.getWeatherBtn = document.getElementById('getWeatherBtn');

        // Geolocation button
        this.getLocationBtn = document.getElementById('getLocationBtn');

        // Weather card elements
        this.weatherCard = document.getElementById('weatherCard');
        this.cityName = document.getElementById('cityName');
        this.temperature = document.getElementById('temperature');
        this.description = document.getElementById('description');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.weatherIcon = document.getElementById('weatherIcon');

        // Event Listeners
        this.getWeatherBtn.addEventListener('click', () => this.fetchWeather());
        this.getLocationBtn.addEventListener('click', () => this.fetchWeatherByLocation());
    }

    // Display weather data on the page
    displayWeather(data) {
        this.cityName.textContent = `${data.name}, ${data.sys.country}`;
        this.temperature.textContent = `Temperature: ${data.main.temp} °C`;
        this.description.textContent = `Weather: ${data.weather[0].description}`;
        this.humidity.textContent = `Humidity: ${data.main.humidity}%`;
        this.windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

        // Set the weather icon
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        this.weatherIcon.src = iconUrl;

        // Show the weather card
        this.weatherCard.style.display = 'block';
    }
}

class WeatherService extends WeatherApp {
    // Fetch weather by city name
    async fetchWeather() {
        const apiKey = this.apiKey.value.trim(); // Get API key from input
        const city = this.cityInput.value.trim(); // Get city name from input

        if (city && apiKey) {
            const data = await this.getWeatherData(city, apiKey);
            if (data) {
                this.displayWeather(data);  // Display weather data on the UI
                const modal = new bootstrap.Modal(document.getElementById('infoModal'));
                modal.hide(); // Close the modal after fetching data
            } else {
                alert('City not found. Please try again.');
            }
        } else {
            alert('Please enter both the city name and API key.');
        }
    }

    // Fetch weather data using geolocation
    async fetchWeatherByLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const apiKey = this.apiKey.value.trim();  // Get API key from input
                    const data = await this.getWeatherDataByCoordinates(latitude, longitude, apiKey);
                    if (data) {
                        this.displayWeather(data);  // Display weather data on the UI
                        this.cityInput.value = '';  // Clear city input after geolocation fetch
                        const modal = new bootstrap.Modal(document.getElementById('infoModal'));
                        modal.hide(); // Close modal after weather data fetch
                    } else {
                        alert('Unable to retrieve weather data for your location.');
                    }
                },
                () => {
                    alert('Unable to retrieve your location. Please allow location access.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Get weather data by city name
    async getWeatherData(city, apiKey) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Error fetching weather data:', response.statusText);
                alert('City not found or invalid API key.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert("An error occurred while fetching the weather data.");
        }
        return null;
    }

    // Get weather data using coordinates (latitude and longitude)
    async getWeatherDataByCoordinates(latitude, longitude, apiKey) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching weather data by coordinates:', error);
        }
        return null;
    }
}

// Initialize the WeatherService class when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const weatherApp = new WeatherService();  // Initialize the WeatherService class

    // Show the modal when the page is loaded
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
});

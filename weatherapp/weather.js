const API_KEY = "0edf63c143df47d2b0d74154250207";
let debounceTimeout;

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherGrid = document.getElementById('weatherGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const alertContainer = document.getElementById('alertContainer');
const particlesContainer = document.getElementById('particles-container');
const weatherBg = document.getElementById('weather-bg');
const appContainer = document.getElementById('app-container');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    cityInput.value = 'London';
    fetchWeatherData();
    
    // Event listeners
    searchBtn.addEventListener('click', fetchWeatherData);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchWeatherData();
        }
    });
    
    // Input debouncing
    cityInput.addEventListener('input', function() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            if (cityInput.value.trim().length > 2) {
                fetchWeatherData();
            }
        }, 1000);
    });
});

// Main function to fetch weather data
async function fetchWeatherData() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showAlert("Please enter a city name", "error");
        return;
    }
    
    showLoading(true);
    
    try {
        const API_URL = `https://api.weatherapi.com/v1/forecast.json?q=${city}&days=7&aqi=yes&key=${API_KEY}`;
        const response = await axios.get(API_URL);
        const weatherData = response.data;
        
        // Update all components
        updateCurrentWeather(weatherData);
        updateHourlyForecast(weatherData.forecast.forecastday[0].hour);
        updateAirQuality(weatherData.current);
        updateSevenDayForecast(weatherData.forecast.forecastday);
        
        // Set weather theme and effects
        setWeatherTheme(weatherData);
        
        // Show weather grid
        weatherGrid.style.display = 'grid';
        
        showAlert(`Weather data loaded for ${weatherData.location.name}`, "success");
        
    } catch (error) {
        console.error('Weather API error:', error);
        showAlert("City not found or API error. Please try another location.", "error");
        weatherGrid.style.display = 'none';
    } finally {
        showLoading(false);
    }
}

// Show/hide loading state
function showLoading(show) {
    if (show) {
        loadingSpinner.style.display = 'block';
        searchBtn.innerHTML = '<div class="loading-spinner" style="width: 16px; height: 16px;"></div>';
        searchBtn.disabled = true;
    } else {
        loadingSpinner.style.display = 'none';
        searchBtn.innerHTML = '<i class="fas fa-search"></i><span>Search</span>';
        searchBtn.disabled = false;
    }
}

// Show alert messages
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    alert.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 4000);
}

// Update current weather display
function updateCurrentWeather(data) {
    const localTime = new Date(data.location.localtime);
    const iconUrl = data.current.condition.icon.replace("64x64", "128x128");
    
    const currentWeatherHTML = `
        <div class="current-weather-content">
            <div class="location-info">
                <h2>${data.location.name}, ${data.location.country}</h2>
                <p class="location-time">
                    ${localTime.toLocaleString('en-US', { 
                        weekday: 'long', 
                        hour: 'numeric', 
                        minute: 'numeric', 
                        hour12: true 
                    })}
                </p>
                <p class="weather-condition">${data.current.condition.text}</p>
            </div>
            <img src="${iconUrl}" alt="Weather icon" class="weather-icon">
        </div>
        
        <div class="temperature-section">
            <div class="main-temperature">${Math.round(data.current.temp_c)}°</div>
            <div class="temperature-details">
                Feels like ${Math.round(data.current.feelslike_c)}°C<br>
                H: ${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}° 
                L: ${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°
            </div>
        </div>
        
        <div class="weather-stats">
            <div class="stat-item">
                <div class="stat-icon">💧</div>
                <div class="stat-value">${data.current.humidity}%</div>
                <div class="stat-label">Humidity</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">💨</div>
                <div class="stat-value">${data.current.wind_kph} km/h</div>
                <div class="stat-label">Wind</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">👁</div>
                <div class="stat-value">${data.current.vis_km} km</div>
                <div class="stat-label">Visibility</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">🌡</div>
                <div class="stat-value">${data.current.pressure_mb} hPa</div>
                <div class="stat-label">Pressure</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">🌧</div>
                <div class="stat-value">${data.current.precip_mm} mm</div>
                <div class="stat-label">Precipitation</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">☀️</div>
                <div class="stat-value">${data.current.uv}</div>
                <div class="stat-label">UV Index</div>
            </div>
        </div>
    `;
    
    document.getElementById('currentWeather').innerHTML = currentWeatherHTML;
}

// Update hourly forecast
function updateHourlyForecast(hourlyData) {
    const now = new Date();
    const currentHour = now.getHours();
    
    let hourlyHTML = '<div class="hourly-container"><div class="hourly-scroll">';
    
    for (let i = 0; i < 12; i++) {
        const hourIndex = (currentHour + i) % 24;
        const hour = hourlyData[hourIndex];
        const time = new Date(hour.time);
        const displayTime = time.toLocaleString('en-US', { hour: 'numeric', hour12: true });
        
        hourlyHTML += `
            <div class="hour-item">
                <div class="hour-time">${i === 0 ? 'Now' : displayTime}</div>
                <img src="${hour.condition.icon}" alt="Weather icon" class="hour-icon">
                <div class="hour-temp">${Math.round(hour.temp_c)}°</div>
                ${hour.chance_of_rain > 0 ? 
                    `<div class="hour-rain">🌧 ${hour.chance_of_rain}%</div>` : ''}
                <div class="hour-wind">💨 ${hour.wind_kph} km/h</div>
            </div>
        `;
    }
    
    hourlyHTML += '</div></div>';
    document.getElementById('hourlyForecast').innerHTML = hourlyHTML;
}

// Update air quality display
function updateAirQuality(currentData) {
    const air = currentData.air_quality || {};
    const aqi = Math.min(air["us-epa-index"] || 1, 6);
    
    const aqiLevels = [
        { text: "Good", color: "#10b981", emoji: "😊" },
        { text: "Moderate", color: "#f59e0b", emoji: "😐" },
        { text: "Unhealthy for Sensitive", color: "#f97316", emoji: "😷" },
        { text: "Unhealthy", color: "#ef4444", emoji: "😨" },
        { text: "Very Unhealthy", color: "#8b5cf6", emoji: "🤢" },
        { text: "Hazardous", color: "#7c3aed", emoji: "☠️" }
    ];
    
    const level = aqiLevels[aqi - 1] || aqiLevels[0];
    const hasData = air.pm2_5 || air.pm10 || air.o3 || air.no2;
    
    let airQualityHTML = `
        <div class="aqi-display">
            <div class="aqi-value" style="background: ${level.color}20; border-color: ${level.color}; color: ${level.color}">
                ${aqi}
            </div>
            <div>
                <div class="aqi-text">${level.emoji} ${level.text}</div>
                <div class="aqi-standard">US EPA standard</div>
            </div>
        </div>
    `;
    
    if (hasData) {
        airQualityHTML += '<div class="pollutants-grid">';
        airQualityHTML += renderPollutant("PM2.5", air.pm2_5, level.color);
        airQualityHTML += renderPollutant("PM10", air.pm10, level.color);
        airQualityHTML += renderPollutant("O₃", air.o3, level.color);
        airQualityHTML += renderPollutant("NO₂", air.no2, level.color);
        airQualityHTML += '</div>';
    } else {
        airQualityHTML += `
            <div class="alert info">
                <i class="fas fa-info-circle"></i> 
                Air quality data not available
            </div>
        `;
    }
    
    document.getElementById('airQuality').innerHTML = airQualityHTML;
}

// Helper function to render pollutant
function renderPollutant(name, value, color) {
    if (!value) return '';
    
    const progress = Math.min(value, 100);
    
    return `
        <div class="pollutant-item">
            <div class="pollutant-header">
                <span class="pollutant-name">${name}</span>
                <span class="pollutant-value">${value.toFixed(1)} µg/m³</span>
            </div>
            <div class="pollutant-bar">
                <div class="pollutant-level" style="width: ${progress}%; background: ${color};"></div>
            </div>
        </div>
    `;
}

// Update 7-day forecast
function updateSevenDayForecast(forecastDays) {
    let sevenDayHTML = '<div class="daily-forecast">';
    
    forecastDays.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const iconUrl = day.day.condition.icon.replace("64x64", "128x128");
        
        sevenDayHTML += `
            <div class="day-item">
                <div class="day-name">${dayName}</div>
                <img src="${iconUrl}" alt="Weather icon" class="day-icon">
                <div class="day-condition">${day.day.condition.text}</div>
                ${day.day.daily_chance_of_rain > 0 ? 
                    `<div class="day-rain">🌧 ${day.day.daily_chance_of_rain}%</div>` : ''}
                <div class="day-temps">
                    <span class="day-max">${Math.round(day.day.maxtemp_c)}°</span>
                    <span class="day-min">${Math.round(day.day.mintemp_c)}°</span>
                </div>
            </div>
        `;
    });
    
    sevenDayHTML += '</div>';
    document.getElementById('sevenDayForecast').innerHTML = sevenDayHTML;
}

// Set weather theme and effects
function setWeatherTheme(data) {
    const condition = data.current.condition.text.toLowerCase();
    const isDay = data.current.is_day === 1;
    
    // Clear previous effects
    particlesContainer.innerHTML = '';
    appContainer.classList.remove('dark-theme');
    weatherBg.className = 'weather-bg';
    
    let theme = 'default';
    
    if (!isDay) {
        theme = 'night';
        appContainer.classList.add('dark-theme');
        createStarEffect();
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
        theme = 'rain';
        appContainer.classList.add('dark-theme');
        createRainEffect();
    } else if (condition.includes('snow') || condition.includes('sleet')) {
        theme = 'snow';
        appContainer.classList.add('dark-theme');
        createSnowEffect();
    } else if (condition.includes('cloud')) {
        theme = 'cloudy';
        appContainer.classList.add('dark-theme');
        createCloudEffect();
    } else if (condition.includes('sun') || condition.includes('clear')) {
        theme = 'sunny';
        createSunEffect();
    }
    
    weatherBg.classList.add(`weather-theme-${theme}`);
}

// Weather effects functions
function createStarEffect() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'weather-particle star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${1 + Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 2}s`;
        particlesContainer.appendChild(star);
    }
}

function createRainEffect() {
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'weather-particle rain-particle';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        particlesContainer.appendChild(drop);
    }
}

function createSnowEffect() {
    for (let i = 0; i < 30; i++) {
        const flake = document.createElement('div');
        flake.className = 'weather-particle snow-particle';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.width = `${4 + Math.random() * 8}px`;
        flake.style.height = flake.style.width;
        flake.style.animationDuration = `${3 + Math.random() * 7}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(flake);
    }
}

function createCloudEffect() {
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'weather-particle cloud';
        cloud.style.width = `${120 + Math.random() * 180}px`;
        cloud.style.height = `${80 + Math.random() * 100}px`;
        cloud.style.top = `${5 + Math.random() * 25}%`;
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.opacity = `${0.4 + Math.random() * 0.4}`;
        cloud.style.animationDuration = `${25 + Math.random() * 50}s`;
        particlesContainer.appendChild(cloud);
    }
}

function createSunEffect() {
    const sunRays = document.createElement('div');
    sunRays.className = 'weather-particle sun-rays';
    particlesContainer.appendChild(sunRays);
}

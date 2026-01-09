// backend/src/config/apis.js
// List of APIs to monitor automatically

const monitoredApis = [
  {
    name: 'GitHub API',
    url: 'https://api.github.com',
    enabled: true,
  },
  {
    name: 'JSONPlaceholder',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    enabled: true,
  },
  {
    name: 'CoinGecko API',
    url: 'https://api.coingecko.com/api/v3/ping',
    enabled: true,
  },
  {
    name: 'OpenWeather Demo',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=demo',
    enabled: true,
  },
];

module.exports = monitoredApis;

/*
EXPLANATION:

This is a simple configuration file listing APIs to monitor.

- name: Display name for the API
- url: Endpoint to test
- enabled: true/false to turn monitoring on/off

You can easily add more APIs here:
{
  name: 'Your API',
  url: 'https://your-api.com',
  enabled: true,
}

WHY SEPARATE CONFIG FILE?
- Easy to add/remove APIs
- No need to touch main code
- Can be moved to database later
- Clear and organized
*/
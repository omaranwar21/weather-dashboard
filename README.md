# Weather Dashboard

A weather dashboard that provides detailed weather information for searched cities using the Tomorrow.io API. This application includes features to search for city weather, add cities to history, mark favorites, and display current location weather information.

## Features

- **Search City Weather:** Get temperature, humidity, pressure, and wind speed of a city.
- **History:** Automatically save searched cities.
- **Favorites:** Mark selected cities as favorites for quick access.
- **Current Location Weather:** Retrieve and display weather data for your current location.

## Installation

### Prerequisites

- A browser with JavaScript enabled.
- An API key from [Tomorrow.io](https://www.tomorrow.io/).

### Steps

1. Clone or download the repository:

   ```bash
   git clone <repository-url>
   ```

2. Open the `weather-dashboard.html` file in your browser to launch the application.

3. Replace `YOUR_API_KEY` in the JavaScript file with your Tomorrow.io API key:

   ```javascript
   const apiKey = "YOUR_API_KEY";
   ```

## Usage

1. Open the application in your browser.
2. Use the search bar to enter a city name and view its weather details.
3. View recently searched cities in the history section.
4. Mark a city as a favorite by clicking the star icon next to its name.
5. Check weather details for your current location using the dedicated button.

## Challenges Faced

- **API Integration:** Understanding and properly utilizing the Tomorrow.io API endpoints.
- **Data Parsing:** Extracting and formatting the relevant data from API responses.
- **Local Storage Management:** Ensuring consistent behavior while storing and retrieving history and favorites.


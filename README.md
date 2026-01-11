# Theme Scheduler

Automatically switch VS Code themes based on sunrise/sunset times or a custom schedule.

## Features

- **Automatic theme switching** based on your location's sunrise and sunset times
- **Manual time mode** for custom daily schedule
- **Configurable themes** for day and night
- **Status bar indicator** showing current mode
- Easy enable/disable commands

## Usage

### Sunrise/Sunset Mode (Default)

1. Open VS Code settings (Cmd+, or Ctrl+,)
2. Search for "Theme Scheduler"
3. Set your latitude and longitude (defaults to New York City)
4. Choose your day and night themes
5. The extension will automatically switch themes at sunrise and sunset!

### Manual Time Mode

1. Open VS Code settings
2. Search for "Theme Scheduler"
3. Change **Mode** to `manual`
4. Set **Manual Day Time** (e.g., "07:00" for 7 AM)
5. Set **Manual Night Time** (e.g., "19:00" for 7 PM)
6. Choose your day and night themes

## Configuration

- `themeScheduler.enabled` - Enable/disable automatic theme switching (default: true)
- `themeScheduler.mode` - Choose "sunriseSunset" or "manual" (default: "sunriseSunset")
- `themeScheduler.dayTheme` - Theme to use during the day (default: "Default Light+")
- `themeScheduler.nightTheme` - Theme to use at night (default: "Default Dark+")
- `themeScheduler.latitude` - Your latitude for sunrise/sunset calculation (default: 40.7128)
- `themeScheduler.longitude` - Your longitude for sunrise/sunset calculation (default: -74.0060)
- `themeScheduler.manualDayTime` - Time to switch to day theme in 24h format (default: "07:00")
- `themeScheduler.manualNightTime` - Time to switch to night theme in 24h format (default: "19:00")

## Commands

- `Theme Scheduler: Enable Auto Switching` - Enable the extension
- `Theme Scheduler: Disable Auto Switching` - Disable the extension
- `Theme Scheduler: Switch Theme Now` - Manually trigger a theme switch

## Finding Your Coordinates

To get accurate sunrise/sunset times, you'll need your latitude and longitude:

1. Visit [https://www.latlong.net/](https://www.latlong.net/)
2. Search for your city
3. Copy the latitude and longitude values
4. Paste them into the extension settings

## Status Bar

The extension adds a small indicator to your status bar:

- 💡 Day - Currently using day theme
- 🌙 Night - Currently using night theme
- Click it to manually trigger a theme switch

## How It Works

The extension checks the current time every minute and compares it with either:

- The sunrise/sunset times calculated from your coordinates (using the SunCalc library)
- Your manually configured day/night times

When a transition time is reached, the theme automatically switches.

## License

ISC

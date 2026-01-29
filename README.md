# Theme Scheduler

Automatically switch themes by time of day.

## Features

- **Automatic theme switching** at configurable day/night times
- **Configurable themes** for day and night
- **Status bar indicator** showing current theme (day/night)
- Easy enable/disable commands

## Usage

1. Open settings (CMD+Shift+P → "Open user settings")
2. Search for "Theme Scheduler"
3. Set **Day Time** (e.g. "07:00" for 7 AM)
4. Set **Night Time** (e.g. "19:00" for 7 PM)
5. Choose your day and night themes

## Configuration

- `themeScheduler.enabled` — Enable/disable automatic switching (default: true)
- `themeScheduler.dayTheme` — Theme during day (default: "Default Light+")
- `themeScheduler.nightTheme` — Theme at night (default: "Default Dark+")
- `themeScheduler.dayTime` — Time to switch to day theme, 24h "HH:MM" (default: "07:00")
- `themeScheduler.nightTime` — Time to switch to night theme, 24h "HH:MM" (default: "19:00")

## Status Bar

- 💡 Day — using day theme
- 🌙 Night — using night theme
- Click to switch theme immediately

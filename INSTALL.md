# Installation Guide

## Option 1: Install from VSIX (Recommended)

1. **Package the extension:**

   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

   This creates a `.vsix` file.

2. **Install in VS Code:**
   - Open VS Code
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Install from VSIX"
   - Select the generated `.vsix` file

## Option 2: Development Mode

1. **Open in VS Code:**

   ```bash
   code /Users/admin/Documents/personal/theme-scheduler
   ```

2. **Press F5** to open a new VS Code window with the extension loaded

3. **Test the extension** in the new window

## Configuration

After installation, configure the extension:

1. Open Settings (`Cmd+,` or `Ctrl+,`)
2. Search for "Theme Scheduler"
3. Configure:
   - **Mode**: Choose "sunriseSunset" or "manual"
   - **Day Theme**: Your preferred light theme
   - **Night Theme**: Your preferred dark theme
   - **Latitude/Longitude**: Your location (for sunrise/sunset mode)
   - **Manual Times**: Custom switch times (for manual mode)

## Quick Start

### For Sunrise/Sunset Mode:

```json
{
  "themeScheduler.enabled": true,
  "themeScheduler.mode": "sunriseSunset",
  "themeScheduler.latitude": 40.7128, // Your latitude
  "themeScheduler.longitude": -74.006, // Your longitude
  "themeScheduler.dayTheme": "GitHub Light",
  "themeScheduler.nightTheme": "GitHub Dark"
}
```

### For Manual Time Mode:

```json
{
  "themeScheduler.enabled": true,
  "themeScheduler.mode": "manual",
  "themeScheduler.manualDayTime": "08:00",
  "themeScheduler.manualNightTime": "20:00",
  "themeScheduler.dayTheme": "Solarized Light",
  "themeScheduler.nightTheme": "Monokai"
}
```

## Troubleshooting

**Extension not working?**

- Check the status bar for the theme indicator (💡 or 🌙)
- Open the Output panel (`Cmd+Shift+U`) and select "Theme Scheduler" from the dropdown
- Verify your settings are correct

**Theme not switching?**

- Ensure `themeScheduler.enabled` is `true`
- Check that your theme names match exactly (case-sensitive)
- Try running "Theme Scheduler: Switch Theme Now" command

**Can't find the extension?**

- If using development mode, make sure you pressed F5
- If installed via VSIX, restart VS Code

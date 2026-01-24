import * as vscode from 'vscode'
import { getTimes } from 'suncalc3'

interface ThemeSchedulerConfig {
  enabled: boolean
  mode: 'sunriseSunset' | 'manual'
  dayTheme: string
  nightTheme: string
  latitude: number
  longitude: number
  manualDayTime: string
  manualNightTime: string
}

let statusBarItem: vscode.StatusBarItem
let checkInterval: NodeJS.Timeout | undefined

export function activate(context: vscode.ExtensionContext) {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  )
  statusBarItem.command = 'theme-scheduler.switchNow'
  context.subscriptions.push(statusBarItem)

  context.subscriptions.push(
    vscode.commands.registerCommand('theme-scheduler.enable', () => {
      vscode.workspace
        .getConfiguration('themeScheduler')
        .update('enabled', true, vscode.ConfigurationTarget.Global)
      vscode.window.showInformationMessage('Theme Scheduler enabled')
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('theme-scheduler.disable', () => {
      vscode.workspace
        .getConfiguration('themeScheduler')
        .update('enabled', false, vscode.ConfigurationTarget.Global)
      vscode.window.showInformationMessage('Theme Scheduler disabled')
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('theme-scheduler.switchNow', () => {
      toggleTheme()
    }),
  )

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('themeScheduler')) {
        restartScheduler()
      }
    }),
  )

  startScheduler()
}

export function deactivate() {
  if (checkInterval) {
    clearInterval(checkInterval)
  }

  if (statusBarItem) {
    statusBarItem.dispose()
  }
}

function getConfig(): ThemeSchedulerConfig {
  const config = vscode.workspace.getConfiguration('themeScheduler')
  return {
    enabled: config.get('enabled', true),
    mode: config.get('mode', 'sunriseSunset'),
    dayTheme: config.get('dayTheme', 'Default Light+'),
    nightTheme: config.get('nightTheme', 'Default Dark+'),
    latitude: config.get('latitude', 40.7128),
    longitude: config.get('longitude', -74.006),
    manualDayTime: config.get('manualDayTime', '07:00'),
    manualNightTime: config.get('manualNightTime', '19:00'),
  }
}

function isDaytime() {
  const config = getConfig()
  const now = new Date()

  if (config.mode === 'sunriseSunset') {
    const times = getTimes(now, config.latitude, config.longitude)
    const sunrise = times.sunrise.value
    const sunset = times.sunset.value

    return now >= sunrise && now < sunset
  } else {
    const [dayHour, dayMinute] = config.manualDayTime.split(':').map(Number)
    const [nightHour, nightMinute] = config.manualNightTime
      .split(':')
      .map(Number)

    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const dayMinutes = dayHour * 60 + dayMinute
    const nightMinutes = nightHour * 60 + nightMinute

    return currentMinutes >= dayMinutes && currentMinutes < nightMinutes
  }
}

function switchTheme() {
  const config = getConfig()

  if (!config.enabled) {
    updateStatusBar('disabled')
    return
  }

  const isDayTime = isDaytime()
  const targetTheme = isDayTime ? config.dayTheme : config.nightTheme
  const currentTheme = vscode.workspace
    .getConfiguration('workbench')
    .get('colorTheme')

  if (currentTheme !== targetTheme) {
    vscode.workspace
      .getConfiguration('workbench')
      .update('colorTheme', targetTheme, vscode.ConfigurationTarget.Global)
  }

  updateStatusBar(isDayTime ? 'day' : 'night')
}

function toggleTheme() {
  const config = getConfig()
  const currentTheme = vscode.workspace
    .getConfiguration('workbench')
    .get('colorTheme')

  const isDayTime = isDaytime()
  const targetTheme = isDayTime ? config.dayTheme : config.nightTheme
  const oppositeTheme = isDayTime ? config.nightTheme : config.dayTheme

  if (currentTheme === targetTheme) {
    vscode.workspace
      .getConfiguration('workbench')
      .update('colorTheme', oppositeTheme, vscode.ConfigurationTarget.Global)
    updateStatusBar(isDayTime ? 'night' : 'day')
  } else {
    vscode.workspace
      .getConfiguration('workbench')
      .update('colorTheme', targetTheme, vscode.ConfigurationTarget.Global)
    updateStatusBar(isDayTime ? 'day' : 'night')
  }
}

function updateStatusBar(mode: 'day' | 'night' | 'disabled') {
  if (mode === 'disabled') {
    statusBarItem.text = '$(color-mode) Theme Auto: Off'
    statusBarItem.tooltip =
      'Theme Scheduler is disabled. Click to switch theme.'
  } else {
    const icon = mode === 'day' ? '$(lightbulb)' : '$(moon)'
    statusBarItem.text = `${icon} ${mode === 'day' ? 'Day' : 'Night'}`
    statusBarItem.tooltip = `Current: ${mode === 'day' ? 'Day theme' : 'Night theme'}. Click to switch now.`
  }
  statusBarItem.show()
}

function startScheduler() {
  switchTheme()

  checkInterval = setInterval(() => {
    switchTheme()
  }, 60000) // 60 seconds
}

function restartScheduler() {
  if (checkInterval) {
    clearInterval(checkInterval)
  }

  startScheduler()
}

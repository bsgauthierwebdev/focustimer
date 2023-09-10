// Initialize the variables
const decreaseFocusBtn = document.getElementById('decreaseFocus')
const increaseFocusBtn = document.getElementById('increaseFocus')
const focusTimeSpan = document.getElementById('focusTime')

const decreaseBreakBtn = document.getElementById('decreaseBreak')
const increaseBreakBtn = document.getElementById('increaseBreak')
const breakTimeSpan = document.getElementById('breakTime')

const timerDisplay = document.getElementById('timerDisplay')
const intervalDisplay = document.getElementById('intervalType')

const startBtn = document.getElementById('startBtn')
const pauseBtn = document.getElementById('pauseBtn')
const resetBtn = document.getElementById('resetBtn')

const statusBar = document.getElementById('statusBar')

const tickAudio = document.getElementById('tickAudio')

let focusTime = parseInt(focusTimeDisplay.textContent) * 60
let breakTime = parseInt(breakTimeDisplay.textContent) * 60

let currentTime = focusTime // Current countdown time in seconds
let isFocusTime = true // Indicates which interval is active
let isPaused = true // Indicates whether timer is paused
let worker

function decreaseFocusTime() {
    // console.log('Decrease Focus Button Clicked', focusTime)

    if (focusTime <= 60) {
        return
    } else {
        let currentValue = parseInt(focusTimeDisplay.textContent)
        let newValue = currentValue - 1
        focusTimeDisplay.textContent = newValue

        focusTime = newValue * 60
        resetTimer()
    }
}

function increaseFocusTime() {
    // console.log('Increase Focus Button Clicked', focusTime)

    if (focusTime >= 3600) {
        return
    } else {
        let currentValue = parseInt(focusTimeDisplay.textContent)
        let newValue = currentValue + 1
        focusTimeDisplay.textContent = newValue
        
        focusTime = newValue * 60
        resetTimer()
    }
}

function decreaseBreakTime() {
    // console.log('Decrease Break Button Clicked', breakTime)

    if (breakTime <= 60) {
        return
    } else {
        let currentValue = parseInt(breakTimeDisplay.textContent)
        let newValue = currentValue - 1
        breakTimeDisplay.textContent = newValue

        breakTime = newValue * 60
        resetTimer()
    }
}

function increaseBreakTime() {
    // console.log('Increase Break Button Clicked', breakTime)

    if (breakTime >= 900) {
        return
    } else {
        let currentValue = parseInt(breakTimeDisplay.textContent)
        let newValue = currentValue + 1
        breakTimeDisplay.textContent = newValue

        breakTime = newValue * 60
        resetTimer()
    }
}

function updateDisplay() {
    // console.log('Updating Display')
    const minutes = Math.floor(currentTime / 60)
    const seconds = currentTime % 60

    const intervalType = isFocusTime ? 'Focus' : 'Break'

    intervalDisplay.textContent = `${intervalType}`
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    // Update status bar
    const totalIntervalTime = isFocusTime ? focusTime : breakTime
    const remainingRatio = currentTime / totalIntervalTime
    statusBar.style.width = `${(remainingRatio * 100).toFixed(2)}%`

    // Ticks to count down to interval change
    if (currentTime <= 5 && currentTime >0) {
        console.log('tick')
        playTickSound()
    }
    
    if (currentTime <= 15) {
        statusBar.style.backgroundColor = '#f44336'
    } else if (currentTime <= 60) {
        statusBar.style.backgroundColor = '#ffff00'
    } else {
        statusBar.style.backgroundColor = '#4caf50'
    }
}

function toggleTimer() {
    if (isPaused) {
        startTimer()
    } else {
        pauseTimer
    }
}

function startTimer() {
    // console.log('Start Button Clicked')
    isPaused = false
    // startBtn.textContent = 'Pause'
    worker = new Worker('timer-worker.js')
    worker.postMessage({action: 'start', time: currentTime})
    worker.onmessage = function (e) {
        currentTime = e.data.time
        updateDisplay()
        if (currentTime === 0) {
            toggleInterval()
        }
    }
    document.getElementById('startBtn').disabled = true
    document.getElementById('resetBtn').disabled = true
    document.getElementById('decreaseFocus').disabled = true
    document.getElementById('increaseFocus').disabled = true
    document.getElementById('decreaseBreak').disabled = true
    document.getElementById('increaseBreak').disabled = true
}

function pauseTimer() {
    // console.log('Pause Button Clicked')
    isPaused = true
    startBtn.textContent = 'Resume'
    worker.postMessage({action: 'pause'})
    document.getElementById('startBtn').disabled = false
    document.getElementById('resetBtn').disabled = false
    document.getElementById('decreaseFocus').disabled = false
    document.getElementById('increaseFocus').disabled = false
    document.getElementById('decreaseBreak').disabled = false
    document.getElementById('increaseBreak').disabled = false
}

function resetTimer() {
    // console.log('Reset Button Clicked')
    isPaused = true
    isFocusTime = true
    startBtn.textContent = 'Start'
    currentTime = isFocusTime ? focusTime : breakTime
    updateDisplay()
    if (worker) {
        worker.terminate()
    }
    document.getElementById('startBtn').disabled = false
    document.getElementById('resetBtn').disabled = false
    document.getElementById('decreaseFocus').disabled = false
    document.getElementById('increaseFocus').disabled = false
    document.getElementById('decreaseBreak').disabled = false
    document.getElementById('increaseBreak').disabled = false
}

function toggleInterval() {
    isFocusTime = !isFocusTime
    currentTime = isFocusTime ? focusTime : breakTime
    updateDisplay()
    if (isFocusTime) {
        // console.log('Switch to Focus Time')
        let audio = new Audio('focus.mp3')
        audio.play()
    } else {
        // console.log('Switch to Break Time')
        let audio = new Audio('break.mp3')
        audio.play()
    }
    if (worker) {
        worker.terminate()
    }
    startTimer()
}

function playTickSound() {
    tickAudio.currentTime = 0 // Reset audio to the beginning
    tickAudio.play()
}

// Initial setup
updateDisplay()
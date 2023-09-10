let timerInterval
let remainingTime
let isPaused = true

self.onmessage = function (e) {
    if (e.data.action === 'start') {
        if (isPaused) {
            remainingTime = e.data.time
            isPaused = false
            startTimer()
        }
    } else if (e.data.action === 'pause') {
        if (!isPaused) {
            clearInterval(timerInterval)
            isPaused = true
        }
    }
}

function startTimer() {
    timerInterval = setInterval(function () {
        if (remainingTime > 0) {
            remainingTime--
            self.postMessage({time: remainingTime})
        } else {
            clearInterval(timerInterval)
            isPaused = true
        }
    }, 1000)
}
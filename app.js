/* =====================================================
   TIMER APPLICATION - LIGHTWEIGHT VERSION
   No heavy animations, optimized for performance
   ===================================================== */

// =====================================================
// DOM ELEMENT REFERENCES
// =====================================================
const timerDigits = document.getElementById('timerDigits');
const timerLabel = document.getElementById('timerLabel');
const timerCircle = document.getElementById('timerCircle');
const progressRing = document.getElementById('progressRing');
const modeIndicator = document.getElementById('modeIndicator');
const focusTimeInput = document.getElementById('focusTime');
const breakTimeInput = document.getElementById('breakTime');
const tripTargetInput = document.getElementById('tripTarget');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const breakBtn = document.getElementById('breakBtn');
const skipBtn = document.getElementById('skipBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const soundBtn = document.getElementById('soundBtn');
const resetTripBtn = document.getElementById('resetTripBtn');
const statsBtn = document.getElementById('statsBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const notification = document.getElementById('notification');
const settingsToggle = document.getElementById('settingsToggle');
const settingsContent = document.getElementById('settingsContent');
const themeBtns = document.querySelectorAll('.theme-btn');
const styleBtns = document.querySelectorAll('.style-btn');
const confettiContainer = document.getElementById('confettiContainer');

// Mode tabs
const timerModeTab = document.getElementById('timerModeTab');
const stopwatchModeTab = document.getElementById('stopwatchModeTab');

// Trip tracker elements
const tripTracker = document.getElementById('tripTracker');
const tripCount = document.getElementById('tripCount');
const tripProgressFill = document.getElementById('tripProgressFill');
const tripDots = document.getElementById('tripDots');
const totalFocusTime = document.getElementById('totalFocusTime');
const totalBreakTime = document.getElementById('totalBreakTime');
const currentStreak = document.getElementById('currentStreak');

// Stopwatch tracker elements
const stopwatchTracker = document.getElementById('stopwatchTracker');
const stopwatchStatus = document.getElementById('stopwatchStatus');
const stopwatchWorkTime = document.getElementById('stopwatchWorkTime');
const stopwatchBreakTime = document.getElementById('stopwatchBreakTime');
const stopwatchLaps = document.getElementById('stopwatchLaps');

// Stopwatch buttons
const stopwatchButtonGroup = document.getElementById('stopwatchButtonGroup');
const timerButtonGroup = document.getElementById('timerButtonGroup');
const stopwatchStartBtn = document.getElementById('stopwatchStartBtn');
const stopwatchResetBtn = document.getElementById('stopwatchResetBtn');
const lapBtn = document.getElementById('lapBtn');
const stopwatchBreakBtn = document.getElementById('stopwatchBreakBtn');
const stopwatchResumeBtn = document.getElementById('stopwatchResumeBtn');

// Lap times elements
const lapTimesContainer = document.getElementById('lapTimesContainer');
const lapTimesList = document.getElementById('lapTimesList');
const clearLapsBtn = document.getElementById('clearLapsBtn');

// Input section
const inputSection = document.getElementById('inputSection');

// Modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalTrips = document.getElementById('modalTrips');
const modalTime = document.getElementById('modalTime');
const modalBreaks = document.getElementById('modalBreaks');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Stats modal elements
const statsModalOverlay = document.getElementById('statsModalOverlay');
const statsContent = document.getElementById('statsContent');
const statsCloseBtn = document.getElementById('statsCloseBtn');
const periodTabs = document.querySelectorAll('.period-tab');

// Clock elements
const currentTimeEl = document.getElementById('currentTime');
const currentDateEl = document.getElementById('currentDate');
const swCurrentTimeEl = document.getElementById('swCurrentTime');
const swCurrentDateEl = document.getElementById('swCurrentDate');

// =====================================================
// APPLICATION STATE
// =====================================================
let appMode = 'timer';
let previousTheme = 'violet';

let timerState = {
    mode: 'focus',
    isRunning: false,
    isPaused: false,
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    intervalId: null,
    soundEnabled: true
};

let stopwatchState = {
    mode: 'work',
    isRunning: false,
    isPaused: false,
    elapsedSeconds: 0,
    savedElapsedSeconds: 0,
    breakElapsedSeconds: 0,
    breakTotalSeconds: 20 * 60,
    intervalId: null,
    laps: [],
    lastLapTime: 0,
    sessionWorkSeconds: 0,
    sessionBreakSeconds: 0
};

let tripState = {
    target: 4,
    completed: 0,
    totalFocusMinutes: 0,
    totalBreakMinutes: 0,
    streak: 0,
    focusStartTime: null,
    breakStartTime: null
};

let statsState = {
    daily: { date: '', focusMinutes: 0, breakMinutes: 0, stopwatchWorkMinutes: 0, stopwatchBreakMinutes: 0, sessions: 0, trips: 0 },
    weekly: { weekStart: '', focusMinutes: 0, breakMinutes: 0, stopwatchWorkMinutes: 0, stopwatchBreakMinutes: 0, sessions: 0, trips: 0 },
    monthly: { month: '', focusMinutes: 0, breakMinutes: 0, stopwatchWorkMinutes: 0, stopwatchBreakMinutes: 0, sessions: 0, trips: 0 },
    allTime: { focusMinutes: 0, breakMinutes: 0, stopwatchWorkMinutes: 0, stopwatchBreakMinutes: 0, sessions: 0, trips: 0 }
};

const CIRCUMFERENCE = 2 * Math.PI * 115;
progressRing.style.strokeDasharray = CIRCUMFERENCE;

// =====================================================
// DARK MODE TOGGLE
// =====================================================
function toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const darkModeIcon = document.getElementById('darkModeIcon');
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', previousTheme);
        updateThemeButtons(previousTheme);
        localStorage.setItem('timerTheme', previousTheme);
        if (darkModeIcon) {
            darkModeIcon.innerHTML = '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>';
        }
        showNotification('Light mode enabled', '🌞');
    } else {
        previousTheme = currentTheme;
        localStorage.setItem('previousTheme', previousTheme);
        body.setAttribute('data-theme', 'dark');
        updateThemeButtons('dark');
        localStorage.setItem('timerTheme', 'dark');
        if (darkModeIcon) {
            darkModeIcon.innerHTML = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
        }
        showNotification('Dark mode enabled', '🌙');
    }
}

function updateThemeButtons(theme) {
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        }
    });
}

// =====================================================
// CONFETTI (Lightweight - only on completion)
// =====================================================
function createConfetti(count = 50) {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#9b7bb8', '#bb86fc'];
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            confettiContainer.appendChild(confetti);
            requestAnimationFrame(() => confetti.classList.add('animate'));
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatMinutes(minutes) {
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
}

function updateProgressRing(remaining, total) {
    const progress = remaining / total;
    const offset = CIRCUMFERENCE * (1 - progress);
    progressRing.style.strokeDashoffset = offset;
}

function updateStopwatchProgressRing(elapsed) {
    const progress = (elapsed % 60) / 60;
    const offset = CIRCUMFERENCE * progress;
    progressRing.style.strokeDashoffset = CIRCUMFERENCE - offset;
}

function updateBreakProgressRing(remaining, total) {
    const progress = remaining / total;
    const offset = CIRCUMFERENCE * (1 - progress);
    progressRing.style.strokeDashoffset = offset;
}

function showNotification(message, icon = '✨') {
    const notifIcon = notification.querySelector('.notification-icon');
    const notifText = notification.querySelector('.notification-text');
    notifIcon.textContent = icon;
    notifText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3500);
}

function playSound(type = 'complete') {
    if (!timerState.soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (type === 'complete') {
            const frequencies = [523.25, 659.25, 783.99];
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                const startTime = audioContext.currentTime + (index * 0.1);
                gainNode.gain.setValueAtTime(0.15, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);
                oscillator.start(startTime);
                oscillator.stop(startTime + 1.5);
            });
        } else if (type === 'tick') {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } else if (type === 'break') {
            const frequencies = [392, 493.88, 587.33];
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value = freq;
                oscillator.type = 'triangle';
                const startTime = audioContext.currentTime + (index * 0.15);
                gainNode.gain.setValueAtTime(0.1, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 2);
                oscillator.start(startTime);
                oscillator.stop(startTime + 2);
            });
        } else if (type === 'lap') {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    } catch (e) {
        console.log('Audio not supported');
    }
}

function tickAnimation() {
    timerDigits.classList.add('tick');
    setTimeout(() => {
        timerDigits.classList.remove('tick');
    }, 300);
}

// =====================================================
// DATE UTILITY FUNCTIONS
// =====================================================
function getToday() {
    return new Date().toDateString();
}

function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toDateString();
}

function getMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

// =====================================================
// STATISTICS FUNCTIONS
// =====================================================
function loadStats() {
    const saved = localStorage.getItem('focusTimerStats');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.daily && data.daily.date === getToday()) statsState.daily = data.daily;
        if (data.weekly && data.weekly.weekStart === getWeekStart()) statsState.weekly = data.weekly;
        if (data.monthly && data.monthly.month === getMonth()) statsState.monthly = data.monthly;
        if (data.allTime) statsState.allTime = data.allTime;
    }
    statsState.daily.date = getToday();
    statsState.weekly.weekStart = getWeekStart();
    statsState.monthly.month = getMonth();
}

function saveStats() {
    localStorage.setItem('focusTimerStats', JSON.stringify(statsState));
}

function addFocusTime(minutes) {
    statsState.daily.focusMinutes += minutes;
    statsState.weekly.focusMinutes += minutes;
    statsState.monthly.focusMinutes += minutes;
    statsState.allTime.focusMinutes += minutes;
    saveStats();
}

function addBreakTime(minutes) {
    statsState.daily.breakMinutes += minutes;
    statsState.weekly.breakMinutes += minutes;
    statsState.monthly.breakMinutes += minutes;
    statsState.allTime.breakMinutes += minutes;
    saveStats();
}

function addStopwatchWorkTime(minutes) {
    statsState.daily.stopwatchWorkMinutes += minutes;
    statsState.weekly.stopwatchWorkMinutes += minutes;
    statsState.monthly.stopwatchWorkMinutes += minutes;
    statsState.allTime.stopwatchWorkMinutes += minutes;
    saveStats();
}

function addStopwatchBreakTime(minutes) {
    statsState.daily.stopwatchBreakMinutes += minutes;
    statsState.weekly.stopwatchBreakMinutes += minutes;
    statsState.monthly.stopwatchBreakMinutes += minutes;
    statsState.allTime.stopwatchBreakMinutes += minutes;
    saveStats();
}

function addSession() {
    statsState.daily.sessions += 1;
    statsState.weekly.sessions += 1;
    statsState.monthly.sessions += 1;
    statsState.allTime.sessions += 1;
    saveStats();
}

function addTrip() {
    statsState.daily.trips += 1;
    statsState.weekly.trips += 1;
    statsState.monthly.trips += 1;
    statsState.allTime.trips += 1;
    saveStats();
}

function renderStats(period = 'daily') {
    const stats = statsState[period];
    const totalFocus = stats.focusMinutes + stats.stopwatchWorkMinutes;
    const totalBreak = stats.breakMinutes + stats.stopwatchBreakMinutes;
    
    let periodLabel = '';
    switch(period) {
        case 'daily': periodLabel = 'Today'; break;
        case 'weekly': periodLabel = 'This Week'; break;
        case 'monthly': periodLabel = 'This Month'; break;
        case 'allTime': periodLabel = 'All Time'; break;
    }
    
    statsContent.innerHTML = `
        <div class="stats-section">
            <div class="stats-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                ${periodLabel} Overview
            </div>
            <div class="stats-grid">
                <div class="stats-card full-width">
                    <div class="stats-card-value">${formatMinutes(totalFocus + totalBreak)}</div>
                    <div class="stats-card-label">Total Time</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${stats.sessions}</div>
                    <div class="stats-card-label">Sessions</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${stats.trips}</div>
                    <div class="stats-card-label">Trips Completed</div>
                </div>
            </div>
        </div>
        <div class="stats-divider"></div>
        <div class="stats-section">
            <div class="stats-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                </svg>
                Focus Timer Stats
            </div>
            <div class="stats-grid">
                <div class="stats-card">
                    <div class="stats-card-value">${formatMinutes(stats.focusMinutes)}</div>
                    <div class="stats-card-label">Focus Time</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${formatMinutes(stats.breakMinutes)}</div>
                    <div class="stats-card-label">Break Time</div>
                </div>
            </div>
        </div>
        <div class="stats-divider"></div>
        <div class="stats-section">
            <div class="stats-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                Stopwatch Stats
            </div>
            <div class="stats-grid">
                <div class="stats-card">
                    <div class="stats-card-value">${formatMinutes(stats.stopwatchWorkMinutes)}</div>
                    <div class="stats-card-label">Work Time</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${formatMinutes(stats.stopwatchBreakMinutes)}</div>
                    <div class="stats-card-label">Break Time</div>
                </div>
            </div>
        </div>
    `;
}

// =====================================================
// TRIP TRACKER FUNCTIONS
// =====================================================
function initTripDots() {
    tripDots.innerHTML = '';
    for (let i = 0; i < tripState.target; i++) {
        const dot = document.createElement('div');
        dot.className = 'trip-dot';
        dot.textContent = i + 1;
        dot.dataset.index = i;
        
        if (i < tripState.completed) {
            dot.classList.add('completed');
            dot.innerHTML = '✓';
        } else if (i === tripState.completed && timerState.mode === 'focus') {
            dot.classList.add('current');
        }
        tripDots.appendChild(dot);
    }
}

function updateTripProgress() {
    const progress = (tripState.completed / tripState.target) * 100;
    tripProgressFill.style.width = progress + '%';
    tripCount.textContent = `${tripState.completed} / ${tripState.target}`;
    totalFocusTime.textContent = tripState.totalFocusMinutes;
    totalBreakTime.textContent = tripState.totalBreakMinutes;
    currentStreak.textContent = tripState.streak;
    initTripDots();
}

function completeFocusSession() {
    tripState.completed++;
    
    if (tripState.focusStartTime) {
        const focusMinutes = Math.round((Date.now() - tripState.focusStartTime) / 60000);
        tripState.totalFocusMinutes += focusMinutes;
        addFocusTime(focusMinutes);
        tripState.focusStartTime = null;
    } else {
        const focusMinutes = parseInt(focusTimeInput.value) || 25;
        tripState.totalFocusMinutes += focusMinutes;
        addFocusTime(focusMinutes);
    }
    
    tripState.streak++;
    addSession();
    saveTripProgress();
    updateTripProgress();
    
    if (tripState.completed >= tripState.target) {
        addTrip();
        setTimeout(() => showTripCompleteModal(), 500);
    }
}

function completeBreakSession() {
    if (tripState.breakStartTime) {
        const breakMinutes = Math.round((Date.now() - tripState.breakStartTime) / 60000);
        tripState.totalBreakMinutes += breakMinutes;
        addBreakTime(breakMinutes);
        tripState.breakStartTime = null;
    } else {
        const breakMinutes = parseInt(breakTimeInput.value) || 5;
        tripState.totalBreakMinutes += breakMinutes;
        addBreakTime(breakMinutes);
    }
    saveTripProgress();
    updateTripProgress();
}

function showTripCompleteModal() {
    modalTrips.textContent = tripState.completed;
    modalTime.textContent = tripState.totalFocusMinutes;
    modalBreaks.textContent = tripState.totalBreakMinutes;
    modalOverlay.classList.add('show');
    createConfetti(100);
    playSound('complete');
}

function resetTrip() {
    tripState.completed = 0;
    tripState.totalFocusMinutes = 0;
    tripState.totalBreakMinutes = 0;
    tripState.focusStartTime = null;
    tripState.breakStartTime = null;
    saveTripProgress();
    updateTripProgress();
    switchToFocusMode();
    showNotification('Trip reset! Ready for a fresh start', '🔄');
}

function saveTripProgress() {
    const today = new Date().toDateString();
    const data = { date: today, ...tripState };
    localStorage.setItem('tripProgress', JSON.stringify(data));
}

function loadTripProgress() {
    const saved = localStorage.getItem('tripProgress');
    if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        if (data.date === today) {
            tripState.completed = data.completed || 0;
            tripState.totalFocusMinutes = data.totalFocusMinutes || 0;
            tripState.totalBreakMinutes = data.totalBreakMinutes || 0;
            tripState.streak = data.streak || 0;
            tripState.target = data.target || 4;
        } else {
            tripState.streak = data.streak || 0;
        }
    }
}

// =====================================================
// TIMER FUNCTIONS
// =====================================================
function updateDisplay() {
    timerDigits.textContent = formatTime(timerState.remainingSeconds);
    updateProgressRing(timerState.remainingSeconds, timerState.totalSeconds);
}

function startTimer() {
    if (timerState.isRunning) {
        clearInterval(timerState.intervalId);
        timerState.isRunning = false;
        timerState.isPaused = true;
        startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
            Resume`;
        showNotification('Timer paused', '⏸️');
        return;
    }

    if (!timerState.isPaused) {
        const inputValue = timerState.mode === 'focus' 
            ? parseInt(focusTimeInput.value) 
            : parseInt(breakTimeInput.value);
        
        if (isNaN(inputValue) || inputValue < 1) {
            showNotification('Please enter a valid time', '⚠️');
            return;
        }

        if (timerState.mode === 'break' && inputValue > 20) {
            breakTimeInput.value = 20;
            showNotification('Break time capped at 20 minutes', '⏰');
            timerState.totalSeconds = 20 * 60;
        } else {
            timerState.totalSeconds = inputValue * 60;
        }
        
        timerState.remainingSeconds = timerState.totalSeconds;
        
        if (timerState.mode === 'focus') {
            tripState.focusStartTime = Date.now();
        } else {
            tripState.breakStartTime = Date.now();
        }
    }

    timerState.isRunning = true;
    timerState.isPaused = false;

    startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        Pause`;

    initTripDots();

    timerState.intervalId = setInterval(() => {
        timerState.remainingSeconds--;
        updateDisplay();
        
        if (timerState.remainingSeconds <= 10 && timerState.remainingSeconds > 0) {
            tickAnimation();
            if (timerState.remainingSeconds <= 5) {
                playSound('tick');
            }
        }

        if (timerState.remainingSeconds <= 0) {
            clearInterval(timerState.intervalId);
            timerState.isRunning = false;
            
            if (timerState.mode === 'focus') {
                completeFocusSession();
                playSound('complete');
                createConfetti(30);
                
                if (tripState.completed >= tripState.target) {
                    startBtn.disabled = true;
                    breakBtn.disabled = true;
                } else {
                    showNotification('Focus complete! Take a well-deserved break', '🎉');
                    breakBtn.disabled = false;
                    breakBtn.classList.add('pulse-active');
                    startBtn.disabled = true;
                }
                showBrowserNotification('Focus Complete!', 'Great job! Time for a break.');
            } else {
                completeBreakSession();
                playSound('break');
                showNotification('Break over! Ready for the next focus session?', '💪');
                showBrowserNotification('Break Over!', 'Ready to focus again?');
                switchToFocusMode();
            }
        }
    }, 1000);

    updateDisplay();
    const modeText = timerState.mode === 'focus' ? 'Focus session started!' : 'Break started! Relax...';
    const modeIcon = timerState.mode === 'focus' ? '🚀' : '☕';
    showNotification(modeText, modeIcon);
}

function resetTimer() {
    clearInterval(timerState.intervalId);
    timerState.isRunning = false;
    timerState.isPaused = false;
    
    if (timerState.mode === 'focus') {
        timerState.totalSeconds = parseInt(focusTimeInput.value) * 60 || 25 * 60;
        tripState.focusStartTime = null;
    } else {
        timerState.totalSeconds = parseInt(breakTimeInput.value) * 60 || 5 * 60;
        tripState.breakStartTime = null;
    }
    
    timerState.remainingSeconds = timerState.totalSeconds;
    
    startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        ${timerState.mode === 'focus' ? 'Start Focus' : 'Start Break'}`;
    startBtn.disabled = false;
    
    updateDisplay();
    showNotification('Timer reset!', '🔄');
}

function switchToBreakMode() {
    timerState.mode = 'break';
    timerState.isRunning = false;
    timerState.isPaused = false;
    
    modeIndicator.textContent = 'Break Mode';
    modeIndicator.classList.remove('focus', 'stopwatch', 'stopwatch-break');
    modeIndicator.classList.add('break');
    progressRing.classList.add('break');
    progressRing.classList.remove('stopwatch', 'stopwatch-break');
    timerLabel.textContent = 'Break Time';
    
    let breakMinutes = parseInt(breakTimeInput.value) || 5;
    if (breakMinutes > 20) breakMinutes = 20;
    breakTimeInput.value = breakMinutes;
    
    timerState.totalSeconds = breakMinutes * 60;
    timerState.remainingSeconds = timerState.totalSeconds;
    
    startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Start Break`;
    startBtn.disabled = false;
    breakBtn.disabled = true;
    breakBtn.classList.remove('pulse-active');
    skipBtn.style.display = 'inline-flex';
    
    updateDisplay();
    initTripDots();
    showNotification('Enjoy your break! You earned it', '☕');
}

function switchToFocusMode() {
    timerState.mode = 'focus';
    timerState.isRunning = false;
    timerState.isPaused = false;
    
    modeIndicator.textContent = 'Focus Mode';
    modeIndicator.classList.remove('break', 'stopwatch', 'stopwatch-break');
    modeIndicator.classList.add('focus');
    progressRing.classList.remove('break', 'stopwatch', 'stopwatch-break');
    timerLabel.textContent = 'Focus Time';
    
    const focusMinutes = parseInt(focusTimeInput.value) || 25;
    timerState.totalSeconds = focusMinutes * 60;
    timerState.remainingSeconds = timerState.totalSeconds;
    
    startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Start Focus`;
    startBtn.disabled = false;
    breakBtn.disabled = true;
    breakBtn.classList.remove('pulse-active');
    skipBtn.style.display = 'none';
    
    updateDisplay();
    initTripDots();
}

function skipBreak() {
    if (timerState.mode === 'break') {
        clearInterval(timerState.intervalId);
        timerState.isRunning = false;
        
        if (tripState.breakStartTime) {
            const breakMinutes = Math.round((Date.now() - tripState.breakStartTime) / 60000);
            tripState.totalBreakMinutes += breakMinutes;
            addBreakTime(breakMinutes);
            tripState.breakStartTime = null;
        }
        
        saveTripProgress();
        updateTripProgress();
        switchToFocusMode();
        showNotification('Break skipped! Let\'s focus!', '⚡');
    }
}

// =====================================================
// STOPWATCH FUNCTIONS
// =====================================================
function updateStopwatchDisplay() {
    if (stopwatchState.mode === 'work') {
        timerDigits.textContent = formatTime(stopwatchState.elapsedSeconds);
        updateStopwatchProgressRing(stopwatchState.elapsedSeconds);
    } else {
        const remaining = stopwatchState.breakTotalSeconds - stopwatchState.breakElapsedSeconds;
        timerDigits.textContent = formatTime(Math.max(0, remaining));
        updateBreakProgressRing(remaining, stopwatchState.breakTotalSeconds);
    }
}

function updateStopwatchStats() {
    const workMinutes = Math.floor(stopwatchState.sessionWorkSeconds / 60);
    const breakMinutes = Math.floor(stopwatchState.sessionBreakSeconds / 60);
    
    stopwatchWorkTime.textContent = workMinutes;
    stopwatchBreakTime.textContent = breakMinutes;
    stopwatchLaps.textContent = stopwatchState.laps.length;
}

function startStopwatch() {
    if (stopwatchState.isRunning) {
        clearInterval(stopwatchState.intervalId);
        stopwatchState.isRunning = false;
        stopwatchState.isPaused = true;
        
        stopwatchStartBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
            Resume`;
        
        stopwatchStatus.textContent = 'Paused';
        showNotification('Stopwatch paused', '⏸️');
        return;
    }

    stopwatchState.isRunning = true;
    stopwatchState.isPaused = false;
    
    stopwatchStartBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        Pause`;
    
    lapBtn.disabled = false;
    
    if (stopwatchState.mode === 'work') {
        stopwatchStatus.textContent = 'Working';
        stopwatchBreakBtn.disabled = false;
    } else {
        stopwatchStatus.textContent = 'On Break';
    }

    stopwatchState.intervalId = setInterval(() => {
        if (stopwatchState.mode === 'work') {
            stopwatchState.elapsedSeconds++;
            stopwatchState.sessionWorkSeconds++;
        } else {
            stopwatchState.breakElapsedSeconds++;
            stopwatchState.sessionBreakSeconds++;
            
            const remaining = stopwatchState.breakTotalSeconds - stopwatchState.breakElapsedSeconds;
            
            if (remaining <= 10 && remaining > 0) {
                tickAnimation();
                if (remaining <= 5) {
                    playSound('tick');
                }
            }
            
            if (remaining <= 0) {
                finishStopwatchBreak();
                return;
            }
        }
        
        updateStopwatchDisplay();
        updateStopwatchStats();
    }, 1000);

    const modeText = stopwatchState.mode === 'work' ? 'Stopwatch started!' : 'Break timer running';
    showNotification(modeText, '⏱️');
}

function resetStopwatch() {
    clearInterval(stopwatchState.intervalId);
    
    if (stopwatchState.sessionWorkSeconds > 0) {
        addStopwatchWorkTime(Math.floor(stopwatchState.sessionWorkSeconds / 60));
    }
    if (stopwatchState.sessionBreakSeconds > 0) {
        addStopwatchBreakTime(Math.floor(stopwatchState.sessionBreakSeconds / 60));
    }
    
    stopwatchState.isRunning = false;
    stopwatchState.isPaused = false;
    stopwatchState.elapsedSeconds = 0;
    stopwatchState.savedElapsedSeconds = 0;
    stopwatchState.breakElapsedSeconds = 0;
    stopwatchState.laps = [];
    stopwatchState.lastLapTime = 0;
    stopwatchState.sessionWorkSeconds = 0;
    stopwatchState.sessionBreakSeconds = 0;
    stopwatchState.mode = 'work';
    
    progressRing.classList.remove('stopwatch-break');
    progressRing.classList.add('stopwatch');
    stopwatchTracker.classList.remove('on-break');
    
    stopwatchStartBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Start`;
    
    lapBtn.disabled = true;
    stopwatchBreakBtn.style.display = 'inline-flex';
    stopwatchBreakBtn.disabled = true;
    stopwatchResumeBtn.style.display = 'none';
    stopwatchStatus.textContent = 'Ready';
    
    modeIndicator.textContent = 'Stopwatch Mode';
    modeIndicator.classList.remove('stopwatch-break');
    modeIndicator.classList.add('stopwatch');
    timerLabel.textContent = 'Elapsed Time';
    
    updateStopwatchDisplay();
    updateStopwatchStats();
    renderLapTimes();
    
    showNotification('Stopwatch reset!', '🔄');
}

function recordLap() {
    if (!stopwatchState.isRunning || stopwatchState.mode !== 'work') return;
    
    const lapTime = stopwatchState.elapsedSeconds;
    const lapDiff = lapTime - stopwatchState.lastLapTime;
    
    stopwatchState.laps.push({
        number: stopwatchState.laps.length + 1,
        time: lapTime,
        diff: lapDiff
    });
    
    stopwatchState.lastLapTime = lapTime;
    
    playSound('lap');
    renderLapTimes();
    updateStopwatchStats();
    showNotification(`Lap ${stopwatchState.laps.length} recorded!`, '🏁');
}

function renderLapTimes() {
    if (stopwatchState.laps.length === 0) {
        lapTimesContainer.style.display = 'none';
        return;
    }
    
    lapTimesContainer.style.display = 'block';
    lapTimesList.innerHTML = '';
    
    [...stopwatchState.laps].reverse().forEach(lap => {
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lap.number}</span>
            <span class="lap-time">${formatTime(lap.time)}</span>
            <span class="lap-diff">+${formatTime(lap.diff)}</span>
        `;
        lapTimesList.appendChild(lapItem);
    });
}

function clearLaps() {
    stopwatchState.laps = [];
    stopwatchState.lastLapTime = stopwatchState.elapsedSeconds;
    renderLapTimes();
    updateStopwatchStats();
    showNotification('Laps cleared!', '🗑️');
}

function takeStopwatchBreak() {
    if (stopwatchState.mode === 'break') return;
    if (!stopwatchState.isRunning && stopwatchState.elapsedSeconds === 0) {
        showNotification('Start the stopwatch first!', '⚠️');
        return;
    }
    
    clearInterval(stopwatchState.intervalId);
    stopwatchState.savedElapsedSeconds = stopwatchState.elapsedSeconds;
    stopwatchState.mode = 'break';
    stopwatchState.breakElapsedSeconds = 0;
    stopwatchState.breakTotalSeconds = 20 * 60;
    stopwatchState.isRunning = false;
    stopwatchState.isPaused = false;
    
    modeIndicator.textContent = 'Stopwatch Break';
    modeIndicator.classList.remove('stopwatch');
    modeIndicator.classList.add('stopwatch-break');
    
    progressRing.classList.remove('stopwatch');
    progressRing.classList.add('stopwatch-break');
    
    timerLabel.textContent = 'Break Remaining';
    stopwatchStatus.textContent = 'Break Time';
    stopwatchTracker.classList.add('on-break');
    
    stopwatchBreakBtn.style.display = 'none';
    stopwatchResumeBtn.style.display = 'inline-flex';
    lapBtn.disabled = true;
    
    stopwatchStartBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Start Break`;
    
    updateStopwatchDisplay();
    
    playSound('break');
    showNotification(`Break time! 20 minutes. Your work time (${formatTime(stopwatchState.savedElapsedSeconds)}) is saved.`, '☕');
}

function finishStopwatchBreak() {
    clearInterval(stopwatchState.intervalId);
    stopwatchState.isRunning = false;
    
    stopwatchState.mode = 'work';
    stopwatchState.elapsedSeconds = stopwatchState.savedElapsedSeconds;
    stopwatchState.breakElapsedSeconds = 0;
    
    modeIndicator.textContent = 'Stopwatch Mode';
    modeIndicator.classList.remove('stopwatch-break');
    modeIndicator.classList.add('stopwatch');
    
    progressRing.classList.remove('stopwatch-break');
    progressRing.classList.add('stopwatch');
    
    timerLabel.textContent = 'Elapsed Time';
    stopwatchStatus.textContent = 'Ready';
    stopwatchTracker.classList.remove('on-break');
    
    stopwatchBreakBtn.style.display = 'inline-flex';
    stopwatchBreakBtn.disabled = true;
    stopwatchResumeBtn.style.display = 'none';
    
    stopwatchStartBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Resume`;
    
    updateStopwatchDisplay();
    updateStopwatchStats();
    
    playSound('complete');
    createConfetti(30);
    showNotification(`Break over! Resume from ${formatTime(stopwatchState.savedElapsedSeconds)}`, '💪');
    showBrowserNotification('Break Over!', 'Ready to continue working?');
}

function resumeStopwatchWork() {
    if (stopwatchState.mode === 'work') return;
    
    clearInterval(stopwatchState.intervalId);
    
    if (stopwatchState.breakElapsedSeconds > 0) {
        stopwatchState.sessionBreakSeconds += stopwatchState.breakElapsedSeconds;
    }
    
    stopwatchState.mode = 'work';
    stopwatchState.elapsedSeconds = stopwatchState.savedElapsedSeconds;
    stopwatchState.breakElapsedSeconds = 0;
    stopwatchState.isRunning = false;
    stopwatchState.isPaused = false;
    
    modeIndicator.textContent = 'Stopwatch Mode';
    modeIndicator.classList.remove('stopwatch-break');
    modeIndicator.classList.add('stopwatch');
    
    progressRing.classList.remove('stopwatch-break');
    progressRing.classList.add('stopwatch');
    
    timerLabel.textContent = 'Elapsed Time';
    stopwatchStatus.textContent = 'Ready';
    stopwatchTracker.classList.remove('on-break');
    
    stopwatchBreakBtn.style.display = 'inline-flex';
    stopwatchBreakBtn.disabled = true;
    stopwatchResumeBtn.style.display = 'none';
    
    stopwatchStartBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Resume`;
    
    updateStopwatchDisplay();
    updateStopwatchStats();
    
    showNotification(`Back to work! Resuming from ${formatTime(stopwatchState.savedElapsedSeconds)}`, '💪');
}

// =====================================================
// MODE SWITCHING FUNCTIONS
// =====================================================
function switchToTimerMode() {
    appMode = 'timer';
    
    if (stopwatchState.isRunning) {
        clearInterval(stopwatchState.intervalId);
        stopwatchState.isRunning = false;
        stopwatchState.isPaused = true;
    }
    
    timerModeTab.classList.add('active');
    stopwatchModeTab.classList.remove('active');
    
    tripTracker.style.display = 'block';
    stopwatchTracker.style.display = 'none';
    inputSection.style.display = 'block';
    timerButtonGroup.style.display = 'flex';
    stopwatchButtonGroup.style.display = 'none';
    lapTimesContainer.style.display = 'none';
    
    if (timerState.mode === 'focus') {
        modeIndicator.textContent = 'Focus Mode';
        modeIndicator.className = 'mode-indicator focus';
    } else {
        modeIndicator.textContent = 'Break Mode';
        modeIndicator.className = 'mode-indicator break';
    }
    
    progressRing.classList.remove('stopwatch', 'stopwatch-break');
    if (timerState.mode === 'break') {
        progressRing.classList.add('break');
    } else {
        progressRing.classList.remove('break');
    }
    
    updateDisplay();
    timerLabel.textContent = timerState.mode === 'focus' ? 'Focus Time' : 'Break Time';
}

function switchToStopwatchMode() {
    appMode = 'stopwatch';
    
    if (timerState.isRunning) {
        clearInterval(timerState.intervalId);
        timerState.isRunning = false;
        timerState.isPaused = true;
    }
    
    timerModeTab.classList.remove('active');
    stopwatchModeTab.classList.add('active');
    
    tripTracker.style.display = 'none';
    stopwatchTracker.style.display = 'block';
    inputSection.style.display = 'none';
    timerButtonGroup.style.display = 'none';
    stopwatchButtonGroup.style.display = 'flex';
    
    if (stopwatchState.mode === 'work') {
        modeIndicator.textContent = 'Stopwatch Mode';
        modeIndicator.className = 'mode-indicator stopwatch';
        progressRing.classList.add('stopwatch');
        progressRing.classList.remove('stopwatch-break', 'break');
        stopwatchTracker.classList.remove('on-break');
    } else {
        modeIndicator.textContent = 'Stopwatch Break';
        modeIndicator.className = 'mode-indicator stopwatch-break';
        progressRing.classList.add('stopwatch-break');
        progressRing.classList.remove('stopwatch', 'break');
        stopwatchTracker.classList.add('on-break');
    }
    
    updateStopwatchDisplay();
    timerLabel.textContent = stopwatchState.mode === 'work' ? 'Elapsed Time' : 'Break Remaining';
    renderLapTimes();
}

// =====================================================
// THEME & STYLE FUNCTIONS
// =====================================================
function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    const darkModeIcon = document.getElementById('darkModeIcon');
    if (darkModeIcon) {
        if (theme === 'dark') {
            darkModeIcon.innerHTML = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
        } else {
            darkModeIcon.innerHTML = '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>';
        }
    }
    
    if (theme !== 'dark') {
        previousTheme = theme;
        localStorage.setItem('previousTheme', theme);
    }
    
    localStorage.setItem('timerTheme', theme);
    showNotification(`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`, '🎨');
}

function changeTimerStyle(style) {
    const styles = ['modern', 'digital', 'elegant', 'mono', 'bold', 'handwritten', 'code', 'display'];
    styles.forEach(s => timerDigits.classList.remove(`style-${s}`));
    
    timerDigits.classList.add(`style-${style}`);
    
    styleBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.style === style) {
            btn.classList.add('active');
        }
    });
    
    localStorage.setItem('timerStyle', style);
}

// =====================================================
// FULLSCREEN & SOUND FUNCTIONS
// =====================================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            showNotification('Fullscreen not available', '⚠️');
        });
        document.body.classList.add('fullscreen');
        fullscreenBtn.querySelector('svg').innerHTML = 
            '<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>';
    } else {
        document.exitFullscreen();
        document.body.classList.remove('fullscreen');
        fullscreenBtn.querySelector('svg').innerHTML = 
            '<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>';
    }
}

function toggleSound() {
    timerState.soundEnabled = !timerState.soundEnabled;
    const soundIcon = document.getElementById('soundIcon');
    
    if (timerState.soundEnabled) {
        soundIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
        showNotification('Sound enabled', '🔊');
    } else {
        soundIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        showNotification('Sound muted', '🔇');
    }
    
    localStorage.setItem('timerSound', timerState.soundEnabled);
}

function toggleSettings() {
    settingsToggle.classList.toggle('open');
    settingsContent.classList.toggle('open');
}

// =====================================================
// BROWSER NOTIFICATIONS
// =====================================================
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showBrowserNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: '⏰',
            badge: '⏰',
            vibrate: [200, 100, 200]
        });
    }
}

// =====================================================
// EVENT LISTENERS
// =====================================================

// Mode tabs
timerModeTab.addEventListener('click', switchToTimerMode);
stopwatchModeTab.addEventListener('click', switchToStopwatchMode);

// Timer controls
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
breakBtn.addEventListener('click', switchToBreakMode);
skipBtn.addEventListener('click', skipBreak);

// Stopwatch controls
stopwatchStartBtn.addEventListener('click', startStopwatch);
stopwatchResetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);
stopwatchBreakBtn.addEventListener('click', takeStopwatchBreak);
stopwatchResumeBtn.addEventListener('click', resumeStopwatchWork);
clearLapsBtn.addEventListener('click', clearLaps);

// Floating buttons
fullscreenBtn.addEventListener('click', toggleFullscreen);
soundBtn.addEventListener('click', toggleSound);
resetTripBtn.addEventListener('click', () => {
    if (confirm('Reset your trip progress? Your streak will be kept.')) {
        resetTrip();
    }
});

statsBtn.addEventListener('click', () => {
    renderStats('daily');
    statsModalOverlay.classList.add('show');
});

if (darkModeBtn) {
    darkModeBtn.addEventListener('click', toggleDarkMode);
}

// Stats modal
statsCloseBtn.addEventListener('click', () => {
    statsModalOverlay.classList.remove('show');
});

statsModalOverlay.addEventListener('click', (e) => {
    if (e.target === statsModalOverlay) {
        statsModalOverlay.classList.remove('show');
    }
});

periodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        periodTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderStats(tab.dataset.period);
    });
});

// Settings toggle
settingsToggle.addEventListener('click', toggleSettings);

// Theme buttons
themeBtns.forEach(btn => {
    btn.addEventListener('click', () => changeTheme(btn.dataset.theme));
});

// Style buttons
styleBtns.forEach(btn => {
    btn.addEventListener('click', () => changeTimerStyle(btn.dataset.style));
});

// Input validation
breakTimeInput.addEventListener('change', () => {
    let value = parseInt(breakTimeInput.value);
    if (value > 20) {
        breakTimeInput.value = 20;
        showNotification('Maximum break time is 20 minutes', '⏰');
    }
    if (value < 1 || isNaN(value)) {
        breakTimeInput.value = 1;
    }
});

focusTimeInput.addEventListener('change', () => {
    let value = parseInt(focusTimeInput.value);
    if (value > 120) {
        focusTimeInput.value = 120;
        showNotification('Maximum focus time is 120 minutes', '⏰');
    }
    if (value < 1 || isNaN(value)) {
        focusTimeInput.value = 1;
    }
});

tripTargetInput.addEventListener('change', () => {
    let value = parseInt(tripTargetInput.value);
    if (value > 10) {
        tripTargetInput.value = 10;
        showNotification('Maximum 10 sessions per trip', '⏰');
    }
    if (value < 1 || isNaN(value)) {
        tripTargetInput.value = 1;
    }
    tripState.target = parseInt(tripTargetInput.value);
    saveTripProgress();
    updateTripProgress();
});

// Modal close
modalCloseBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
    resetTrip();
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('show');
    }
});

// Fullscreen change handler
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove('fullscreen');
        fullscreenBtn.querySelector('svg').innerHTML = 
            '<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            if (appMode === 'timer') {
                if (!startBtn.disabled) startTimer();
            } else {
                startStopwatch();
            }
            break;
        case 'KeyR':
            if (appMode === 'timer') {
                resetTimer();
            } else {
                resetStopwatch();
            }
            break;
        case 'KeyF':
            toggleFullscreen();
            break;
        case 'KeyM':
            toggleSound();
            break;
        case 'KeyB':
            if (appMode === 'timer') {
                if (!breakBtn.disabled) switchToBreakMode();
            } else {
                if (stopwatchState.mode === 'work') {
                    takeStopwatchBreak();
                } else {
                    resumeStopwatchWork();
                }
            }
            break;
        case 'KeyS':
            if (appMode === 'timer' && skipBtn.style.display !== 'none') {
                skipBreak();
            }
            break;
        case 'KeyL':
            if (appMode === 'stopwatch' && !lapBtn.disabled) {
                recordLap();
            }
            break;
        case 'KeyT':
            if (appMode === 'timer') {
                switchToStopwatchMode();
            } else {
                switchToTimerMode();
            }
            break;
        case 'KeyI':
            renderStats('daily');
            statsModalOverlay.classList.add('show');
            break;
        case 'KeyD':
            toggleDarkMode();
            break;
        case 'Escape':
            modalOverlay.classList.remove('show');
            statsModalOverlay.classList.remove('show');
            helpModalOverlay.classList.remove('show');
            break;
    }
});

// Request notification permission on first interaction
document.addEventListener('click', requestNotificationPermission, { once: true });

// Visibility change handler for accurate timing
let hiddenTime = null;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (timerState.isRunning || stopwatchState.isRunning) {
            hiddenTime = Date.now();
        }
    } else if (!document.hidden && hiddenTime) {
        const elapsedSeconds = Math.floor((Date.now() - hiddenTime) / 1000);
        hiddenTime = null;
        
        if (appMode === 'timer' && timerState.isRunning) {
            timerState.remainingSeconds = Math.max(0, timerState.remainingSeconds - elapsedSeconds);
            
            if (timerState.remainingSeconds <= 0) {
                clearInterval(timerState.intervalId);
                timerState.isRunning = false;
                timerState.remainingSeconds = 0;
                
                if (timerState.mode === 'focus') {
                    completeFocusSession();
                    playSound('complete');
                    createConfetti(30);
                    
                    if (tripState.completed >= tripState.target) {
                        showTripCompleteModal();
                    } else {
                        showNotification('Focus complete! Take a break', '🎉');
                        showBrowserNotification('Focus Complete!', 'Time for a break!');
                        breakBtn.disabled = false;
                        breakBtn.classList.add('pulse-active');
                        startBtn.disabled = true;
                    }
                } else {
                    completeBreakSession();
                    playSound('break');
                    showNotification('Break over!', '💪');
                    showBrowserNotification('Break Over!', 'Ready to focus?');
                    switchToFocusMode();
                }
            }
            updateDisplay();
        } else if (appMode === 'stopwatch' && stopwatchState.isRunning) {
            if (stopwatchState.mode === 'work') {
                stopwatchState.elapsedSeconds += elapsedSeconds;
                stopwatchState.sessionWorkSeconds += elapsedSeconds;
            } else {
                stopwatchState.breakElapsedSeconds += elapsedSeconds;
                stopwatchState.sessionBreakSeconds += elapsedSeconds;
                
                const remaining = stopwatchState.breakTotalSeconds - stopwatchState.breakElapsedSeconds;
                if (remaining <= 0) {
                    finishStopwatchBreak();
                    return;
                }
            }
            updateStopwatchDisplay();
            updateStopwatchStats();
        }
    }
});

// Prevent accidental page close during timer
window.addEventListener('beforeunload', (e) => {
    if (timerState.isRunning || stopwatchState.isRunning) {
        e.preventDefault();
        e.returnValue = 'Timer is running. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Save data periodically
setInterval(() => {
    if (stopwatchState.isRunning || timerState.isRunning) {
        saveStats();
    }
}, 60000);

// =====================================================
// ZEN MODE - Double click timer
// =====================================================
let zenMode = false;

timerCircle.addEventListener('dblclick', () => {
    zenMode = !zenMode;
    
    const elements = [
        document.querySelector('.header'),
        document.querySelector('.trip-tracker'),
        document.querySelector('#stopwatchTracker'),
        document.querySelector('.input-section'),
        document.querySelector('#timerButtonGroup'),
        document.querySelector('#stopwatchButtonGroup'),
        document.querySelector('.settings-panel'),
        document.querySelector('.mode-tabs'),
        document.querySelector('.lap-times-container')
    ];
    
    if (zenMode) {
        elements.forEach(el => {
            if (el) el.style.opacity = '0.15';
        });
        showNotification('Zen mode - double click timer to exit', '🧘');
    } else {
        elements.forEach(el => {
            if (el) el.style.opacity = '1';
        });
        showNotification('Zen mode off', '✨');
    }
});

// =====================================================
// HELP MODAL
// =====================================================
const helpBtn = document.getElementById('helpBtn');
const helpModalOverlay = document.getElementById('helpModalOverlay');
const helpCloseBtn = document.getElementById('helpCloseBtn');

if (helpBtn) {
    helpBtn.addEventListener('click', () => {
        helpModalOverlay.classList.add('show');
    });
}

if (helpCloseBtn) {
    helpCloseBtn.addEventListener('click', () => {
        helpModalOverlay.classList.remove('show');
    });
}

if (helpModalOverlay) {
    helpModalOverlay.addEventListener('click', (e) => {
        if (e.target === helpModalOverlay) {
            helpModalOverlay.classList.remove('show');
        }
    });
}

// Add '?' key to open help
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    if (e.key === '?' || (e.shiftKey && e.code === 'Slash')) {
        e.preventDefault();
        helpModalOverlay.classList.add('show');
    }
});

// =====================================================
// INITIALIZATION
// =====================================================
function init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('timerTheme') || 'violet';
    const savedPreviousTheme = localStorage.getItem('previousTheme') || 'violet';
    previousTheme = savedPreviousTheme;
    
    document.body.setAttribute('data-theme', savedTheme);
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        }
    });
    
    // Update dark mode icon based on saved theme
    const darkModeIcon = document.getElementById('darkModeIcon');
    if (darkModeIcon) {
        if (savedTheme === 'dark') {
            darkModeIcon.innerHTML = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
        } else {
            darkModeIcon.innerHTML = '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>';
        }
    }

    // Load saved timer style
    const savedStyle = localStorage.getItem('timerStyle');
    if (savedStyle) {
        changeTimerStyle(savedStyle);
    }

    // Load saved sound preference
    const savedSound = localStorage.getItem('timerSound');
    if (savedSound !== null) {
        timerState.soundEnabled = savedSound === 'true';
        if (!timerState.soundEnabled) {
            document.getElementById('soundIcon').innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        }
    }

    // Load trip progress
    loadTripProgress();
    
    // Load statistics
    loadStats();
    
    // Load saved trip target
    const savedTripData = localStorage.getItem('tripProgress');
    if (savedTripData) {
        const data = JSON.parse(savedTripData);
        if (data.target) {
            tripState.target = data.target;
            tripTargetInput.value = data.target;
        }
    }

    // Initialize display
    updateDisplay();
    updateTripProgress();
    updateStopwatchStats();

    // Set initial progress ring state
    progressRing.style.strokeDashoffset = 0;
    
    // Initialize stopwatch break button state
    stopwatchBreakBtn.disabled = true;

    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome! Press Space to start, ? for shortcuts', '👋');
    }, 800);
}
// =====================================================
// REAL-TIME CLOCK (12-Hour Format)
// =====================================================
function updateClock() {
    const now = new Date();
    
    // 12-hour format
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');
    
    const timeString = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
    
    // Format date - Full day and month names
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const dateString = `${dayName}, ${monthName} ${date}`;
    
    // Update Timer mode clock
    if (currentTimeEl) currentTimeEl.textContent = timeString;
    if (currentDateEl) currentDateEl.textContent = dateString;
    
    // Update Stopwatch mode clock
    if (swCurrentTimeEl) swCurrentTimeEl.textContent = timeString;
    if (swCurrentDateEl) swCurrentDateEl.textContent = dateString;
}

// Start clock - call immediately and every second
updateClock();
setInterval(updateClock, 1000);

// Run initialization
init();
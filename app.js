// Quotes database
const MOTIVATIONAL_QUOTES = [
  "Small daily improvements over time lead to stunning results.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "It is not what we do once in a while that shapes our lives. It's what we do consistently.",
  "An ounce of action is worth a ton of theory.",
  "First we make our habits, then our habits make us.",
  "Energy flows where attention goes. Focus on your daily loops."
];

const COLOR_MAP = {
  rose: {
    bg: 'bg-rose-500',
    bgLight: 'bg-rose-500/20',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
    iconColor: 'text-rose-300'
  },
  amber: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-500/20',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-300'
  },
  emerald: {
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-300'
  },
  blue: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-300'
  },
  violet: {
    bg: 'bg-violet-500',
    bgLight: 'bg-violet-500/20',
    text: 'text-violet-300',
    border: 'border-violet-500/30',
    iconColor: 'text-violet-300'
  }
};

const CATEGORY_META = {
  fitness: { label: 'Training', icon: 'dumbbell' },
  mind: { label: 'Focus', icon: 'brain-circuit' },
  productivity: { label: 'Work', icon: 'zap' },
  health: { label: 'Health', icon: 'heart' },
  creative: { label: 'Creative', icon: 'palette' }
};

// State manager & Seeder
const seedSampleHabits = () => {
  const today = new Date();
  const getOffsetDate = (daysAgo) => {
    const d = new Date();
    d.setDate(today.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'habit_sample_1',
      name: 'Drink 3L Water',
      category: 'health',
      color: 'blue',
      description: 'Keep hydrated throughout the day.',
      history: {
        [getOffsetDate(0)]: true,
        [getOffsetDate(1)]: true,
        [getOffsetDate(2)]: true,
        [getOffsetDate(3)]: true,
        [getOffsetDate(4)]: true,
        [getOffsetDate(6)]: true,
        [getOffsetDate(7)]: true,
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'habit_sample_2',
      name: 'Morning Meditation',
      category: 'mind',
      color: 'emerald',
      description: 'Find center and focus before starting the day.',
      history: {
        [getOffsetDate(0)]: true,
        [getOffsetDate(1)]: true,
        [getOffsetDate(2)]: true,
        [getOffsetDate(4)]: true,
        [getOffsetDate(5)]: true,
      },
      createdAt: new Date().toISOString()
    }
  ];
};

let habits = JSON.parse(localStorage.getItem('habitflow_habits'));
if (!habits || habits.length === 0) {
  habits = seedSampleHabits();
  localStorage.setItem('habitflow_habits', JSON.stringify(habits));
}

// DOM Elements
const quoteEl = document.getElementById('motivational-quote');
const habitsContainer = document.getElementById('habits-container');
const emptyState = document.getElementById('empty-state');
const modalHabit = document.getElementById('modal-habit');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnEmptyAdd = document.getElementById('btn-empty-add');
const habitForm = document.getElementById('habit-form');

// Stats Counters
const statCompletion = document.getElementById('stat-completion');
const statStreaks = document.getElementById('stat-streaks');
const statBestStreak = document.getElementById('stat-best-streak');
const statTotalCheckins = document.getElementById('stat-total-checkins');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setRandomQuote();
  renderHabits();
  setupEventListeners();
  lucide.createIcons();
});

function setRandomQuote() {
  const randIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  quoteEl.textContent = `"${MOTIVATIONAL_QUOTES[randIndex]}"`;
}

function setupEventListeners() {
  btnOpenModal.addEventListener('click', () => toggleModal(true));
  btnEmptyAdd.addEventListener('click', () => toggleModal(true));
  btnCloseModal.addEventListener('click', () => toggleModal(false));
  
  // Close modal when clicking outside
  modalHabit.addEventListener('click', (e) => {
    if (e.target === modalHabit) toggleModal(false);
  });

  // Handle Form Submission
  habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('habit-name').value.trim();
    const category = document.getElementById('habit-category').value;
    const color = document.querySelector('input[name="accent-color"]:checked').value;
    const desc = document.getElementById('habit-description').value.trim();

    if (!name) return;

    const newHabit = {
      id: 'habit_' + Date.now(),
      name,
      category,
      color,
      description: desc,
      history: {}, // Format: { "YYYY-MM-DD": true }
      createdAt: new Date().toISOString()
    };

    habits.push(newHabit);
    saveHabits();
    renderHabits();
    toggleModal(false);
    habitForm.reset();
  });
}

function toggleModal(open) {
  if (open) {
    modalHabit.classList.remove('hidden');
    document.getElementById('habit-name').focus();
  } else {
    modalHabit.classList.add('hidden');
  }
}

// Get standard YYYY-MM-DD representation
const getTodayStr = () => new Date().toISOString().split('T')[0];

// Generate last 30 calendar dates YYYY-MM-DD
function getPast30Days() {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function getHabitProgress(history) {
  const past30Days = getPast30Days();
  const completed = past30Days.reduce((count, date) => count + (history[date] ? 1 : 0), 0);
  const percent = past30Days.length ? Math.round((completed / past30Days.length) * 100) : 0;

  return {
    completed,
    total: past30Days.length,
    percent
  };
}

function getCategoryMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.creative;
}

function getMomentumCopy(current, best, progressPercent, completedToday) {
  if (completedToday && current >= 7) return 'Locked in today. The streak is breathing on its own.';
  if (current >= 10) return 'This loop is hot. Protect the chain and keep moving.';
  if (current >= 3) return 'Momentum is forming. Repeat the ritual and it will stick.';
  if (best >= 7) return 'You have proof this can work. Rebuild the rhythm.';
  if (progressPercent >= 60) return 'Strong month so far. One more tap adds real weight.';
  if (progressPercent >= 25) return 'The board is waking up. Keep the cadence steady.';
  return 'Fresh track, clean slate. One check-in starts the signal.';
}

// Save to localStorage
function saveHabits() {
  localStorage.setItem('habitflow_habits', JSON.stringify(habits));
  calculateOverallStats();
}

// Streak Calculator
function calculateStreak(history) {
  const dates = [];
  Object.keys(history).forEach(date => {
    if (history[date]) dates.push(new Date(date));
  });
  dates.sort((a, b) => b - a);

  if (dates.length === 0) return { current: 0, best: 0 };

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0,0,0,0);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0,0,0,0);

  // Check if today or yesterday is checked in to keep current streak alive
  let hasCheckedRecently = false;
  dates.forEach(d => {
    const dTime = d.getTime();
    if (dTime === today.getTime() || dTime === yesterday.getTime()) {
      hasCheckedRecently = true;
    }
  });

  if (!hasCheckedRecently) {
    currentStreak = 0;
  }

  // Calculate best and current streaks by iterating backwards in date index
  let trackingDate = new Date();
  trackingDate.setHours(0,0,0,0);
  
  let consecutive = true;

  for (let i = 0; i < 365; i++) {
    const checkStr = trackingDate.toISOString().split('T')[0];
    if (history[checkStr]) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
      if (consecutive) currentStreak = tempStreak;
    } else {
      if (i === 0) {
        // Today is skipped, keep checking
      } else {
        consecutive = false;
      }
      tempStreak = 0;
    }
    trackingDate.setDate(trackingDate.getDate() - 1);
  }

  return { current: currentStreak, best: bestStreak };
}

// Render dynamic elements
function renderHabits() {
  habitsContainer.innerHTML = '';
  
  if (habits.length === 0) {
    emptyState.classList.remove('hidden');
    habitsContainer.classList.add('hidden');
    calculateOverallStats();
    return;
  }

  emptyState.classList.add('hidden');
  habitsContainer.classList.remove('hidden');

  const past30Days = getPast30Days();
  const todayStr = getTodayStr();

  habits.forEach(habit => {
    const { current, best } = calculateStreak(habit.history);
    const colorStyles = COLOR_MAP[habit.color] || COLOR_MAP.rose;
    const categoryMeta = getCategoryMeta(habit.category);
    const isCompletedToday = habit.history[todayStr] === true;
    const { completed: checkins30, percent: progressPercent } = getHabitProgress(habit.history);
    const momentumCopy = getMomentumCopy(current, best, progressPercent, isCompletedToday);

    const card = document.createElement('div');
    card.className = 'habit-card glass-card relative overflow-hidden group';

    card.innerHTML = `
      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div class="flex-1 min-w-0">
          <div class="flex items-start gap-3.5 mb-4">
            ${getCategoryIconMarkup(habit.category, colorStyles)}
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h3 class="text-xl font-bold tracking-tight font-outfit truncate">${habit.name}</h3>
                <span class="habit-chip">${categoryMeta.label}</span>
                <span class="habit-chip ${isCompletedToday ? 'bg-emerald-500/12 text-emerald-200 border-emerald-500/20' : ''}">
                  ${isCompletedToday ? 'Today logged' : 'Awaiting today'}
                </span>
              </div>
              <p class="habit-microcopy">${habit.description || 'A loop worth protecting.'}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div class="glass-card rounded-2xl p-3 border border-slate-200/80">
              <div class="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold mb-1">Current streak</div>
              <div class="text-lg font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <i data-lucide="flame" class="w-4 h-4 ${colorStyles.text} fill-current"></i>
                ${current} days
              </div>
            </div>

            <div class="glass-card rounded-2xl p-3 border border-slate-200/80">
              <div class="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold mb-1">Best streak</div>
              <div class="text-lg font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4 text-violet-300"></i>
                ${best} days
              </div>
            </div>

            <div class="glass-card rounded-2xl p-3 border border-slate-200/80">
              <div class="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold mb-1">30-day pulse</div>
              <div class="text-lg font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <i data-lucide="calendar" class="w-4 h-4 text-sky-300"></i>
                ${checkins30}/30
              </div>
            </div>
          </div>

          <div class="mt-5 space-y-2">
            <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              <span>Momentum</span>
              <span>${progressPercent}% this month</span>
            </div>
            <div class="habit-progress-track">
              <div class="habit-progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <p class="habit-microcopy">${momentumCopy}</p>
          </div>
        </div>

        <div class="flex flex-col gap-3 lg:items-end flex-shrink-0">
          <button 
            data-action="toggle-today" 
            data-habit-id="${habit.id}"
            class="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-xs font-extrabold cursor-pointer shadow-sm transition-all active:scale-95 border ${isCompletedToday ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' : 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200'}"
          >
            <i data-lucide="${isCompletedToday ? 'check' : 'square'}" class="w-4 h-4"></i>
            ${isCompletedToday ? 'Logged Today' : 'Mark Done'}
          </button>

          <button 
            data-action="delete" 
            data-habit-id="${habit.id}"
            class="w-12 h-12 inline-flex items-center justify-center self-end rounded-2xl bg-rose-100 hover:bg-rose-200 border border-rose-200 text-rose-600 hover:text-rose-700 transition-all cursor-pointer active:scale-95"
            title="Delete Habit"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <div class="mt-6 pt-5 border-t border-slate-200/80">
        <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 mb-3">
          <span>Last 30 days</span>
          <span>Today is on the right →</span>
        </div>

        <div class="grid grid-cols-10 gap-1.5">
          ${past30Days.map((date) => {
            const checked = habit.history[date] === true;
            const formattedDate = formatDateLabel(date);
            return `
              <button
                data-habit-id="${habit.id}"
                data-date="${date}"
                class="day-indicator w-8 h-8 text-[8px] font-extrabold transition-all cursor-pointer ${checked ? `${colorStyles.bg} text-white active shadow-md shadow-violet-500/10` : ''}"
                title="${formattedDate}: ${checked ? 'Completed' : 'Missed'}"
              >
                <span>${date.split('-')[2]}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    habitsContainer.appendChild(card);
  });

  // Re-bind Lucide icons
  lucide.createIcons();
  calculateOverallStats();
}

function getCategoryIconMarkup(cat, colorStyles) {
  const meta = getCategoryMeta(cat);
  const iconName = meta.icon;

  return `
    <div class="habit-icon ${colorStyles.bgLight} ${colorStyles.text}">
      <i data-lucide="${iconName}" class="w-5 h-5"></i>
    </div>
  `;
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
}

// Handle action triggers
document.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;

  const habitId = button.dataset.habitId;
  const action = button.dataset.action;
  const targetDate = button.dataset.date;

  if (targetDate && habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      habit.history[targetDate] = !habit.history[targetDate];
      saveHabits();
      renderHabits();
    }
  } else if (action === 'toggle-today' && habitId) {
    const habit = habits.find(h => h.id === habitId);
    const todayStr = getTodayStr();
    if (habit) {
      habit.history[todayStr] = !habit.history[todayStr];
      saveHabits();
      renderHabits();
    }
  } else if (action === 'delete' && habitId) {
    if (confirm('Are you sure you want to delete this habit?')) {
      habits = habits.filter(h => h.id !== habitId);
      saveHabits();
      renderHabits();
    }
  }
});

// Overall dashboard analytics calculations
function calculateOverallStats() {
  if (habits.length === 0) {
    statCompletion.textContent = '0%';
    statStreaks.textContent = '0';
    statBestStreak.textContent = '0 days';
    statTotalCheckins.textContent = '0';
    return;
  }

  const past30Days = getPast30Days();
  let totalPossibleSlots = habits.length * 30;
  let actualCheckins30 = 0;
  let runningStreaksSum = 0;
  let maxStreakEver = 0;
  let totalAllTimeCheckins = 0;

  habits.forEach(habit => {
    const { current, best } = calculateStreak(habit.history);
    runningStreaksSum += current;
    if (best > maxStreakEver) maxStreakEver = best;

    past30Days.forEach(date => {
      if (habit.history[date]) actualCheckins30++;
    });

    Object.keys(habit.history).forEach(date => {
      if (habit.history[date]) totalAllTimeCheckins++;
    });
  });

  const completionPct = Math.round((actualCheckins30 / totalPossibleSlots) * 100) || 0;

  statCompletion.textContent = `${completionPct}%`;
  statStreaks.textContent = runningStreaksSum;
  statBestStreak.textContent = `${maxStreakEver} days`;
  statTotalCheckins.textContent = totalAllTimeCheckins;
}

# 🌟 HabitFlow — Premium Glassmorphic Habit Tracker

A cinematic, modern habit tracker built with a stunning **dark mode glassmorphism** UI. Designed to help you build streaks, track daily progress, and maintain consistency over a 30-day pulse.

---

## ✨ Features

- **Glassmorphic UI**: Beautiful, premium glossy design featuring dynamic ambient background lighting, vibrant gradients, and rich frosted-glass effects.
- **30-Day Pulse Calendar**: Visually track your performance over the last 30 days.
- **Streak Engine**: Automatically calculates your current running streak and your all-time best streak.
- **Local Storage Memory**: All habits and check-ins are securely saved directly in your browser's local storage—no database required.
- **Micro-interactions**: Smooth hover effects, modal transitions, and dynamic visual feedback when logging habits.
- **Category Tags & Colors**: Group habits by categories (Fitness, Mind, Work, Health, Creative) with color-coded tracking dots.
- **Motivational Dashboard**: Dynamic quotes and performance analytics (Completion Rate, Active Streaks).

---

## 🛠️ Technology Stack

- **HTML5** & **Vanilla JavaScript (ES6+)**
- **Vanilla CSS** with advanced Custom Properties (variables)
- **CSS Glassmorphism**: `backdrop-filter`, `linear-gradient` borders, inner shadows
- **Lucide Icons**: Beautiful, lightweight SVG icon system

---

## 🚀 Quick Start (Running Locally)

Since HabitFlow relies purely on frontend web technologies and `localStorage`, running it is incredibly simple.

### Method 1: Direct File Open
Simply double-click the `index.html` file to open it in your preferred modern web browser.

### Method 2: Local HTTP Server (Recommended)
If you prefer running it over localhost (which is better for handling strict browser security policies on local files):

1. **Python Server** (if Python 3 is installed):
   ```bash
   python -m http.server 8000
   ```
2. **Node.js Server** (if Node is installed):
   ```bash
   npx serve .
   ```
Then, open your browser and navigate to `http://localhost:8000`.

---

## 📁 Project Structure

```text
hackweek-2026-habit-streak-tracker/
├── index.html      # Main markup, semantic structure, and layout
├── styles.css      # Dark mode glassmorphic styling, animations, and responsive design
├── app.js          # Logic, streak calculations, localStorage manager, and DOM manipulation
└── README.md       # Project documentation
```

---

## 🎨 Design Philosophy

HabitFlow was built with the idea that tracking your habits shouldn't feel like a chore—it should feel like a reward. The UI incorporates:
- **Dark Mode Optimization**: Deep backgrounds with saturated neon highlights.
- **Frosted Glass (Glassmorphism)**: Simulating real glass cards with light reflection and blur.
- **Color Psychology**: Using specific colors to reinforce different types of habits.

---

*Built with ❤️ during HackWeek 2026.*

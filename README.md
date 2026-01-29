# 💰 Taka Tracker - Personal Finance Manager

A beautiful, modern Progressive Web App (PWA) for tracking expenses, managing savings, and achieving financial goals. Built with pure JavaScript, React, and optimized for mobile devices.

## ✨ Features

### 📊 Core Functionality
- **Income & Expense Tracking**: Set monthly income and log expenses with categories
- **Smart Savings Calculator**: Automatically calculates savings (Income - Expenses)
- **Goal Management**: Create multiple savings goals with progress tracking
- **Category System**: 7 pre-defined categories with color coding
- **Statistics Dashboard**: Visual charts and insights on spending patterns

### 🎨 User Experience
- ✅ Rocket loading animation (smooth, cartoonic)
- ✅ Dark mode with seamless transitions
- ✅ Collapsible sections for better navigation
- ✅ Bottom navigation (Home, Stats, Goals)
- ✅ Glassmorphism/modern card design
- ✅ Micro-interactions and button feedback
- ✅ Mobile-first responsive design
- ✅ 60fps smooth CSS animations

### 💾 Data & Storage
- All data stored locally (localStorage)
- No backend required
- No Firebase authentication needed
- Works completely offline after first load
- Data persists between sessions

### 📱 PWA Capabilities
- Installable as standalone app
- Offline-ready with service worker
- Home screen icon support
- Fast loading (<1 second)
- Works on budget Android phones (tested on Galaxy M05)

## 🎯 Three-Tab Navigation

### 1. Home Tab 🏠
- Monthly income display with quick edit
- Expense entry form (amount, category, date, note)
- Summary cards (Income, Expenses, Savings)
- Recent expenses list (collapsible)
- Quick delete functionality

### 2. Stats Tab 📊
- Overview cards with totals
- Category-wise spending (animated column chart)
- Last 7 days daily spending chart
- Insights cards:
  - Top spending category
  - Average daily spending
  - Total transactions

### 3. Goals Tab 🎯
- Current savings display
- Goal creation with:
  - Goal name
  - Target amount
  - Optional image upload
- Progress bars with percentages
- Edit/Delete functionality
- Motivational messages

## 🎨 Category System

| Category | Icon | Color |
|----------|------|-------|
| Food | 🍔 | Red |
| Transport | 🚗 | Blue |
| Shopping | 🛍️ | Pink |
| Bills | 💡 | Orange |
| Entertainment | 🎮 | Purple |
| Health | ⚕️ | Green |
| Other | 📦 | Gray |

## 🚀 Getting Started

### Installation

1. **Download the files**: Extract the ZIP file to your desired location

2. **Open the app**: 
   - Simply open `index.html` in a modern web browser
   - Or serve using a local web server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Install as PWA** (optional):
   - On mobile: Tap "Add to Home Screen" in browser menu
   - On desktop: Click install icon in address bar

### First Time Setup

1. Set your monthly income using the edit button (✏️)
2. Start adding expenses using the form
3. Create savings goals in the Goals tab
4. Watch your progress grow!

## 📁 File Structure

```
taka-tracker/
├── index.html              # Main HTML with PWA setup
├── app.js                  # React components and logic
├── styles.css              # Custom styles with animations
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── icon-192.png            # App icon (192x192)
├── icon-512.png            # App icon (512x512)
├── create-icons.html       # Icon generator helper
└── README.md               # This file
```

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: Pure HTML/CSS/JavaScript
- **Framework**: React 18 (via CDN)
- **Styling**: Tailwind CSS + Custom CSS
- **Transpiler**: Babel (for JSX)
- **Storage**: localStorage
- **PWA**: Service Worker + Web App Manifest

### Browser Requirements
- Modern browser with ES6+ support
- localStorage support
- Service Worker support (for PWA features)
- Recommended: Chrome 90+, Firefox 88+, Safari 14+

### Performance
- Initial load: <1 second
- Animations: 60fps smooth
- Offline-capable after first load
- Storage limit: ~5MB
- Optimized for low-end devices

## 🎨 Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #0d9488;        /* Teal */
    --secondary: #06b6d4;      /* Cyan */
    --accent: #8b5cf6;         /* Purple */
    /* ... more colors ... */
}
```

### Adding New Categories
Edit `CATEGORIES` object in `app.js`:
```javascript
const CATEGORIES = {
    YourCategory: { icon: '🎨', color: 'cat-custom' },
    // ... existing categories ...
};
```

Then add corresponding color class in `styles.css`:
```css
.cat-custom { 
    background: rgba(123, 45, 67, 0.2); 
    color: #7b2d43; 
}
```

## 📊 Data Structure

### Expense Object
```javascript
{
    id: 1234567890,
    amount: 500,
    category: "Food",
    date: "2026-01-29",
    note: "Lunch at restaurant",
    timestamp: "2026-01-29T12:00:00.000Z"
}
```

### Goal Object
```javascript
{
    id: 1234567890,
    name: "New Laptop",
    targetAmount: 50000,
    image: "data:image/png;base64,...",
    createdDate: "2026-01-29T12:00:00.000Z"
}
```

## 🔒 Privacy & Security

- ✅ All data stored locally on your device
- ✅ No data sent to external servers
- ✅ No tracking or analytics
- ✅ No account registration required
- ✅ Complete offline functionality
- ✅ Your data never leaves your device

## 🐛 Troubleshooting

### App won't load
- Clear browser cache and reload
- Check browser console for errors
- Ensure JavaScript is enabled
- Try incognito/private mode

### Data not saving
- Check localStorage is enabled
- Ensure sufficient storage space
- Try clearing old data
- Check browser permissions

### PWA won't install
- Ensure HTTPS connection (or localhost)
- Check manifest.json is loading
- Verify service worker registration
- Try different browser

### Performance issues
- Clear browser cache
- Reduce number of expenses
- Export old data and start fresh
- Update browser to latest version

## 🎯 Future Enhancements

- [ ] Export data as CSV
- [ ] Budget limits per category
- [ ] Recurring expenses
- [ ] Multiple currency support
- [ ] Data backup to cloud (optional)
- [ ] Monthly reports
- [ ] Spending predictions
- [ ] Category customization
- [ ] Bill reminders
- [ ] Receipt photo attachments

## 📱 Mobile Optimization

### Touch Targets
- Minimum 44px tap targets
- Comfortable spacing between buttons
- Large, easy-to-use form inputs
- Smooth scrolling behavior

### Animations
- Hardware-accelerated transforms
- CSS animations for 60fps
- Optimized for low-end devices
- Reduced motion support

### Network
- Works offline completely
- Minimal initial load
- No external dependencies (after first load)
- Progressive enhancement

## 🤝 Contributing

Feel free to fork and customize this project for your needs! If you make improvements:

1. Test on multiple devices
2. Ensure offline functionality works
3. Keep animations smooth (60fps)
4. Maintain mobile-first approach
5. Update documentation

## 📄 License

This project is free to use for personal and commercial purposes. No attribution required, but always appreciated!

## 🙏 Credits

- Built with React, Tailwind CSS, and lots of ☕
- Emoji icons from system fonts
- Inspired by modern finance apps
- Designed for real-world daily use

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure all files are in same directory
4. Try different browser

---

**Made with 💚 for smart money management**

Start tracking your expenses today! 🚀

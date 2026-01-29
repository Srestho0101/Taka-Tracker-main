# 🚀 Quick Setup Guide - Taka Tracker

## 📦 What You Have

After extracting the ZIP file, you should have these files:
```
taka-tracker/
├── index.html              ← Open this file!
├── app.js                  
├── styles.css              
├── manifest.json           
├── service-worker.js       
├── icon-192.png            
├── icon-512.png            
├── README.md               
└── SETUP_GUIDE.md         ← You are here!
```

## ⚡ Fastest Way to Start (30 seconds)

### Option 1: Direct Browser Open (Easiest)
1. **Double-click** `index.html`
2. It will open in your default browser
3. Start using immediately! ✨

**Note**: Some features like PWA installation work best with a local server (see Option 2).

### Option 2: Local Server (Recommended)
Choose one method based on what you have installed:

#### Using Python (Most Common)
```bash
# Navigate to the folder
cd path/to/taka-tracker

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open: `http://localhost:8000`

#### Using Node.js
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run server
cd path/to/taka-tracker
http-server -p 8000
```
Then open: `http://localhost:8000`

#### Using PHP
```bash
cd path/to/taka-tracker
php -S localhost:8000
```
Then open: `http://localhost:8000`

#### Using VS Code
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📱 Install on Phone (Android)

### Method 1: Direct File Transfer
1. Copy entire `taka-tracker` folder to your phone
2. Open `index.html` with Chrome browser
3. Tap menu (⋮) → "Add to Home Screen"
4. Confirm installation
5. App icon appears on home screen! 🎉

### Method 2: Via Local Server (Better)
1. Run local server on computer (see above)
2. Find your computer's IP address:
   - Windows: `ipconfig` 
   - Mac/Linux: `ifconfig` or `ip addr`
3. On phone, open Chrome and go to: `http://YOUR_IP:8000`
   - Example: `http://192.168.1.100:8000`
4. Tap menu (⋮) → "Add to Home Screen"
5. App installs with full PWA features! ✨

**Requirements**: Phone and computer must be on same Wi-Fi network.

## 🎯 First Time Usage

### Step 1: Set Your Income
1. Open the app
2. Click the edit button (✏️) on the Income card
3. Enter your monthly income
4. Click "Save"

### Step 2: Add Your First Expense
1. Fill out the "Add Expense" form:
   - Amount: e.g., 500
   - Category: Choose from dropdown
   - Date: Today's date (default)
   - Note: Optional description
2. Click "Add Expense"
3. See it appear in your list! 🎉

### Step 3: Create a Goal (Optional)
1. Tap "Goals" tab at bottom
2. Click "+ Add Goal" button
3. Enter:
   - Goal name (e.g., "New Laptop")
   - Target amount (e.g., 50000)
   - Upload image (optional)
4. Click "Create Goal"
5. Watch your progress grow! 📈

### Step 4: View Statistics
1. Tap "Stats" tab at bottom
2. See beautiful charts of your spending
3. Get insights on spending patterns
4. Track your financial progress! 📊

## 🎨 Using the App

### Home Tab 🏠
- **Income Card**: Shows monthly income, click ✏️ to edit
- **Expense Form**: Quick entry for new expenses
- **Summary Cards**: Overview of income, expenses, savings
- **Recent Expenses**: Collapsible list, tap header to expand

### Stats Tab 📊
- **Overview Cards**: Total income, expenses, savings
- **Category Chart**: Visual spending breakdown
- **Weekly Chart**: Last 7 days spending pattern
- **Insights**: Top categories and averages

### Goals Tab 🎯
- **Current Savings**: Your available savings
- **Goal Cards**: Each goal shows progress
- **Progress Bar**: Visual representation
- **Edit/Delete**: Manage your goals

## 💡 Pro Tips

### Data Management
- ✅ Data saves automatically
- ✅ Works offline (after first load)
- ✅ No internet needed
- ✅ Survives browser restart

### Best Practices
1. **Set income first** - This calculates your savings
2. **Log daily** - More accurate tracking
3. **Use categories** - Better insights
4. **Add notes** - Remember what you bought
5. **Create goals** - Stay motivated!

### Dark Mode
- Toggle with 🌙/☀️ button in header
- Preference saves automatically
- Easy on eyes at night

## 🔧 Troubleshooting

### "App won't open"
- **Solution**: Ensure all files are in same folder
- Try opening `index.html` directly
- Check browser console (F12) for errors

### "Data disappeared"
- **Cause**: Browser cleared localStorage
- **Prevention**: 
  - Don't clear browser data
  - Don't use incognito mode for regular use
  - Export data regularly (future feature)

### "Can't install PWA"
- **Need HTTPS**: Use local server or file:// protocol
- **Try different browser**: Chrome works best
- **Check console**: F12 → Console for errors

### "Slow performance"
- **Clear browser cache**: Ctrl+Shift+Del
- **Update browser**: Use latest version
- **Too many expenses**: Archive old data
- **Old phone**: App is optimized, but very old devices may struggle

### "Charts not showing"
- **Need data**: Add some expenses first
- **Check categories**: Ensure expenses have categories
- **Refresh page**: Ctrl+R or F5

## 📊 Understanding the Data

### Where is data stored?
- In browser's localStorage
- Specific to your device + browser
- Not synced across devices
- Maximum ~5MB storage

### What gets saved?
- Monthly income
- All expenses (amount, category, date, note)
- Manual savings adjustments
- All created goals
- Theme preference (light/dark)

### Data Privacy
- ✅ Stays on your device
- ✅ Never sent anywhere
- ✅ No tracking
- ✅ No analytics
- ✅ 100% private

## 🎓 Example Usage

### Scenario: First Month
```
Day 1:  Set income = ৳30,000
Day 2:  Expense = ৳500 (Food - Lunch)
Day 3:  Expense = ৳200 (Transport - Bus fare)
Day 5:  Expense = ৳1,500 (Shopping - Groceries)
Day 7:  Create Goal = "New Phone" ৳15,000
Day 10: Check stats - See spending patterns
Day 15: Adjust budget based on insights
Month end: Review total expenses and savings
```

### Categories Example
```
Food:          Daily meals, snacks, dining out
Transport:     Bus, taxi, fuel, parking
Shopping:      Groceries, clothes, gadgets
Bills:         Electricity, water, rent, phone
Entertainment: Movies, games, subscriptions
Health:        Medicine, doctor visits, gym
Other:         Everything else
```

## 📱 Mobile Experience

### Gestures
- **Tap**: Select/interact
- **Long press**: No special action (yet)
- **Swipe down**: Refresh page
- **Pull to refresh**: Standard browser behavior

### Screen Sizes
- Optimized for phones (320px - 640px)
- Works on tablets
- Usable on desktop
- Responsive design throughout

## 🌟 Advanced Usage

### Export Data (Manual)
1. Open browser console (F12)
2. Type: `localStorage`
3. Copy the data
4. Save to text file
5. Keep as backup

### Import Data (Manual)
1. Open browser console (F12)
2. Paste saved localStorage data
3. Reload page
4. Data restored!

### Clear All Data
1. Settings → Clear browsing data
2. Check "Cookies and site data"
3. Select time range
4. Clear data

**Warning**: This deletes all your expense data!

## 🎯 What's Next?

After setup, explore:
1. ✅ Add various expense types
2. ✅ Try different categories
3. ✅ Create multiple goals
4. ✅ Check stats regularly
5. ✅ Toggle dark mode
6. ✅ Share with friends!

## 📞 Need Help?

1. **Read README.md** - Comprehensive guide
2. **Check browser console** - F12 for errors
3. **Try different browser** - Chrome recommended
4. **Test on another device** - Isolate issues
5. **Review code** - It's all readable JavaScript!

## 🎉 You're All Set!

Your Taka Tracker is ready to use. Start managing your finances smartly! 💰

---

**Quick Links:**
- 📖 Full documentation: `README.md`
- 💻 App files: All in same folder
- 🌐 Open app: `index.html`

**Happy tracking! 🚀**

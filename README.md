# 💰 Expense & Budget Visualizer

A mobile-friendly web application for tracking daily expenses and visualizing spending patterns by category. Built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- **Real-time Balance Tracking**: See your total balance, income, and expenses at a glance
- **Transaction Management**: Add, view, and delete income/expense transactions
- **Visual Analytics**: Interactive donut chart showing spending breakdown by category
- **Smart Filtering**: Filter transactions by all, expenses only, or income only
- **Category Icons**: Visual category identification with emojis
- **Local Storage**: All data persists in your browser - no backend required
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Getting Started

### Simple Setup

1. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari)
2. Start adding your transactions!

No installation, no build process, no dependencies required.

### Alternative: Run with Local Server

For better development experience:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
Kiro3/
├── index.html          # Main HTML structure
├── css/
│   └── style.css      # All styling (single file)
├── js/
│   └── app.js         # All functionality (single file)
└── README.md          # Documentation
```

## 💡 How to Use

### Adding a Transaction

1. Enter a description (e.g., "Grocery shopping")
2. Enter the amount (e.g., 45.99)
3. Select type (Expense or Income)
4. Choose a category
5. Click "Add Transaction"

### Viewing Transactions

- View all transactions in the history section
- Filter by All, Expenses, or Income
- See transaction details including date and category
- Delete individual transactions with the ✕ button

### Understanding the Chart

- The donut chart visualizes expense distribution by category
- Hover over the legend to see percentage breakdown
- Total expenses are displayed in the center
- Chart updates automatically when transactions change

## 🎨 Categories

### Expense Categories
- 🍔 Food
- 🚗 Transport
- 🛍️ Shopping
- 🎬 Entertainment
- 💡 Bills
- 🏥 Health
- 📦 Other

### Income Categories
- 💼 Salary
- 💻 Freelance
- 📈 Investment
- 🎁 Gift
- 📦 Other

## 🔒 Data Privacy

- All data is stored locally in your browser using Local Storage
- No data is sent to any server
- Clear your browser data to reset the app
- Use "Clear All" button to remove all transactions

## 🌐 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Experience

- Fully responsive design
- Touch-optimized interface
- Works offline once loaded
- Can be added to home screen as a web app

## ⚙️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with CSS variables, flexbox, and grid
- **Vanilla JavaScript**: No frameworks or libraries
- **Local Storage API**: Client-side data persistence
- **Canvas API**: Custom chart rendering

### Key Features Implementation
- Object-oriented architecture with ES6 classes
- Event-driven programming
- Responsive canvas-based charting
- Efficient DOM manipulation
- Clean separation of concerns

## 🛠️ Customization

### Changing Colors

Edit the CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #6366f1;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* Add more customizations */
}
```

### Adding New Categories

Edit the category arrays in `js/app.js`:

```javascript
const expenseCategories = [
    { value: 'food', label: '🍔 Food' },
    // Add new categories here
];
```

## 📊 Features Breakdown

| Feature | Description |
|---------|-------------|
| Balance Card | Shows total balance, income, and expenses |
| Transaction Form | Add new income/expense entries |
| Visual Chart | Donut chart with category breakdown |
| History List | Scrollable list of all transactions |
| Filters | View all, expenses only, or income only |
| Date Display | Smart relative dates (Today, Yesterday, etc.) |
| Animations | Smooth transitions and slide-in effects |

## 🔄 Future Enhancement Ideas

- Export data to CSV
- Multiple currency support
- Budget goals and alerts
- Recurring transactions
- Monthly/yearly reports
- Dark mode theme
- PWA installation support

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork, modify, and use this project. Suggestions and improvements are welcome!

---

**Note**: This is a client-side only application. For production use with multiple devices, consider adding a backend API and authentication system.

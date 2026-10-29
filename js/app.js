// Expense & Budget Visualizer App

class BudgetTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.chart = null;
        this.theme = this.loadTheme();
        this.selectedMonth = new Date();
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.updateUI();
        this.renderChart();
        this.applyTheme();
        this.updateMonthlySummary();
    }

    // Theme Management
    loadTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.saveTheme(this.theme);
        this.applyTheme();
        // Redraw chart to update colors
        this.renderChart();
    }

    // Local Storage Operations
    loadTransactions() {
        const data = localStorage.getItem('transactions');
        return data ? JSON.parse(data) : [];
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    // Event Listeners
    attachEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Form submission
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Clear all button
        document.getElementById('clearAll').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all transactions?')) {
                this.clearAllTransactions();
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Update category options based on type
        document.getElementById('type').addEventListener('change', (e) => {
            this.updateCategoryOptions(e.target.value);
        });

        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.changeMonth(1);
        });

        // Sort dropdown
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTransactions();
        });
    }

    // Add Transaction
    addTransaction() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;

        if (!description || !amount || amount <= 0) {
            alert('Please enter valid transaction details');
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
            category,
            date: new Date().toISOString()
        };

        this.transactions.unshift(transaction);
        this.saveTransactions();
        this.updateUI();
        this.renderChart();
        this.resetForm();
    }

    // Delete Transaction
    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveTransactions();
        this.updateUI();
        this.renderChart();
    }

    // Clear All Transactions
    clearAllTransactions() {
        this.transactions = [];
        this.saveTransactions();
        this.updateUI();
        this.renderChart();
    }

    // Filter Transactions
    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.renderTransactions();
    }

    getFilteredTransactions() {
        if (this.currentFilter === 'all') {
            return this.transactions;
        }
        return this.transactions.filter(t => t.type === this.currentFilter);
    }

    // Sort Transactions
    getSortedTransactions(transactions) {
        const sorted = [...transactions]; // Create a copy

        switch (this.currentSort) {
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'amount-desc':
                return sorted.sort((a, b) => b.amount - a.amount);
            case 'amount-asc':
                return sorted.sort((a, b) => a.amount - b.amount);
            case 'category':
                return sorted.sort((a, b) => a.category.localeCompare(b.category));
            default:
                return sorted;
        }
    }

    // Update Category Options
    updateCategoryOptions(type) {
        const categorySelect = document.getElementById('category');
        const expenseCategories = [
            { value: 'food', label: '🍔 Food' },
            { value: 'transport', label: '🚗 Transport' },
            { value: 'shopping', label: '🛍️ Shopping' },
            { value: 'entertainment', label: '🎬 Entertainment' },
            { value: 'bills', label: '💡 Bills' },
            { value: 'health', label: '🏥 Health' },
            { value: 'other', label: '📦 Other' }
        ];
        const incomeCategories = [
            { value: 'salary', label: '💼 Salary' },
            { value: 'freelance', label: '💻 Freelance' },
            { value: 'investment', label: '📈 Investment' },
            { value: 'gift', label: '🎁 Gift' },
            { value: 'other', label: '📦 Other' }
        ];

        const categories = type === 'expense' ? expenseCategories : incomeCategories;
        categorySelect.innerHTML = categories.map(cat => 
            `<option value="${cat.value}">${cat.label}</option>`
        ).join('');
    }

    // Calculate Totals
    calculateTotals() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expense;

        return { income, expense, balance };
    }

    // Calculate Category Totals
    getCategoryTotals() {
        const expenses = this.transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};

        expenses.forEach(transaction => {
            if (categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] += transaction.amount;
            } else {
                categoryTotals[transaction.category] = transaction.amount;
            }
        });

        return categoryTotals;
    }

    // Format Currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Format Date
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    // Get Category Icon
    getCategoryIcon(category) {
        const icons = {
            food: '🍔',
            transport: '🚗',
            shopping: '🛍️',
            entertainment: '🎬',
            bills: '💡',
            health: '🏥',
            salary: '💼',
            freelance: '💻',
            investment: '📈',
            gift: '🎁',
            other: '📦'
        };
        return icons[category] || '📦';
    }

    // Update UI
    updateUI() {
        this.updateBalance();
        this.renderTransactions();
        this.updateMonthlySummary();
    }

    // Update Balance Display
    updateBalance() {
        const { income, expense, balance } = this.calculateTotals();

        document.getElementById('totalBalance').textContent = this.formatCurrency(balance);
        document.getElementById('totalIncome').textContent = this.formatCurrency(income);
        document.getElementById('totalExpense').textContent = this.formatCurrency(expense);
    }

    // Render Transactions
    renderTransactions() {
        const transactionList = document.getElementById('transactionList');
        const filteredTransactions = this.getFilteredTransactions();
        const sortedTransactions = this.getSortedTransactions(filteredTransactions);

        if (sortedTransactions.length === 0) {
            transactionList.innerHTML = `
                <div class="empty-state">
                    <p>No transactions found. ${this.currentFilter !== 'all' ? 'Try a different filter.' : 'Add your first transaction above!'}</p>
                </div>
            `;
            return;
        }

        transactionList.innerHTML = sortedTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-icon">${this.getCategoryIcon(transaction.category)}</div>
                <div class="transaction-details">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-category">${transaction.category} • ${this.formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
                <button class="transaction-delete" onclick="app.deleteTransaction(${transaction.id})" title="Delete transaction">
                    ✕
                </button>
            </div>
        `).join('');
    }

    // Render Chart
    renderChart() {
        const canvas = document.getElementById('expenseChart');
        const ctx = canvas.getContext('2d');
        const categoryTotals = this.getCategoryTotals();
        const legendContainer = document.getElementById('chartLegend');

        // Clear previous chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set canvas size properly
        const containerWidth = canvas.offsetWidth;
        const containerHeight = canvas.offsetHeight;
        
        canvas.width = containerWidth * window.devicePixelRatio;
        canvas.height = containerHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const categories = Object.keys(categoryTotals);
        const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

        if (total === 0 || categories.length === 0) {
            // Draw empty state
            const isDark = this.theme === 'dark';
            ctx.fillStyle = isDark ? '#64748b' : '#cbd5e1';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No expenses to display', containerWidth / 2, containerHeight / 2);
            legendContainer.innerHTML = '<p style="text-align: center; color: #64748b;">Add expenses to see chart</p>';
            return;
        }

        // Color palette (matching the image style)
        const colors = [
            '#4ade80', // Green (Food)
            '#fb923c', // Orange (Fun/Entertainment)
            '#3b82f6', // Blue (Transport)
            '#f43f5e', // Red
            '#a855f7', // Purple
            '#eab308', // Yellow
            '#06b6d4', // Cyan
            '#ec4899'  // Pink
        ];

        // Calculate center and radius with proper padding
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const padding = 20; // Padding from edges (reduced for bigger chart)
        const radius = Math.min(containerWidth, containerHeight) / 2 - padding;

        let currentAngle = -Math.PI / 2;

        categories.forEach((category, index) => {
            const value = categoryTotals[category];
            const sliceAngle = (value / total) * 2 * Math.PI;

            // Draw slice
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Add subtle stroke between slices
            const isDark = this.theme === 'dark';
            ctx.strokeStyle = isDark ? '#1e293b' : '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            currentAngle += sliceAngle;
        });

        // Render legend with percentages
        legendContainer.innerHTML = categories.map((category, index) => {
            const value = categoryTotals[category];
            const percentage = ((value / total) * 100).toFixed(0);
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            return `
                <div class="legend-item">
                    <div class="legend-color" style="background: ${colors[index % colors.length]}"></div>
                    <span class="legend-label">${categoryName} ${percentage}%</span>
                </div>
            `;
        }).join('');
    }

    // Reset Form
    resetForm() {
        document.getElementById('transactionForm').reset();
        this.updateCategoryOptions('expense');
    }

    // Monthly Summary Functions
    changeMonth(direction) {
        this.selectedMonth.setMonth(this.selectedMonth.getMonth() + direction);
        this.updateMonthlySummary();
    }

    getMonthTransactions() {
        const year = this.selectedMonth.getFullYear();
        const month = this.selectedMonth.getMonth();
        
        return this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear() === year && 
                   transactionDate.getMonth() === month;
        });
    }

    updateMonthlySummary() {
        const monthTransactions = this.getMonthTransactions();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthDisplay = `${monthNames[this.selectedMonth.getMonth()]} ${this.selectedMonth.getFullYear()}`;
        document.getElementById('currentMonth').textContent = monthDisplay;

        // Calculate monthly totals
        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const savings = income - expense;
        const count = monthTransactions.length;

        // Update summary cards
        document.getElementById('monthlyIncome').textContent = this.formatCurrency(income);
        document.getElementById('monthlyExpense').textContent = this.formatCurrency(expense);
        document.getElementById('monthlySavings').textContent = this.formatCurrency(savings);
        document.getElementById('monthlySavings').className = 'summary-value ' + (savings >= 0 ? 'income' : 'expense');
        document.getElementById('monthlyCount').textContent = count;

        // Update top categories
        this.updateTopCategories(monthTransactions);
    }

    updateTopCategories(monthTransactions) {
        const expenses = monthTransactions.filter(t => t.type === 'expense');
        const categoryTotals = {};

        expenses.forEach(transaction => {
            if (categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] += transaction.amount;
            } else {
                categoryTotals[transaction.category] = transaction.amount;
            }
        });

        // Sort by amount and take top 5
        const sortedCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const topCategoriesList = document.getElementById('topCategoriesList');

        if (sortedCategories.length === 0) {
            topCategoriesList.innerHTML = '<div class="empty-summary">No expenses this month</div>';
            return;
        }

        const maxAmount = sortedCategories[0][1];

        topCategoriesList.innerHTML = sortedCategories.map(([category, amount]) => {
            const percentage = (amount / maxAmount) * 100;
            return `
                <div class="category-bar-item">
                    <div class="category-bar-label">
                        ${this.getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                    <div class="category-bar-container">
                        <div class="category-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="category-bar-amount">${this.formatCurrency(amount)}</div>
                </div>
            `;
        }).join('');
    }
}

// Initialize app
const app = new BudgetTracker();

// Redraw chart on window resize
window.addEventListener('resize', () => {
    app.renderChart();
});

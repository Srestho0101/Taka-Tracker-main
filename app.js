const { useState, useEffect } = React;

// Category configurations
const CATEGORIES = {
    Food: { icon: '🍔', color: 'cat-food' },
    Transport: { icon: '🚗', color: 'cat-transport' },
    Shopping: { icon: '🛍️', color: 'cat-shopping' },
    Bills: { icon: '💡', color: 'cat-bills' },
    Entertainment: { icon: '🎮', color: 'cat-entertainment' },
    Health: { icon: '⚕️', color: 'cat-health' },
    Other: { icon: '📦', color: 'cat-other' }
};

// Storage helper
class Storage {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage error:', error);
        }
    }
}

// Main App Component
function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [theme, setTheme] = useState(Storage.get('theme', 'light'));
    const [income, setIncome] = useState(Storage.get('income', 0));
    const [expenses, setExpenses] = useState(Storage.get('expenses', []));
    const [savings, setSavings] = useState(Storage.get('savings', 0));
    const [goals, setGoals] = useState(Storage.get('goals', []));

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        Storage.set('theme', theme);
    }, [theme]);

    useEffect(() => {
        Storage.set('income', income);
    }, [income]);

    useEffect(() => {
        Storage.set('expenses', expenses);
    }, [expenses]);

    useEffect(() => {
        Storage.set('savings', savings);
    }, [savings]);

    useEffect(() => {
        Storage.set('goals', goals);
    }, [goals]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const currentSavings = income - totalExpenses;

    return (
        <div className="app-container">
            <Header theme={theme} toggleTheme={toggleTheme} />
            
            <div className="page-container">
                {activeTab === 'home' && (
                    <HomePage 
                        income={income}
                        setIncome={setIncome}
                        expenses={expenses}
                        setExpenses={setExpenses}
                        savings={savings}
                        setSavings={setSavings}
                        totalExpenses={totalExpenses}
                        currentSavings={currentSavings}
                    />
                )}
                
                {activeTab === 'stats' && (
                    <StatsPage expenses={expenses} income={income} />
                )}
                
                {activeTab === 'goals' && (
                    <GoalsPage 
                        goals={goals}
                        setGoals={setGoals}
                        currentSavings={currentSavings}
                    />
                )}
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}

// Header Component
function Header({ theme, toggleTheme }) {
    return (
        <div className="header">
            <div className="header-content">
                <div className="app-title">
                    <span>💰</span>
                    <span>Taka Tracker</span>
                </div>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
        </div>
    );
}

// Home Page Component
function HomePage({ income, setIncome, expenses, setExpenses, savings, setSavings, totalExpenses, currentSavings }) {
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div>
            {/* Summary Cards */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div>
                        <div className="summary-label">Income</div>
                        <div className="summary-value summary-income">৳{income.toLocaleString()}</div>
                    </div>
                    <button className="btn-icon" onClick={() => setShowIncomeModal(true)}>✏️</button>
                </div>

                <div className="summary-card">
                    <div>
                        <div className="summary-label">Expenses</div>
                        <div className="summary-value summary-expense">৳{totalExpenses.toLocaleString()}</div>
                    </div>
                </div>

                <div className="summary-card">
                    <div>
                        <div className="summary-label">Savings</div>
                        <div className="summary-value summary-savings">৳{currentSavings.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Quick Expense Entry */}
            <div className="card mt-4">
                <h2 className="font-bold mb-4">Add Expense</h2>
                <ExpenseForm 
                    expenses={expenses}
                    setExpenses={setExpenses}
                />
            </div>

            {/* Recent Expenses */}
            <div className="mt-4">
                <div 
                    className="collapsible-header"
                    onClick={() => setShowHistory(!showHistory)}
                >
                    <h3 className="font-bold">Recent Expenses ({expenses.length})</h3>
                    <span>{showHistory ? '▼' : '▶'}</span>
                </div>
                <div className={`collapsible-content ${showHistory ? 'open' : ''}`}>
                    <ExpenseList expenses={expenses} setExpenses={setExpenses} />
                </div>
            </div>

            {/* Income Modal */}
            {showIncomeModal && (
                <IncomeModal 
                    income={income}
                    setIncome={setIncome}
                    onClose={() => setShowIncomeModal(false)}
                />
            )}
        </div>
    );
}

// Expense Form Component
function ExpenseForm({ expenses, setExpenses }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const newExpense = {
            id: Date.now(),
            amount: parseFloat(amount),
            category,
            date,
            note,
            timestamp: new Date().toISOString()
        };

        setExpenses([newExpense, ...expenses]);
        
        // Reset form
        setAmount('');
        setNote('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory('Food');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Amount (৳)</label>
                <input 
                    type="number"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    step="0.01"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {Object.keys(CATEGORIES).map(cat => (
                        <option key={cat} value={cat}>{CATEGORIES[cat].icon} {cat}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Note (Optional)</label>
                <textarea 
                    className="form-textarea"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                />
            </div>

            <button type="submit" className="btn btn-primary w-full">
                Add Expense
            </button>
        </form>
    );
}

// Expense List Component
function ExpenseList({ expenses, setExpenses }) {
    const handleDelete = (id) => {
        if (confirm('Delete this expense?')) {
            setExpenses(expenses.filter(exp => exp.id !== id));
        }
    };

    if (expenses.length === 0) {
        return (
            <div className="text-center mt-4" style={{color: 'var(--text-secondary)'}}>
                No expenses yet. Add your first expense above!
            </div>
        );
    }

    return (
        <div className="expense-list">
            {expenses.map(expense => (
                <div key={expense.id} className="expense-item">
                    <div className={`expense-icon ${CATEGORIES[expense.category].color}`}>
                        {CATEGORIES[expense.category].icon}
                    </div>
                    <div className="expense-details">
                        <div className="expense-category">{expense.category}</div>
                        {expense.note && <div className="expense-note">{expense.note}</div>}
                        <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div className="expense-amount">৳{expense.amount.toLocaleString()}</div>
                        <button 
                            className="btn-icon btn-danger"
                            onClick={() => handleDelete(expense.id)}
                            style={{padding: '8px', minWidth: '36px', height: '36px', fontSize: '18px'}}
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Income Modal Component
function IncomeModal({ income, setIncome, onClose }) {
    const [value, setValue] = useState(income);

    const handleSave = () => {
        if (value >= 0) {
            setIncome(parseFloat(value));
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Set Monthly Income</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="form-group">
                    <label className="form-label">Income Amount (৳)</label>
                    <input 
                        type="number"
                        className="form-input"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter your monthly income"
                        step="0.01"
                        autoFocus
                    />
                </div>

                <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                    <button className="btn btn-secondary" onClick={onClose} style={{flex: 1}}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} style={{flex: 1}}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

// Stats Page Component
function StatsPage({ expenses, income }) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const savings = income - totalExpenses;

    // Category breakdown
    const categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
    });

    // Sort categories by amount
    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);

    // Get max value for chart scaling
    const maxCategoryAmount = Math.max(...Object.values(categoryTotals), 1);

    // Weekly expenses
    const now = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayExpenses = expenses
            .filter(exp => exp.date === dateStr)
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        last7Days.push({
            date: dateStr,
            amount: dayExpenses,
            label: date.toLocaleDateString('en-US', { weekday: 'short' })
        });
    }

    const maxDailyAmount = Math.max(...last7Days.map(d => d.amount), 1);

    return (
        <div>
            {/* Overview Cards */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div>
                        <div className="summary-label">Total Income</div>
                        <div className="summary-value summary-income">৳{income.toLocaleString()}</div>
                    </div>
                </div>

                <div className="summary-card">
                    <div>
                        <div className="summary-label">Total Expenses</div>
                        <div className="summary-value summary-expense">৳{totalExpenses.toLocaleString()}</div>
                    </div>
                </div>

                <div className="summary-card">
                    <div>
                        <div className="summary-label">Net Savings</div>
                        <div className="summary-value summary-savings">৳{savings.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Spending by Category */}
            {sortedCategories.length > 0 && (
                <div className="chart-container mt-4">
                    <h3 className="font-bold mb-4">Spending by Category</h3>
                    <div className="chart-bars">
                        {sortedCategories.map(([category, amount]) => (
                            <div key={category} className="chart-bar">
                                <div 
                                    className="bar-column"
                                    style={{
                                        height: `${(amount / maxCategoryAmount) * 100}%`,
                                        minHeight: '20px'
                                    }}
                                >
                                    <div className="bar-value">৳{amount.toLocaleString()}</div>
                                </div>
                                <div className="bar-label">{CATEGORIES[category].icon}</div>
                                <div className="bar-label text-xs">{category}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Last 7 Days */}
            <div className="chart-container mt-4">
                <h3 className="font-bold mb-4">Last 7 Days</h3>
                <div className="chart-bars">
                    {last7Days.map((day, index) => (
                        <div key={index} className="chart-bar">
                            <div 
                                className="bar-column"
                                style={{
                                    height: day.amount > 0 ? `${(day.amount / maxDailyAmount) * 100}%` : '10px',
                                    minHeight: '10px',
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                {day.amount > 0 && (
                                    <div className="bar-value">৳{day.amount.toLocaleString()}</div>
                                )}
                            </div>
                            <div className="bar-label">{day.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insights */}
            {expenses.length > 0 && (
                <div className="card mt-4">
                    <h3 className="font-bold mb-4">Insights</h3>
                    
                    {sortedCategories.length > 0 && (
                        <div className="mb-4">
                            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Top Spending Category</div>
                            <div className="font-bold" style={{fontSize: '18px', marginTop: '4px'}}>
                                {CATEGORIES[sortedCategories[0][0]].icon} {sortedCategories[0][0]} - ৳{sortedCategories[0][1].toLocaleString()}
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Average Daily Spending</div>
                        <div className="font-bold" style={{fontSize: '18px', marginTop: '4px'}}>
                            ৳{(last7Days.reduce((sum, d) => sum + d.amount, 0) / 7).toFixed(2)}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Total Transactions</div>
                        <div className="font-bold" style={{fontSize: '18px', marginTop: '4px'}}>
                            {expenses.length}
                        </div>
                    </div>
                </div>
            )}

            {expenses.length === 0 && (
                <div className="card mt-4 text-center" style={{color: 'var(--text-secondary)'}}>
                    No expense data yet. Start tracking your expenses to see statistics!
                </div>
            )}
        </div>
    );
}

// Goals Page Component
function GoalsPage({ goals, setGoals, currentSavings }) {
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const handleEditGoal = (goal) => {
        setEditingGoal(goal);
        setShowGoalModal(true);
    };

    const handleDeleteGoal = (id) => {
        if (confirm('Delete this goal?')) {
            setGoals(goals.filter(g => g.id !== id));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold" style={{fontSize: '24px'}}>My Goals</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingGoal(null);
                        setShowGoalModal(true);
                    }}
                >
                    + Add Goal
                </button>
            </div>

            {/* Motivational Message */}
            <div className="card mb-4" style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                color: 'white'
            }}>
                <h3 className="font-bold mb-2">Current Savings</h3>
                <div style={{fontSize: '32px', fontWeight: '700'}}>
                    ৳{currentSavings.toLocaleString()}
                </div>
                <div style={{marginTop: '8px', opacity: 0.9}}>
                    {currentSavings > 0 ? "Great job saving! Keep it up! 🎯" : "Start saving towards your goals! 💪"}
                </div>
            </div>

            {/* Goal Grid */}
            {goals.length > 0 ? (
                <div className="goal-grid">
                    {goals.map(goal => {
                        const progress = Math.min((currentSavings / goal.targetAmount) * 100, 100);
                        return (
                            <div key={goal.id} className="goal-card">
                                {goal.image ? (
                                    <img src={goal.image} alt={goal.name} className="goal-image" />
                                ) : (
                                    <div className="goal-image" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '48px'
                                    }}>
                                        🎯
                                    </div>
                                )}
                                
                                <div className="goal-content">
                                    <div className="goal-name">{goal.name}</div>
                                    
                                    <div className="goal-progress-bar">
                                        <div 
                                            className="goal-progress-fill"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="goal-amount">
                                        <span style={{color: 'var(--text-secondary)'}}>
                                            {progress.toFixed(1)}% Complete
                                        </span>
                                        <span className="font-bold">
                                            ৳{currentSavings.toLocaleString()} / ৳{goal.targetAmount.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="goal-actions">
                                        <button 
                                            className="btn btn-secondary"
                                            style={{flex: 1}}
                                            onClick={() => handleEditGoal(goal)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            className="btn btn-danger"
                                            style={{flex: 1}}
                                            onClick={() => handleDeleteGoal(goal.id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="card text-center" style={{color: 'var(--text-secondary)'}}>
                    <div style={{fontSize: '64px', marginBottom: '16px'}}>🎯</div>
                    <h3 className="font-bold mb-2">No Goals Yet</h3>
                    <p>Create your first savings goal to get started!</p>
                </div>
            )}

            {/* Goal Modal */}
            {showGoalModal && (
                <GoalModal 
                    goal={editingGoal}
                    goals={goals}
                    setGoals={setGoals}
                    onClose={() => {
                        setShowGoalModal(false);
                        setEditingGoal(null);
                    }}
                />
            )}
        </div>
    );
}

// Goal Modal Component
function GoalModal({ goal, goals, setGoals, onClose }) {
    const [name, setName] = useState(goal?.name || '');
    const [targetAmount, setTargetAmount] = useState(goal?.targetAmount || '');
    const [image, setImage] = useState(goal?.image || '');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!name || !targetAmount || parseFloat(targetAmount) <= 0) {
            alert('Please fill in all required fields');
            return;
        }

        if (goal) {
            // Update existing goal
            setGoals(goals.map(g => 
                g.id === goal.id 
                    ? { ...g, name, targetAmount: parseFloat(targetAmount), image }
                    : g
            ));
        } else {
            // Create new goal
            const newGoal = {
                id: Date.now(),
                name,
                targetAmount: parseFloat(targetAmount),
                image,
                createdDate: new Date().toISOString()
            };
            setGoals([...goals, newGoal]);
        }

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{goal ? 'Edit Goal' : 'New Goal'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="form-group">
                    <label className="form-label">Goal Name</label>
                    <input 
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., New Laptop, Vacation, etc."
                        autoFocus
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Target Amount (৳)</label>
                    <input 
                        type="number"
                        className="form-input"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder="Enter target amount"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Goal Image (Optional)</label>
                    <input 
                        type="file"
                        className="form-input"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {image && (
                        <div style={{marginTop: '12px'}}>
                            <img 
                                src={image} 
                                alt="Preview" 
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '12px'
                                }}
                            />
                        </div>
                    )}
                </div>

                <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                    <button className="btn btn-secondary" onClick={onClose} style={{flex: 1}}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} style={{flex: 1}}>
                        {goal ? 'Update' : 'Create'} Goal
                    </button>
                </div>
            </div>
        </div>
    );
}

// Bottom Navigation Component
function BottomNav({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'stats', icon: '📊', label: 'Stats' },
        { id: 'goals', icon: '🎯', label: 'Goals' }
    ];

    return (
        <div className="bottom-nav">
            <div className="bottom-nav-content">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="nav-icon">{tab.icon}</span>
                        <span className="nav-label">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// Hide loading screen after app loads
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}, 2500);

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

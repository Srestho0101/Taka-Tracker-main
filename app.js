const { useState, useEffect, useRef } = React;

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

// Get month key from date
function getMonthKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Main App Component
function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [theme, setTheme] = useState(Storage.get('theme', 'light'));
    const [currentMonth, setCurrentMonth] = useState(Storage.get('currentMonth', getMonthKey()));
    const [months, setMonths] = useState(Storage.get('months', {}));
    const [globalSavings, setGlobalSavings] = useState(Storage.get('globalSavings', 0));
    const [savingsHistory, setSavingsHistory] = useState(Storage.get('savingsHistory', []));
    const [expenseTemplates, setExpenseTemplates] = useState(Storage.get('expenseTemplates', []));
    const [goals, setGoals] = useState(Storage.get('goals', []));
    const [showToast, setShowToast] = useState(null);

    // Initialize current month if it doesn't exist
    useEffect(() => {
        if (!months[currentMonth]) {
            setMonths(prev => {
                if (prev[currentMonth]) return prev; // Already initialized
                return {
                    ...prev,
                    [currentMonth]: {
                        income: 0,
                        expenses: [],
                        monthlySavings: null,
                        isActive: true,
                        startDate: new Date().toISOString()
                    }
                };
            });
        }
    }, [currentMonth, months]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        Storage.set('theme', theme);
    }, [theme]);

    useEffect(() => {
        Storage.set('months', months);
    }, [months]);

    useEffect(() => {
        Storage.set('currentMonth', currentMonth);
    }, [currentMonth]);

    useEffect(() => {
        Storage.set('globalSavings', globalSavings);
    }, [globalSavings]);

    useEffect(() => {
        Storage.set('savingsHistory', savingsHistory);
    }, [savingsHistory]);

    useEffect(() => {
        Storage.set('expenseTemplates', expenseTemplates);
    }, [expenseTemplates]);

    useEffect(() => {
        Storage.set('goals', goals);
    }, [goals]);

    // Toast notification
    const showToastMessage = (message, duration = 3000) => {
        setShowToast(message);
        setTimeout(() => setShowToast(null), duration);
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const currentMonthData = months[currentMonth] || {
        income: 0,
        expenses: [],
        monthlySavings: null,
        isActive: true,
        startDate: new Date().toISOString()
    };

    const totalExpenses = currentMonthData.expenses.reduce((sum, exp) => 
        exp.type === 'expense' ? sum + parseFloat(exp.amount) : sum, 0
    );
    
    const totalGoalContributions = currentMonthData.expenses.reduce((sum, exp) => 
        exp.type === 'goal' ? sum + parseFloat(exp.amount) : sum, 0
    );

    const leftoverMoney = currentMonthData.income - totalExpenses - totalGoalContributions;

    return (
        <div className="app-container">
            <Header theme={theme} toggleTheme={toggleTheme} currentMonth={currentMonth} />
            
            <div className="page-container">
                {activeTab === 'home' && (
                    <HomePage 
                        months={months}
                        setMonths={setMonths}
                        currentMonth={currentMonth}
                        currentMonthData={currentMonthData}
                        totalExpenses={totalExpenses}
                        totalGoalContributions={totalGoalContributions}
                        leftoverMoney={leftoverMoney}
                        globalSavings={globalSavings}
                        setGlobalSavings={setGlobalSavings}
                        savingsHistory={savingsHistory}
                        setSavingsHistory={setSavingsHistory}
                        expenseTemplates={expenseTemplates}
                        setExpenseTemplates={setExpenseTemplates}
                        goals={goals}
                        showToast={showToastMessage}
                    />
                )}
                
                {activeTab === 'stats' && (
                    <StatsPage 
                        months={months}
                        currentMonth={currentMonth}
                        currentMonthData={currentMonthData}
                        globalSavings={globalSavings}
                    />
                )}
                
                {activeTab === 'goals' && (
                    <GoalsPage 
                        goals={goals}
                        setGoals={setGoals}
                        leftoverMoney={leftoverMoney}
                        globalSavings={globalSavings}
                        setGlobalSavings={setGlobalSavings}
                        savingsHistory={savingsHistory}
                        setSavingsHistory={setSavingsHistory}
                        months={months}
                        setMonths={setMonths}
                        currentMonth={currentMonth}
                        currentMonthData={currentMonthData}
                        showToast={showToastMessage}
                    />
                )}

                {activeTab === 'settings' && (
                    <SettingsPage 
                        months={months}
                        setMonths={setMonths}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        globalSavings={globalSavings}
                        setGlobalSavings={setGlobalSavings}
                        savingsHistory={savingsHistory}
                        setSavingsHistory={setSavingsHistory}
                        showToast={showToastMessage}
                    />
                )}
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Toast Notification */}
            {showToast && <Toast message={showToast} />}
        </div>
    );
}

// Toast Component
function Toast({ message }) {
    return (
        <div className="toast">
            {message}
        </div>
    );
}

// Header Component
function Header({ theme, toggleTheme, currentMonth }) {
    const monthName = new Date(currentMonth + '-01').toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className="header">
            <div className="header-content">
                <div>
                    <div className="app-title">
                        <span>💰</span>
                        <span>Taka Tracker</span>
                    </div>
                    <div style={{fontSize: '12px', opacity: 0.9, marginTop: '4px'}}>
                        {monthName}
                    </div>
                </div>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
        </div>
    );
}

// Home Page Component
function HomePage({ 
    months, 
    setMonths, 
    currentMonth, 
    currentMonthData, 
    totalExpenses, 
    totalGoalContributions,
    leftoverMoney,
    globalSavings,
    setGlobalSavings,
    savingsHistory,
    setSavingsHistory,
    expenseTemplates,
    setExpenseTemplates,
    goals,
    showToast
}) {
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    const updateMonthData = (updates) => {
        setMonths({
            ...months,
            [currentMonth]: {
                ...currentMonthData,
                ...updates
            }
        });
    };

    const adjustIncome = (amount) => {
        const newIncome = Math.max(0, currentMonthData.income + amount);
        updateMonthData({ income: newIncome });
        showToast(`Income ${amount > 0 ? 'increased' : 'decreased'} by ৳${Math.abs(amount)}`);
    };

    const adjustSavings = (amount) => {
        const newSavings = Math.max(0, globalSavings + amount);
        setGlobalSavings(newSavings);
        showToast(`Savings ${amount > 0 ? 'increased' : 'decreased'} by ৳${Math.abs(amount)}`);
    };

    return (
        <div>
            {/* Summary Cards */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div>
                        <div className="summary-label">Income</div>
                        <div className="summary-value summary-income">৳{currentMonthData.income.toLocaleString()}</div>
                    </div>
                    <div style={{display: 'flex', gap: '4px'}}>
                        <button 
                            className="btn-icon" 
                            onClick={() => adjustIncome(100)}
                            title="Add ৳100"
                        >
                            ➕
                        </button>
                        <button 
                            className="btn-icon" 
                            onClick={() => adjustIncome(-100)}
                            title="Remove ৳100"
                        >
                            ➖
                        </button>
                        <button 
                            className="btn-icon" 
                            onClick={() => setShowIncomeModal(true)}
                            title="Edit income"
                        >
                            ✏️
                        </button>
                    </div>
                </div>

                <div className="summary-card">
                    <div>
                        <div className="summary-label">Expenses</div>
                        <div className="summary-value summary-expense">৳{totalExpenses.toLocaleString()}</div>
                    </div>
                </div>

                <div className="summary-card">
                    <div>
                        <div className="summary-label">Leftover</div>
                        <div className="summary-value summary-savings">৳{leftoverMoney.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Global Savings Card */}
            <div className="card mt-4" style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white'
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '4px'}}>Total Savings</div>
                        <div style={{fontSize: '32px', fontWeight: '700'}}>
                            ৳{globalSavings.toLocaleString()}
                        </div>
                    </div>
                    <div style={{display: 'flex', gap: '4px'}}>
                        <button 
                            className="btn-icon"
                            style={{background: 'rgba(255,255,255,0.2)', color: 'white'}}
                            onClick={() => adjustSavings(100)}
                            title="Add ৳100"
                        >
                            ➕
                        </button>
                        <button 
                            className="btn-icon"
                            style={{background: 'rgba(255,255,255,0.2)', color: 'white'}}
                            onClick={() => adjustSavings(-100)}
                            title="Remove ৳100"
                        >
                            ➖
                        </button>
                        <button 
                            className="btn-icon"
                            style={{background: 'rgba(255,255,255,0.2)', color: 'white'}}
                            onClick={() => setShowSavingsModal(true)}
                            title="Manage savings"
                        >
                            ✏️
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Templates */}
            {expenseTemplates.length > 0 && (
                <div className="card mt-4">
                    <div 
                        className="flex items-center justify-between mb-3"
                        style={{cursor: 'pointer'}}
                        onClick={() => setShowTemplates(!showTemplates)}
                    >
                        <h3 className="font-bold">⚡ Quick Templates ({expenseTemplates.length})</h3>
                        <span>{showTemplates ? '▼' : '▶'}</span>
                    </div>
                    {showTemplates && (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            {expenseTemplates.map(template => (
                                <TemplateButton 
                                    key={template.id}
                                    template={template}
                                    onUse={(amount) => {
                                        const newExpense = {
                                            id: Date.now(),
                                            amount: amount || template.amount,
                                            category: template.category,
                                            date: new Date().toISOString().split('T')[0],
                                            note: template.note,
                                            timestamp: new Date().toISOString(),
                                            type: 'expense'
                                        };
                                        updateMonthData({
                                            expenses: [newExpense, ...currentMonthData.expenses]
                                        });
                                        showToast(`Added ${template.category} expense!`);
                                    }}
                                    onDelete={() => {
                                        setExpenseTemplates(expenseTemplates.filter(t => t.id !== template.id));
                                        showToast('Template deleted');
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Quick Expense Entry */}
            <div className="card mt-4">
                <h2 className="font-bold mb-4">Add Expense</h2>
                <ExpenseForm 
                    currentMonthData={currentMonthData}
                    updateMonthData={updateMonthData}
                    expenseTemplates={expenseTemplates}
                    setExpenseTemplates={setExpenseTemplates}
                    goals={goals}
                    showToast={showToast}
                />
            </div>

            {/* Recent Expenses */}
            <div className="mt-4">
                <div 
                    className="collapsible-header"
                    onClick={() => setShowHistory(!showHistory)}
                >
                    <h3 className="font-bold">Recent Transactions ({currentMonthData.expenses.length})</h3>
                    <span>{showHistory ? '▼' : '▶'}</span>
                </div>
                <div className={`collapsible-content ${showHistory ? 'open' : ''}`}>
                    <ExpenseList 
                        expenses={currentMonthData.expenses}
                        updateMonthData={updateMonthData}
                        currentMonthData={currentMonthData}
                        goals={goals}
                        showToast={showToast}
                    />
                </div>
            </div>

            {/* Income Modal */}
            {showIncomeModal && (
                <IncomeModal 
                    income={currentMonthData.income}
                    onSave={(newIncome) => {
                        updateMonthData({ income: parseFloat(newIncome) });
                        setShowIncomeModal(false);
                        showToast('Income updated!');
                    }}
                    onClose={() => setShowIncomeModal(false)}
                />
            )}

            {/* Savings Modal */}
            {showSavingsModal && (
                <SavingsModal 
                    savings={globalSavings}
                    setSavings={setGlobalSavings}
                    savingsHistory={savingsHistory}
                    setSavingsHistory={setSavingsHistory}
                    onClose={() => setShowSavingsModal(false)}
                    showToast={showToast}
                />
            )}
        </div>
    );
}

// Template Button Component - FIXED MODAL ISSUE
function TemplateButton({ template, onUse, onDelete }) {
    const [showEditModal, setShowEditModal] = useState(false);

    return (
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--border)'
            }}>
                <div className={`expense-icon ${CATEGORIES[template.category].color}`} style={{
                    width: '36px',
                    height: '36px',
                    fontSize: '18px'
                }}>
                    {CATEGORIES[template.category].icon}
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                    <div className="font-bold text-sm">{template.category}</div>
                    <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>
                        ৳{template.amount} • {template.note}
                    </div>
                </div>
                <button 
                    className="btn btn-primary"
                    style={{padding: '8px 16px', fontSize: '14px'}}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowEditModal(true);
                    }}
                >
                    Use
                </button>
                <button 
                    className="btn-icon btn-danger"
                    style={{padding: '8px', minWidth: '36px', height: '36px'}}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    🗑️
                </button>
            </div>

            {showEditModal && (
                <TemplateUseModal
                    template={template}
                    onUse={(amount) => {
                        onUse(amount);
                        setShowEditModal(false);
                    }}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </>
    );
}

// Template Use Modal - FIXED CLICK PROPAGATION
function TemplateUseModal({ template, onUse, onClose }) {
    const [amount, setAmount] = useState(template.amount);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onUse(parseFloat(amount));
    };

    return (
        <div className="modal-overlay" onClick={(e) => {
            e.stopPropagation();
            onClose();
        }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Use Template</h2>
                    <button className="modal-close" onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="text-sm" style={{color: 'var(--text-secondary)'}}>
                            {template.category} • {template.note}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount (৳)</label>
                        <input 
                            type="number"
                            className="form-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            autoFocus
                            required
                        />
                    </div>

                    <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                        <button 
                            type="button"
                            className="btn btn-secondary" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }} 
                            style={{flex: 1}}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="btn btn-primary" 
                            style={{flex: 1}}
                        >
                            Add Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Expense Form Component
function ExpenseForm({ 
    currentMonthData, 
    updateMonthData, 
    expenseTemplates, 
    setExpenseTemplates,
    goals,
    showToast
}) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);

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
            timestamp: new Date().toISOString(),
            type: 'expense'
        };

        // Save as template if checked
        if (saveAsTemplate && note) {
            const newTemplate = {
                id: Date.now() + 1,
                amount: parseFloat(amount),
                category,
                note
            };
            setExpenseTemplates([...expenseTemplates, newTemplate]);
            showToast('Expense added & saved as template!');
        } else {
            showToast('Expense added!');
        }

        updateMonthData({
            expenses: [newExpense, ...currentMonthData.expenses]
        });
        
        // Reset form
        setAmount('');
        setNote('');
        setDate(new Date().toISOString().split('T')[0]);
        setSaveAsTemplate(false);
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
                <label className="form-label">Note</label>
                <textarea 
                    className="form-textarea"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                />
            </div>

            <div className="form-group" style={{marginBottom: '16px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                    <input 
                        type="checkbox"
                        checked={saveAsTemplate}
                        onChange={(e) => setSaveAsTemplate(e.target.checked)}
                        style={{width: '18px', height: '18px'}}
                    />
                    <span className="text-sm">Save as template for quick use</span>
                </label>
            </div>

            <button type="submit" className="btn btn-primary w-full">
                Add Expense
            </button>
        </form>
    );
}

// Expense List Component - FIXED UNDO SYSTEM
function ExpenseList({ expenses, updateMonthData, currentMonthData, goals, showToast }) {
    const [deletingId, setDeletingId] = useState(null);
    const deleteTimeoutRef = useRef(null);

    const handleDelete = (expense) => {
        setDeletingId(expense.id);
        showToast('Deleting in 3s... Click ↩️ to undo');
        
        // Set timeout for actual deletion
        deleteTimeoutRef.current = setTimeout(() => {
            updateMonthData({
                expenses: currentMonthData.expenses.filter(exp => exp.id !== expense.id)
            });
            setDeletingId(null);
            showToast('Deleted!');
        }, 3000);
    };

    const cancelDelete = (id) => {
        // Clear the timeout to prevent deletion
        if (deleteTimeoutRef.current) {
            clearTimeout(deleteTimeoutRef.current);
            deleteTimeoutRef.current = null;
        }
        setDeletingId(null);
        showToast('Delete cancelled!');
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (deleteTimeoutRef.current) {
                clearTimeout(deleteTimeoutRef.current);
            }
        };
    }, []);

    if (expenses.length === 0) {
        return (
            <div className="text-center mt-4" style={{color: 'var(--text-secondary)'}}>
                No transactions yet. Add your first expense above!
            </div>
        );
    }

    return (
        <div className="expense-list">
            {expenses.map(expense => {
                const isDeleting = deletingId === expense.id;
                const isGoalContribution = expense.type === 'goal';
                const goal = isGoalContribution ? goals.find(g => g.id === expense.goalId) : null;

                return (
                    <div 
                        key={expense.id} 
                        className="expense-item"
                        style={{
                            opacity: isDeleting ? 0.5 : 1,
                            background: isDeleting ? 'var(--danger)' : 'var(--bg-card)',
                            color: isDeleting ? 'white' : 'var(--text-primary)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isGoalContribution ? (
                            <>
                                <div className="expense-icon" style={{
                                    background: 'rgba(139, 92, 246, 0.2)',
                                    color: '#8b5cf6'
                                }}>
                                    🎯
                                </div>
                                <div className="expense-details">
                                    <div className="expense-category">Goal Contribution</div>
                                    <div className="expense-note">{goal?.name || 'Unknown Goal'}</div>
                                    <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`expense-icon ${CATEGORIES[expense.category].color}`}>
                                    {CATEGORIES[expense.category].icon}
                                </div>
                                <div className="expense-details">
                                    <div className="expense-category">{expense.category}</div>
                                    {expense.note && <div className="expense-note">{expense.note}</div>}
                                    <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
                                </div>
                            </>
                        )}
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <div className="expense-amount">৳{expense.amount.toLocaleString()}</div>
                            {isDeleting ? (
                                <button 
                                    className="btn-icon"
                                    style={{
                                        background: 'white', 
                                        color: 'var(--danger)', 
                                        padding: '8px',
                                        fontSize: '18px'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        cancelDelete(expense.id);
                                    }}
                                >
                                    ↩️
                                </button>
                            ) : (
                                <button 
                                    className="btn-icon btn-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(expense);
                                    }}
                                    style={{padding: '8px', minWidth: '36px', height: '36px', fontSize: '18px'}}
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Income Modal Component
function IncomeModal({ income, onSave, onClose }) {
    const [value, setValue] = useState(income);

    const handleSave = (e) => {
        e.preventDefault();
        if (value >= 0) {
            onSave(value);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Set Monthly Income</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSave}>
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
                            required
                        />
                    </div>

                    <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{flex: 1}}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{flex: 1}}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Savings Modal Component
function SavingsModal({ savings, setSavings, savingsHistory, setSavingsHistory, onClose, showToast }) {
    const [value, setValue] = useState(savings);
    const [note, setNote] = useState('');
    const [action, setAction] = useState('edit'); // 'edit', 'borrow'

    const handleSave = (e) => {
        e.preventDefault();
        
        const newValue = parseFloat(value);
        if (newValue < 0) {
            alert('Savings cannot be negative');
            return;
        }

        const oldValue = savings;
        setSavings(newValue);

        // Add to history
        const historyEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            oldValue,
            newValue,
            difference: newValue - oldValue,
            note: note || 'Manual adjustment',
            action
        };
        setSavingsHistory([historyEntry, ...savingsHistory]);

        showToast(`Savings ${action === 'borrow' ? 'borrowed from' : 'updated'}!`);
        onClose();
    };

    const handleBorrow = (amount) => {
        const newValue = Math.max(0, savings - amount);
        setSavings(newValue);

        const historyEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            oldValue: savings,
            newValue,
            difference: -amount,
            note: note || `Borrowed ৳${amount}`,
            action: 'borrow'
        };
        setSavingsHistory([historyEntry, ...savingsHistory]);

        showToast(`Borrowed ৳${amount} from savings`);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Manage Savings</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="mb-4" style={{display: 'flex', gap: '8px'}}>
                    <button 
                        className={`btn ${action === 'edit' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{flex: 1}}
                        onClick={() => setAction('edit')}
                    >
                        Edit Amount
                    </button>
                    <button 
                        className={`btn ${action === 'borrow' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{flex: 1}}
                        onClick={() => setAction('borrow')}
                    >
                        Borrow Money
                    </button>
                </div>
                
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label className="form-label">
                            {action === 'edit' ? 'New Savings Amount (৳)' : 'Amount to Borrow (৳)'}
                        </label>
                        <input 
                            type="number"
                            className="form-input"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={action === 'edit' ? 'Enter total savings' : 'Enter amount to borrow'}
                            step="0.01"
                            autoFocus
                            required
                        />
                        {action === 'edit' && (
                            <div className="text-sm mt-2" style={{color: 'var(--text-secondary)'}}>
                                Current: ৳{savings.toLocaleString()}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Note (Optional)</label>
                        <textarea 
                            className="form-textarea"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Why are you adjusting savings?"
                            style={{minHeight: '60px'}}
                        />
                    </div>

                    <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{flex: 1}}>
                            Cancel
                        </button>
                        {action === 'borrow' ? (
                            <button 
                                type="button"
                                className="btn btn-danger" 
                                onClick={() => handleBorrow(parseFloat(value))}
                                style={{flex: 1}}
                            >
                                Borrow
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-primary" style={{flex: 1}}>
                                Save
                            </button>
                        )}
                    </div>
                </form>

                {/* Recent History */}
                {savingsHistory.length > 0 && (
                    <div className="mt-4" style={{borderTop: '1px solid var(--border)', paddingTop: '16px'}}>
                        <h4 className="font-bold mb-2 text-sm">Recent Changes</h4>
                        <div style={{maxHeight: '150px', overflowY: 'auto'}}>
                            {savingsHistory.slice(0, 5).map(entry => (
                                <div key={entry.id} style={{
                                    padding: '8px',
                                    marginBottom: '4px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '6px',
                                    fontSize: '12px'
                                }}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span>{entry.note}</span>
                                        <span style={{
                                            color: entry.difference >= 0 ? 'var(--success)' : 'var(--danger)',
                                            fontWeight: '600'
                                        }}>
                                            {entry.difference >= 0 ? '+' : ''}৳{entry.difference.toLocaleString()}
                                        </span>
                                    </div>
                                    <div style={{color: 'var(--text-secondary)', fontSize: '10px', marginTop: '2px'}}>
                                        {new Date(entry.date).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Stats Page Component (continues...)
function StatsPage({ months, currentMonth, currentMonthData, globalSavings }) {
    const totalExpenses = currentMonthData.expenses.reduce((sum, exp) => 
        exp.type === 'expense' ? sum + parseFloat(exp.amount) : sum, 0
    );
    
    const totalGoalContributions = currentMonthData.expenses.reduce((sum, exp) => 
        exp.type === 'goal' ? sum + parseFloat(exp.amount) : sum, 0
    );

    const leftoverMoney = currentMonthData.income - totalExpenses - totalGoalContributions;

    // Category breakdown
    const categoryTotals = {};
    currentMonthData.expenses.forEach(exp => {
        if (exp.type === 'expense') {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
        }
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const maxCategoryAmount = Math.max(...Object.values(categoryTotals), 1);

    // Last 7 days
    const now = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayExpenses = currentMonthData.expenses
            .filter(exp => exp.date === dateStr && exp.type === 'expense')
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
            <div className="summary-grid">
                <div className="summary-card">
                    <div>
                        <div className="summary-label">Income</div>
                        <div className="summary-value summary-income">৳{currentMonthData.income.toLocaleString()}</div>
                    </div>
                </div>

                <div className="summary-card">
                    <div>
                        <div className="summary-label">Expenses</div>
                        <div className="summary-value summary-expense">৳{totalExpenses.toLocaleString()}</div>
                    </div>
                </div>

                <div className="summary-card">
                    <div>
                        <div className="summary-label">Leftover</div>
                        <div className="summary-value summary-savings">৳{leftoverMoney.toLocaleString()}</div>
                    </div>
                </div>

                <div className="summary-card">
                    <div>
                        <div className="summary-label">Total Savings</div>
                        <div className="summary-value" style={{color: 'var(--success)'}}>৳{globalSavings.toLocaleString()}</div>
                    </div>
                </div>
            </div>

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

            {currentMonthData.expenses.length > 0 && (
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
                        <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Goal Contributions</div>
                        <div className="font-bold" style={{fontSize: '18px', marginTop: '4px'}}>
                            ৳{totalGoalContributions.toLocaleString()}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Total Transactions</div>
                        <div className="font-bold" style={{fontSize: '18px', marginTop: '4px'}}>
                            {currentMonthData.expenses.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Goals Page Component
function GoalsPage({ 
    goals, 
    setGoals, 
    leftoverMoney, 
    globalSavings,
    setGlobalSavings,
    savingsHistory,
    setSavingsHistory,
    months, 
    setMonths, 
    currentMonth, 
    currentMonthData, 
    showToast 
}) {
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [contributingGoal, setContributingGoal] = useState(null);
    const [contributeFrom, setContributeFrom] = useState('leftover'); // 'leftover' or 'savings'

    const handleEditGoal = (goal) => {
        setEditingGoal(goal);
        setShowGoalModal(true);
    };

    const handleDeleteGoal = (id) => {
        if (confirm('Delete this goal? All contributions will remain as transactions.')) {
            setGoals(goals.filter(g => g.id !== id));
            showToast('Goal deleted');
        }
    };

    const handleContribute = (goalId, amount, from) => {
        if (from === 'savings') {
            // Contribute from savings
            if (amount > globalSavings) {
                alert('Not enough savings!');
                return;
            }
            setGlobalSavings(globalSavings - amount);
            
            // Add to savings history
            const historyEntry = {
                id: Date.now(),
                date: new Date().toISOString(),
                oldValue: globalSavings,
                newValue: globalSavings - amount,
                difference: -amount,
                note: `Contributed to goal: ${goals.find(g => g.id === goalId)?.name}`,
                action: 'goal_contribution'
            };
            setSavingsHistory([historyEntry, ...savingsHistory]);
        } else {
            // Contribute from leftover (as expense)
            const newExpense = {
                id: Date.now(),
                amount: parseFloat(amount),
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                type: 'goal',
                goalId: goalId
            };

            setMonths({
                ...months,
                [currentMonth]: {
                    ...currentMonthData,
                    expenses: [newExpense, ...currentMonthData.expenses]
                }
            });
        }

        // Update goal's collected amount
        setGoals(goals.map(g => 
            g.id === goalId 
                ? { ...g, collectedAmount: (g.collectedAmount || 0) + parseFloat(amount) }
                : g
        ));

        setContributingGoal(null);
        showToast(`Contributed ৳${amount} from ${from}!`);
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

            <div className="summary-grid mb-4">
                <div className="card" style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    color: 'white'
                }}>
                    <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '4px'}}>Leftover Money</div>
                    <div style={{fontSize: '28px', fontWeight: '700'}}>
                        ৳{leftoverMoney.toLocaleString()}
                    </div>
                </div>

                <div className="card" style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white'
                }}>
                    <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '4px'}}>Total Savings</div>
                    <div style={{fontSize: '28px', fontWeight: '700'}}>
                        ৳{globalSavings.toLocaleString()}
                    </div>
                </div>
            </div>

            {goals.length > 0 ? (
                <div className="goal-grid">
                    {goals.map(goal => {
                        const collected = goal.collectedAmount || 0;
                        const progress = Math.min((collected / goal.targetAmount) * 100, 100);
                        
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
                                    
                                    {goal.note && (
                                        <div style={{
                                            fontSize: '14px',
                                            color: 'var(--text-secondary)',
                                            fontStyle: 'italic',
                                            marginTop: '4px',
                                            marginBottom: '8px'
                                        }}>
                                            "{goal.note}"
                                        </div>
                                    )}
                                    
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
                                            ৳{collected.toLocaleString()} / ৳{goal.targetAmount.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="goal-actions">
                                        <button 
                                            className="btn btn-success"
                                            style={{flex: 1}}
                                            onClick={() => {
                                                setContributingGoal(goal);
                                                setContributeFrom('leftover');
                                            }}
                                        >
                                            💰 Add Money
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => handleEditGoal(goal)}
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteGoal(goal.id)}
                                        >
                                            🗑️
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

            {showGoalModal && (
                <GoalModal 
                    goal={editingGoal}
                    goals={goals}
                    setGoals={setGoals}
                    onClose={() => {
                        setShowGoalModal(false);
                        setEditingGoal(null);
                    }}
                    showToast={showToast}
                />
            )}

            {contributingGoal && (
                <ContributeModal
                    goal={contributingGoal}
                    leftoverMoney={leftoverMoney}
                    globalSavings={globalSavings}
                    contributeFrom={contributeFrom}
                    setContributeFrom={setContributeFrom}
                    onContribute={(amount, from) => handleContribute(contributingGoal.id, amount, from)}
                    onClose={() => setContributingGoal(null)}
                />
            )}
        </div>
    );
}

// Contribute Modal - ENHANCED
function ContributeModal({ goal, leftoverMoney, globalSavings, contributeFrom, setContributeFrom, onContribute, onClose }) {
    const [amount, setAmount] = useState('');
    const availableMoney = contributeFrom === 'savings' ? globalSavings : leftoverMoney;

    const handleContribute = (e) => {
        e.preventDefault();
        const value = parseFloat(amount);
        if (!value || value <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (value > availableMoney) {
            alert(`Not enough ${contributeFrom} money!`);
            return;
        }
        onContribute(value, contributeFrom);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Contribute to Goal</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="mb-4">
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Goal: {goal.name}</div>
                </div>

                <div className="mb-4" style={{display: 'flex', gap: '8px'}}>
                    <button 
                        className={`btn ${contributeFrom === 'leftover' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{flex: 1}}
                        onClick={() => setContributeFrom('leftover')}
                    >
                        From Leftover
                        <div style={{fontSize: '12px', marginTop: '4px'}}>৳{leftoverMoney.toLocaleString()}</div>
                    </button>
                    <button 
                        className={`btn ${contributeFrom === 'savings' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{flex: 1}}
                        onClick={() => setContributeFrom('savings')}
                    >
                        From Savings
                        <div style={{fontSize: '12px', marginTop: '4px'}}>৳{globalSavings.toLocaleString()}</div>
                    </button>
                </div>
                
                <form onSubmit={handleContribute}>
                    <div className="form-group">
                        <label className="form-label">Amount to Contribute (৳)</label>
                        <input 
                            type="number"
                            className="form-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            step="0.01"
                            max={availableMoney}
                            autoFocus
                            required
                        />
                        <div className="text-sm mt-2" style={{color: 'var(--text-secondary)'}}>
                            Available: ৳{availableMoney.toLocaleString()}
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{flex: 1}}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success" style={{flex: 1}}>
                            Contribute
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Goal Modal Component
function GoalModal({ goal, goals, setGoals, onClose, showToast }) {
    const [name, setName] = useState(goal?.name || '');
    const [targetAmount, setTargetAmount] = useState(goal?.targetAmount || '');
    const [note, setNote] = useState(goal?.note || '');
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

    const handleSave = (e) => {
        e.preventDefault();
        if (!name || !targetAmount || parseFloat(targetAmount) <= 0) {
            alert('Please fill in all required fields');
            return;
        }

        if (goal) {
            setGoals(goals.map(g => 
                g.id === goal.id 
                    ? { ...g, name, targetAmount: parseFloat(targetAmount), note, image }
                    : g
            ));
            showToast('Goal updated!');
        } else {
            const newGoal = {
                id: Date.now(),
                name,
                targetAmount: parseFloat(targetAmount),
                note,
                image,
                collectedAmount: 0,
                createdDate: new Date().toISOString()
            };
            setGoals([...goals, newGoal]);
            showToast('Goal created!');
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

                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label className="form-label">Goal Name</label>
                        <input 
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., New Laptop, Vacation"
                            autoFocus
                            required
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
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Motivational Note (Optional)</label>
                        <textarea 
                            className="form-textarea"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g., This will change my life!"
                            style={{minHeight: '60px'}}
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
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{flex: 1}}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{flex: 1}}>
                            {goal ? 'Update' : 'Create'} Goal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Settings Page Component - NEW!
function SettingsPage({ 
    months, 
    setMonths, 
    currentMonth, 
    setCurrentMonth, 
    globalSavings,
    setGlobalSavings,
    savingsHistory,
    setSavingsHistory,
    showToast 
}) {
    const [showNewMonthModal, setShowNewMonthModal] = useState(false);
    const [showMonthHistoryModal, setShowMonthHistoryModal] = useState(false);

    const monthsList = Object.keys(months).sort().reverse();
    const currentMonthData = months[currentMonth];

    const handleStartNewMonth = (carryoverSavings) => {
        // Calculate savings from current month
        const totalExpenses = currentMonthData.expenses.reduce((sum, exp) => 
            exp.type === 'expense' ? sum + parseFloat(exp.amount) : sum, 0
        );
        const totalGoalContributions = currentMonthData.expenses.reduce((sum, exp) => 
            exp.type === 'goal' ? sum + parseFloat(exp.amount) : sum, 0
        );
        const leftover = currentMonthData.income - totalExpenses - totalGoalContributions;

        // Add leftover to global savings if carryover is enabled
        if (carryoverSavings && leftover > 0) {
            setGlobalSavings(globalSavings + leftover);
            
            // Add to savings history
            const historyEntry = {
                id: Date.now(),
                date: new Date().toISOString(),
                oldValue: globalSavings,
                newValue: globalSavings + leftover,
                difference: leftover,
                note: `Month-end savings from ${new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
                action: 'month_end'
            };
            setSavingsHistory([historyEntry, ...savingsHistory]);
        }

        // Create new month
        const newMonthKey = getMonthKey(new Date());
        const newMonths = {
            ...months,
            [currentMonth]: {
                ...currentMonthData,
                monthlySavings: leftover,
                isActive: false
            },
            [newMonthKey]: {
                income: 0,
                expenses: [],
                monthlySavings: null,
                isActive: true,
                startDate: new Date().toISOString()
            }
        };

        setMonths(newMonths);
        setCurrentMonth(newMonthKey);
        setShowNewMonthModal(false);
        showToast('New month started!');
    };

    const handleSwitchMonth = (monthKey) => {
        setCurrentMonth(monthKey);
        setShowMonthHistoryModal(false);
        showToast(`Switched to ${new Date(monthKey + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
    };

    return (
        <div>
            <h2 className="font-bold mb-4" style={{fontSize: '24px'}}>⚙️ Settings</h2>

            {/* Current Month Info */}
            <div className="card mb-4">
                <h3 className="font-bold mb-3">Current Month</h3>
                <div className="mb-3">
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Active Month</div>
                    <div className="font-bold" style={{fontSize: '18px', marginTop: '4px'}}>
                        {new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <div className="mb-3">
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Started On</div>
                    <div style={{fontSize: '14px', marginTop: '4px'}}>
                        {new Date(currentMonthData?.startDate || new Date()).toLocaleDateString()}
                    </div>
                </div>
                <button 
                    className="btn btn-primary w-full"
                    onClick={() => setShowNewMonthModal(true)}
                >
                    🗓️ Start New Month
                </button>
            </div>

            {/* Month History */}
            <div className="card mb-4">
                <h3 className="font-bold mb-3">Month History</h3>
                <div className="mb-3">
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Total Months Tracked</div>
                    <div className="font-bold" style={{fontSize: '18px', marginTop: '4px'}}>
                        {monthsList.length}
                    </div>
                </div>
                <button 
                    className="btn btn-secondary w-full"
                    onClick={() => setShowMonthHistoryModal(true)}
                >
                    📊 View All Months
                </button>
            </div>

            {/* Global Savings Info */}
            <div className="card mb-4" style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white'
            }}>
                <h3 className="font-bold mb-2">Total Savings Accumulated</h3>
                <div style={{fontSize: '32px', fontWeight: '700', marginBottom: '8px'}}>
                    ৳{globalSavings.toLocaleString()}
                </div>
                <div style={{fontSize: '14px', opacity: 0.9'}}>
                    {savingsHistory.length} transactions in history
                </div>
            </div>

            {/* Future Features */}
            <div className="card" style={{opacity: 0.6}}>
                <h3 className="font-bold mb-3">Coming Soon 🚀</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px'}}>
                    <div>🔐 Google Authentication & Cloud Sync</div>
                    <div>🌐 Language Toggle (English / Bangla)</div>
                    <div>📤 Export/Import Data</div>
                    <div>📊 Advanced Analytics</div>
                </div>
            </div>

            {/* New Month Modal */}
            {showNewMonthModal && (
                <NewMonthModal
                    currentMonth={currentMonth}
                    currentMonthData={currentMonthData}
                    onStart={handleStartNewMonth}
                    onClose={() => setShowNewMonthModal(false)}
                />
            )}

            {/* Month History Modal */}
            {showMonthHistoryModal && (
                <MonthHistoryModal
                    months={months}
                    monthsList={monthsList}
                    currentMonth={currentMonth}
                    onSwitch={handleSwitchMonth}
                    onClose={() => setShowMonthHistoryModal(false)}
                />
            )}
        </div>
    );
}

// New Month Modal
function NewMonthModal({ currentMonth, currentMonthData, onStart, onClose }) {
    const [carryoverSavings, setCarryoverSavings] = useState(true);

    const totalExpenses = currentMonthData.expenses.reduce((sum, exp) => 
        exp.type === 'expense' ? sum + parseFloat(exp.amount) : sum, 0
    );
    const totalGoalContributions = currentMonthData.expenses.reduce((sum, exp) => 
        exp.type === 'goal' ? sum + parseFloat(exp.amount) : sum, 0
    );
    const leftover = currentMonthData.income - totalExpenses - totalGoalContributions;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Start New Month</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="card mb-4" style={{background: 'var(--bg-secondary)'}}>
                    <h4 className="font-bold mb-2">Current Month Summary</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Income:</span>
                            <span className="font-bold">৳{currentMonthData.income.toLocaleString()}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Expenses:</span>
                            <span className="font-bold" style={{color: 'var(--danger)'}}>৳{totalExpenses.toLocaleString()}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Goal Contributions:</span>
                            <span className="font-bold">৳{totalGoalContributions.toLocaleString()}</span>
                        </div>
                        <div style={{borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between'}}>
                            <span className="font-bold">Leftover:</span>
                            <span className="font-bold" style={{color: 'var(--success)'}}>৳{leftover.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                        <input 
                            type="checkbox"
                            checked={carryoverSavings}
                            onChange={(e) => setCarryoverSavings(e.target.checked)}
                            style={{width: '18px', height: '18px'}}
                        />
                        <span>Add leftover money to total savings</span>
                    </label>
                    {carryoverSavings && leftover > 0 && (
                        <div className="text-sm mt-2" style={{color: 'var(--success)', paddingLeft: '26px'}}>
                            ৳{leftover.toLocaleString()} will be added to your savings
                        </div>
                    )}
                </div>

                <div className="card mt-4" style={{background: 'var(--bg-secondary)', padding: '12px'}}>
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>
                        ℹ️ Starting a new month will:
                    </div>
                    <ul style={{fontSize: '14px', marginTop: '8px', paddingLeft: '20px'}}>
                        <li>Save current month as history</li>
                        <li>Create fresh month with zero expenses</li>
                        <li>Preserve your goals and templates</li>
                        {carryoverSavings && <li style={{color: 'var(--success)'}}>Add leftover to total savings</li>}
                    </ul>
                </div>

                <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                    <button className="btn btn-secondary" onClick={onClose} style={{flex: 1}}>
                        Cancel
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => onStart(carryoverSavings)}
                        style={{flex: 1}}
                    >
                        Start New Month
                    </button>
                </div>
            </div>
        </div>
    );
}

// Month History Modal
function MonthHistoryModal({ months, monthsList, currentMonth, onSwitch, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Month History</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {monthsList.map(monthKey => {
                        const monthData = months[monthKey];
                        const totalExpenses = monthData.expenses.reduce((sum, exp) => 
                            exp.type === 'expense' ? sum + parseFloat(exp.amount) : sum, 0
                        );
                        const totalGoalContributions = monthData.expenses.reduce((sum, exp) => 
                            exp.type === 'goal' ? sum + parseFloat(exp.amount) : sum, 0
                        );
                        const leftover = monthData.income - totalExpenses - totalGoalContributions;
                        const isCurrent = monthKey === currentMonth;

                        return (
                            <div 
                                key={monthKey} 
                                className="card mb-3"
                                style={{
                                    background: isCurrent ? 'var(--primary)' : 'var(--bg-secondary)',
                                    color: isCurrent ? 'white' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    border: isCurrent ? 'none' : '1px solid var(--border)'
                                }}
                                onClick={() => !isCurrent && onSwitch(monthKey)}
                            >
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                                    <div className="font-bold">
                                        {new Date(monthKey + '-01').toLocaleDateString('en-US', { 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}
                                    </div>
                                    {isCurrent && (
                                        <span style={{
                                            padding: '4px 8px',
                                            background: 'rgba(255,255,255,0.2)',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            Current
                                        </span>
                                    )}
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: isCurrent ? 0.9 : 1}}>
                                    <span>Income: ৳{monthData.income.toLocaleString()}</span>
                                    <span>Leftover: ৳{leftover.toLocaleString()}</span>
                                </div>
                                <div style={{fontSize: '12px', marginTop: '4px', opacity: isCurrent ? 0.8 : 0.7}}>
                                    {monthData.expenses.length} transactions
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="btn btn-secondary w-full mt-4" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

// Bottom Navigation Component
function BottomNav({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'stats', icon: '📊', label: 'Stats' },
        { id: 'goals', icon: '🎯', label: 'Goals' },
        { id: 'settings', icon: '⚙️', label: 'Settings' }
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

// Hide loading screen
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}, 2500);

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

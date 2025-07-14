// Dashboard Controller
class DashboardController {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add any dashboard-specific event listeners here
    }

    loadDashboard() {
        this.updateStats();
        this.loadRecentActivities();
        this.updateUserInfo();
    }

    updateStats() {
        // Get data from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const musics = JSON.parse(localStorage.getItem('musics') || '[]');
        const orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]');
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

        // Calculate totals
        const totalUsers = users.length;
        const totalMusics = musics.length;
        const totalOrcamentos = orcamentos.length;
        
        // Calculate total revenue from transactions
        const totalRevenue = transactions
            .filter(t => t.type === 'entrada')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        // Update UI
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalMusics').textContent = totalMusics;
        document.getElementById('totalOrcamentos').textContent = totalOrcamentos;
        document.getElementById('totalRevenue').textContent = app.formatCurrency(totalRevenue);
    }

    loadRecentActivities() {
        const activitiesList = document.getElementById('activitiesList');
        const activities = this.getRecentActivities();

        activitiesList.innerHTML = activities.length === 0 
            ? '<p class="no-data">Nenhuma atividade recente</p>'
            : activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas ${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
    }

    getRecentActivities() {
        const activities = [];
        const now = new Date();

        // Get recent users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const recentUsers = users
            .filter(u => u.lastAccess)
            .sort((a, b) => new Date(b.lastAccess) - new Date(a.lastAccess))
            .slice(0, 3);

        recentUsers.forEach(user => {
            const timeDiff = this.getTimeDifference(new Date(user.lastAccess), now);
            activities.push({
                icon: 'fa-user',
                title: `${user.name} acessou o sistema`,
                time: timeDiff
            });
        });

        // Get recent music uploads
        const musics = JSON.parse(localStorage.getItem('musics') || '[]');
        const recentMusics = musics
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        recentMusics.forEach(music => {
            const timeDiff = this.getTimeDifference(new Date(music.createdAt), now);
            activities.push({
                icon: 'fa-music',
                title: `Nova música: ${music.interprete} - ${music.dj}`,
                time: timeDiff
            });
        });

        // Get recent transactions
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const recentTransactions = transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        recentTransactions.forEach(transaction => {
            const timeDiff = this.getTimeDifference(new Date(transaction.date), now);
            activities.push({
                icon: transaction.type === 'entrada' ? 'fa-arrow-up' : 'fa-arrow-down',
                title: `${transaction.description} - ${app.formatCurrency(transaction.amount)}`,
                time: timeDiff
            });
        });

        // Sort all activities by time and return top 10
        return activities
            .sort((a, b) => {
                const timeA = this.parseTimeString(a.time);
                const timeB = this.parseTimeString(b.time);
                return timeA - timeB;
            })
            .slice(0, 10);
    }

    getTimeDifference(date, now) {
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) {
            return 'Agora mesmo';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} min atrás`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h atrás`;
        } else {
            return `${diffInDays} dias atrás`;
        }
    }

    parseTimeString(timeStr) {
        if (timeStr === 'Agora mesmo') return 0;
        
        const match = timeStr.match(/(\d+)/);
        if (!match) return 0;
        
        const value = parseInt(match[1]);
        
        if (timeStr.includes('min')) {
            return value;
        } else if (timeStr.includes('h')) {
            return value * 60;
        } else if (timeStr.includes('dias')) {
            return value * 60 * 24;
        }
        
        return 0;
    }

    updateUserInfo() {
        if (authController.currentUser) {
            document.getElementById('userName').textContent = authController.currentUser.name;
            document.getElementById('userRole').textContent = 
                authController.currentUser.role === 'admin' ? 'Administrador' : 'Usuário';
        }
    }

    // Quick actions
    showQuickStats() {
        const stats = {
            pendingUsers: authController.getPendingUsers().length,
            activeUsers: authController.getActiveUsers().length,
            totalRevenue: this.calculateTotalRevenue(),
            monthlyGrowth: this.calculateMonthlyGrowth()
        };

        return stats;
    }

    calculateTotalRevenue() {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        return transactions
            .filter(t => t.type === 'entrada')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }

    calculateMonthlyGrowth() {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const currentMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const previousMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
        });

        const currentRevenue = currentMonthTransactions
            .filter(t => t.type === 'entrada')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const previousRevenue = previousMonthTransactions
            .filter(t => t.type === 'entrada')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        if (previousRevenue === 0) return 100;
        
        return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    }

    // Export dashboard data
    exportDashboardData() {
        const data = {
            stats: {
                totalUsers: document.getElementById('totalUsers').textContent,
                totalMusics: document.getElementById('totalMusics').textContent,
                totalOrcamentos: document.getElementById('totalOrcamentos').textContent,
                totalRevenue: document.getElementById('totalRevenue').textContent
            },
            activities: this.getRecentActivities(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Refresh dashboard
    refresh() {
        this.loadDashboard();
        app.showNotification('Dashboard atualizado!', 'success');
    }
}

// Initialize dashboard controller
window.dashboardController = new DashboardController(); 
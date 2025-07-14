// Main Application Controller
class App {
    constructor() {
        this.currentUser = null;
        this.currentScreen = 'login';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStoredData();
        this.updateUI();
    }

    setupEventListeners() {
        // Login/Register navigation
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('register');
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('login');
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Reset System
        const resetBtn = document.getElementById('resetSystem');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetSystem();
            });
        }

        // Menu navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                this.navigateToScreen(screen);
            });
        });
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(screenName + 'Screen').classList.add('active');
        this.currentScreen = screenName;
    }

    navigateToScreen(screenName) {
        // Update menu active state
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-screen="${screenName}"]`).classList.add('active');

        // Hide all content screens
        document.querySelectorAll('.content-screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target content screen
        document.getElementById(screenName + 'Content').classList.add('active');

        // Update breadcrumb
        document.getElementById('currentPage').textContent = this.getScreenTitle(screenName);

        // Load screen data
        this.loadScreenData(screenName);
    }

    getScreenTitle(screenName) {
        const titles = {
            'dashboard': 'Dashboard',
            'userManagement': 'Gestão de Usuários',
            'uploadMusical': 'Upload Musical',
            'orcamentos': 'Orçamentos',
            'notasFiscais': 'Notas Fiscais',
            'financeiro': 'Financeiro'
        };
        return titles[screenName] || screenName;
    }

    loadScreenData(screenName) {
        switch(screenName) {
            case 'dashboard':
                dashboardController.loadDashboard();
                break;
            case 'userManagement':
                userManagementController.loadUsers();
                break;
            case 'uploadMusical':
                uploadMusicalController.loadMusics();
                break;
            case 'orcamentos':
                orcamentosController.loadOrcamentos();
                break;
            case 'notasFiscais':
                notasFiscaisController.loadNotasFiscais();
                break;
            case 'financeiro':
                financeiroController.loadFinanceiro();
                break;
        }
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simple validation
        if (!email || !password) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showScreen('dashboard');
            this.updateUI();
            this.showNotification('Login realizado com sucesso!', 'success');
        } else {
            this.showNotification('Email ou senha incorretos', 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('As senhas não coincidem', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            this.showNotification('Este email já está cadastrado', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role: 'user',
            status: 'pending',
            createdAt: new Date().toISOString(),
            lastAccess: null
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        this.showNotification('Conta criada com sucesso! Aguarde aprovação do administrador.', 'success');
        this.showScreen('login');
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showScreen('login');
        this.updateUI();
        this.showNotification('Logout realizado com sucesso!', 'success');
    }

    loadStoredData() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.showScreen('dashboard');
        }

        // Initialize default data if not exists
        this.initializeDefaultData();
    }

    initializeDefaultData() {
        // Force create admin user with correct credentials
        this.createAdminUser();
        
        // Initialize other data structures
        if (!localStorage.getItem('musics')) {
            localStorage.setItem('musics', JSON.stringify([]));
        }

        if (!localStorage.getItem('orcamentos')) {
            localStorage.setItem('orcamentos', JSON.stringify([]));
        }

        if (!localStorage.getItem('notasFiscais')) {
            localStorage.setItem('notasFiscais', JSON.stringify([]));
        }

        if (!localStorage.getItem('transactions')) {
            localStorage.setItem('transactions', JSON.stringify([]));
        }
    }

    createAdminUser() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if admin user exists with correct credentials
        const adminExists = users.find(u => u.email === 'Geren@gmail.com');
        
        if (!adminExists) {
            // Remove any existing admin users with wrong credentials
            const filteredUsers = users.filter(u => u.email !== 'admin@ayane.com');
            
            const adminUser = {
                id: 1,
                name: 'Administrador',
                email: 'Geren@gmail.com',
                password: 'Omojagun18',
                role: 'admin',
                status: 'active',
                createdAt: new Date().toISOString(),
                lastAccess: new Date().toISOString()
            };
            
            filteredUsers.push(adminUser);
            localStorage.setItem('users', JSON.stringify(filteredUsers));
            console.log('Usuário administrativo criado com sucesso!');
        }
    }

    resetSystem() {
        if (confirm('Tem certeza que deseja resetar o sistema? Isso irá limpar todos os dados e criar um novo usuário administrativo.')) {
            // Clear all localStorage
            localStorage.clear();
            
            // Create admin user
            this.createAdminUser();
            
            // Show success message
            this.showNotification('Sistema resetado com sucesso! Use as credenciais: Geren@gmail.com / Omojagun18', 'success');
            
            // Reload page after 2 seconds
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }

    // Função para zerar todos os dados do sistema (exceto admin)
    resetAllData() {
        // Mantém apenas o admin
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const admin = users.find(u => u.role === 'admin');
        localStorage.setItem('users', JSON.stringify(admin ? [admin] : []));
        // Zera todos os outros dados
        localStorage.setItem('musics', JSON.stringify([]));
        localStorage.setItem('orcamentos', JSON.stringify([]));
        localStorage.setItem('notasFiscais', JSON.stringify([]));
        localStorage.setItem('transactions', JSON.stringify([]));
        // Remove usuário logado
        localStorage.removeItem('currentUser');
        app.showNotification('Todos os dados foram zerados!', 'success');
        setTimeout(() => { location.reload(); }, 1500);
    }

    updateUI() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userRole').textContent = this.currentUser.role === 'admin' ? 'Administrador' : 'Usuário';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Utility methods
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR');
    }

    formatDateTime(date) {
        return new Date(date).toLocaleString('pt-BR');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 

// Expor para uso fácil
window.resetAllData = () => window.app.resetAllData && window.app.resetAllData(); 
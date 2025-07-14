// Authentication and Authorization Controller
class AuthController {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
    }

    loadCurrentUser() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    isUser() {
        return this.currentUser && this.currentUser.role === 'user';
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;

        const permissions = {
            'admin': ['all'],
            'user': ['view_dashboard', 'view_upload', 'view_orcamentos', 'view_notas_fiscais', 'view_financeiro']
        };

        const userPermissions = permissions[this.currentUser.role] || [];
        return userPermissions.includes('all') || userPermissions.includes(permission);
    }

    updateLastAccess() {
        if (this.currentUser) {
            this.currentUser.lastAccess = new Date().toISOString();
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Update in users list
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].lastAccess = this.currentUser.lastAccess;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
    }

    approveUser(userId) {
        if (!this.isAdmin()) {
            app.showNotification('Acesso negado', 'error');
            return false;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].status = 'active';
            localStorage.setItem('users', JSON.stringify(users));
            app.showNotification('Usuário aprovado com sucesso!', 'success');
            return true;
        }

        return false;
    }

    rejectUser(userId) {
        if (!this.isAdmin()) {
            app.showNotification('Acesso negado', 'error');
            return false;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].status = 'inactive';
            localStorage.setItem('users', JSON.stringify(users));
            app.showNotification('Usuário rejeitado', 'success');
            return true;
        }

        return false;
    }

    changeUserRole(userId, newRole) {
        if (!this.isAdmin()) {
            app.showNotification('Acesso negado', 'error');
            return false;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].role = newRole;
            localStorage.setItem('users', JSON.stringify(users));
            app.showNotification('Perfil do usuário atualizado!', 'success');
            return true;
        }

        return false;
    }

    deleteUser(userId) {
        if (!this.isAdmin()) {
            app.showNotification('Acesso negado', 'error');
            return false;
        }

        // Prevent admin from deleting themselves
        if (userId === this.currentUser.id) {
            app.showNotification('Você não pode deletar sua própria conta', 'error');
            return false;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filteredUsers = users.filter(u => u.id !== userId);
        
        if (filteredUsers.length < users.length) {
            localStorage.setItem('users', JSON.stringify(filteredUsers));
            app.showNotification('Usuário deletado com sucesso!', 'success');
            return true;
        }

        return false;
    }

    resetPassword(userId, newPassword) {
        if (!this.isAdmin()) {
            app.showNotification('Acesso negado', 'error');
            return false;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            app.showNotification('Senha redefinida com sucesso!', 'success');
            return true;
        }

        return false;
    }

    getPendingUsers() {
        if (!this.isAdmin()) return [];
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.filter(u => u.status === 'pending');
    }

    getActiveUsers() {
        if (!this.isAdmin()) return [];
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.filter(u => u.status === 'active');
    }

    getAllUsers() {
        if (!this.isAdmin()) return [];
        
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    getUserById(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(u => u.id === userId);
    }

    // Session management
    startSession(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateLastAccess();
    }

    endSession() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Password validation
    validatePassword(password) {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        const errors = [];
        
        if (password.length < minLength) {
            errors.push(`A senha deve ter pelo menos ${minLength} caracteres`);
        }
        
        if (!hasUpperCase) {
            errors.push('A senha deve conter pelo menos uma letra maiúscula');
        }
        
        if (!hasLowerCase) {
            errors.push('A senha deve conter pelo menos uma letra minúscula');
        }
        
        if (!hasNumbers) {
            errors.push('A senha deve conter pelo menos um número');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Email validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Login attempt tracking
    trackLoginAttempt(email, success) {
        const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
        
        if (!attempts[email]) {
            attempts[email] = {
                count: 0,
                lastAttempt: null,
                blockedUntil: null
            };
        }

        if (success) {
            attempts[email].count = 0;
            attempts[email].blockedUntil = null;
        } else {
            attempts[email].count++;
            attempts[email].lastAttempt = new Date().toISOString();
            
            // Block after 5 failed attempts for 15 minutes
            if (attempts[email].count >= 5) {
                const blockTime = new Date();
                blockTime.setMinutes(blockTime.getMinutes() + 15);
                attempts[email].blockedUntil = blockTime.toISOString();
            }
        }

        localStorage.setItem('loginAttempts', JSON.stringify(attempts));
    }

    isAccountBlocked(email) {
        const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
        const userAttempts = attempts[email];
        
        if (!userAttempts || !userAttempts.blockedUntil) {
            return false;
        }

        const blockedUntil = new Date(userAttempts.blockedUntil);
        const now = new Date();
        
        if (now < blockedUntil) {
            return true;
        } else {
            // Unblock if time has passed
            userAttempts.blockedUntil = null;
            userAttempts.count = 0;
            localStorage.setItem('loginAttempts', JSON.stringify(attempts));
            return false;
        }
    }

    getRemainingBlockTime(email) {
        const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
        const userAttempts = attempts[email];
        
        if (!userAttempts || !userAttempts.blockedUntil) {
            return 0;
        }

        const blockedUntil = new Date(userAttempts.blockedUntil);
        const now = new Date();
        const remaining = Math.max(0, blockedUntil - now);
        
        return Math.ceil(remaining / 1000 / 60); // Return minutes
    }
}

// Initialize auth controller
window.authController = new AuthController(); 
// User Management Controller
class UserManagementController {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addUserBtn').addEventListener('click', () => {
            this.showAddUserModal();
        });
    }

    loadUsers() {
        if (!authController.isAdmin()) {
            app.showNotification('Acesso negado', 'error');
            return;
        }

        const users = authController.getAllUsers();
        this.renderUsersTable(users);
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        
        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-data">Nenhum usuário encontrado</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="user-info-cell">
                        <img src="https://via.placeholder.com/32" alt="Avatar" class="user-avatar-small">
                        <span>${user.name}</span>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge role-${user.role}">
                        ${user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${user.status}">
                        ${this.getStatusText(user.status)}
                    </span>
                </td>
                <td>${user.lastAccess ? app.formatDateTime(user.lastAccess) : 'Nunca acessou'}</td>
                <td>
                    <div class="action-buttons">
                        ${this.renderActionButtons(user)}
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event listeners to action buttons
        this.addActionEventListeners();
    }

    renderActionButtons(user) {
        const buttons = [];

        // View button
        buttons.push(`
            <button class="btn-action btn-view" data-action="view" data-user-id="${user.id}">
                <i class="fas fa-eye"></i>
            </button>
        `);

        // Edit button
        buttons.push(`
            <button class="btn-action btn-edit" data-action="edit" data-user-id="${user.id}">
                <i class="fas fa-edit"></i>
            </button>
        `);

        // Role change button (only for non-admin users)
        if (user.role !== 'admin') {
            buttons.push(`
                <button class="btn-action btn-role" data-action="role" data-user-id="${user.id}">
                    <i class="fas fa-user-tag"></i>
                </button>
            `);
        }

        // Status buttons
        if (user.status === 'pending') {
            buttons.push(`
                <button class="btn-action btn-approve" data-action="approve" data-user-id="${user.id}">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-action btn-reject" data-action="reject" data-user-id="${user.id}">
                    <i class="fas fa-times"></i>
                </button>
            `);
        }

        // Delete button (only for non-admin users)
        if (user.role !== 'admin') {
            buttons.push(`
                <button class="btn-action btn-delete" data-action="delete" data-user-id="${user.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `);
        }

        return buttons.join('');
    }

    addActionEventListeners() {
        document.querySelectorAll('.btn-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const userId = parseInt(e.currentTarget.dataset.userId);
                this.handleUserAction(action, userId);
            });
        });
    }

    handleUserAction(action, userId) {
        const user = authController.getUserById(userId);
        if (!user) return;

        switch (action) {
            case 'view':
                this.showUserDetails(user);
                break;
            case 'edit':
                this.showEditUserModal(user);
                break;
            case 'role':
                this.showRoleChangeModal(user);
                break;
            case 'approve':
                this.approveUser(userId);
                break;
            case 'reject':
                this.rejectUser(userId);
                break;
            case 'delete':
                this.deleteUser(userId);
                break;
        }
    }

    showUserDetails(user) {
        const modalContent = `
            <div class="modal-header">
                <h3>Detalhes do Usuário</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="user-details-grid">
                    <div class="detail-item">
                        <label>Nome:</label>
                        <span>${user.name}</span>
                    </div>
                    <div class="detail-item">
                        <label>Email:</label>
                        <span>${user.email}</span>
                    </div>
                    <div class="detail-item">
                        <label>Perfil:</label>
                        <span class="role-badge role-${user.role}">
                            ${user.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="status-badge status-${user.status}">
                            ${this.getStatusText(user.status)}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>Data de Criação:</label>
                        <span>${app.formatDateTime(user.createdAt)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Último Acesso:</label>
                        <span>${user.lastAccess ? app.formatDateTime(user.lastAccess) : 'Nunca acessou'}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Fechar</button>
            </div>
        `;

        modalController.show(modalContent);
    }

    showAddUserModal() {
        const modalContent = `
            <div class="modal-header">
                <h3>Adicionar Novo Usuário</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="addUserForm">
                    <div class="form-group">
                        <label for="newUserName">Nome Completo</label>
                        <input type="text" id="newUserName" required>
                    </div>
                    <div class="form-group">
                        <label for="newUserEmail">Email</label>
                        <input type="email" id="newUserEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="newUserPassword">Senha</label>
                        <input type="password" id="newUserPassword" required>
                    </div>
                    <div class="form-group">
                        <label for="newUserRole">Perfil</label>
                        <select id="newUserRole" required>
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newUserStatus">Status</label>
                        <select id="newUserStatus" required>
                            <option value="active">Ativo</option>
                            <option value="pending">Pendente</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Cancelar</button>
                <button class="btn-primary" onclick="userManagementController.saveNewUser()">Salvar</button>
            </div>
        `;

        modalController.show(modalContent);
    }

    saveNewUser() {
        const name = document.getElementById('newUserName').value;
        const email = document.getElementById('newUserEmail').value;
        const password = document.getElementById('newUserPassword').value;
        const role = document.getElementById('newUserRole').value;
        const status = document.getElementById('newUserStatus').value;

        if (!name || !email || !password) {
            app.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }

        // Validate email
        if (!authController.validateEmail(email)) {
            app.showNotification('Email inválido', 'error');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            app.showNotification('Este email já está cadastrado', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role,
            status,
            createdAt: new Date().toISOString(),
            lastAccess: null
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        modalController.close();
        this.loadUsers();
        app.showNotification('Usuário criado com sucesso!', 'success');
    }

    showEditUserModal(user) {
        const modalContent = `
            <div class="modal-header">
                <h3>Editar Usuário</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editUserForm">
                    <div class="form-group">
                        <label for="editUserName">Nome Completo</label>
                        <input type="text" id="editUserName" value="${user.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editUserEmail">Email</label>
                        <input type="email" id="editUserEmail" value="${user.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="editUserRole">Perfil</label>
                        <select id="editUserRole" required>
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuário</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editUserStatus">Status</label>
                        <select id="editUserStatus" required>
                            <option value="active" ${user.status === 'active' ? 'selected' : ''}>Ativo</option>
                            <option value="pending" ${user.status === 'pending' ? 'selected' : ''}>Pendente</option>
                            <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inativo</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Cancelar</button>
                <button class="btn-primary" onclick="userManagementController.saveUserEdit(${user.id})">Salvar</button>
            </div>
        `;

        modalController.show(modalContent);
    }

    saveUserEdit(userId) {
        const name = document.getElementById('editUserName').value;
        const email = document.getElementById('editUserEmail').value;
        const role = document.getElementById('editUserRole').value;
        const status = document.getElementById('editUserStatus').value;

        if (!name || !email) {
            app.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            app.showNotification('Usuário não encontrado', 'error');
            return;
        }

        // Check if email is already taken by another user
        const emailExists = users.find(u => u.email === email && u.id !== userId);
        if (emailExists) {
            app.showNotification('Este email já está sendo usado por outro usuário', 'error');
            return;
        }

        users[userIndex].name = name;
        users[userIndex].email = email;
        users[userIndex].role = role;
        users[userIndex].status = status;

        localStorage.setItem('users', JSON.stringify(users));

        modalController.close();
        this.loadUsers();
        app.showNotification('Usuário atualizado com sucesso!', 'success');
    }

    showRoleChangeModal(user) {
        const modalContent = `
            <div class="modal-header">
                <h3>Alterar Perfil do Usuário</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Alterar perfil de <strong>${user.name}</strong> de <strong>${user.role === 'admin' ? 'Administrador' : 'Usuário'}</strong> para:</p>
                <div class="form-group">
                    <label for="newRole">Novo Perfil</label>
                    <select id="newRole">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuário</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Cancelar</button>
                <button class="btn-primary" onclick="userManagementController.changeUserRole(${user.id})">Confirmar</button>
            </div>
        `;

        modalController.show(modalContent);
    }

    changeUserRole(userId) {
        const newRole = document.getElementById('newRole').value;
        
        if (authController.changeUserRole(userId, newRole)) {
            modalController.close();
            this.loadUsers();
        }
    }

    approveUser(userId) {
        if (confirm('Confirmar aprovação deste usuário?')) {
            if (authController.approveUser(userId)) {
                this.loadUsers();
            }
        }
    }

    rejectUser(userId) {
        if (confirm('Confirmar rejeição deste usuário?')) {
            if (authController.rejectUser(userId)) {
                this.loadUsers();
            }
        }
    }

    deleteUser(userId) {
        const user = authController.getUserById(userId);
        if (confirm(`Confirmar exclusão do usuário "${user.name}"? Esta ação não pode ser desfeita.`)) {
            if (authController.deleteUser(userId)) {
                this.loadUsers();
            }
        }
    }

    getStatusText(status) {
        const statusTexts = {
            'active': 'Ativo',
            'pending': 'Pendente',
            'inactive': 'Inativo'
        };
        return statusTexts[status] || status;
    }

    // Search and filter functionality
    searchUsers(query) {
        const users = authController.getAllUsers();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        this.renderUsersTable(filteredUsers);
    }

    filterUsersByStatus(status) {
        const users = authController.getAllUsers();
        const filteredUsers = status === 'all' 
            ? users 
            : users.filter(user => user.status === status);
        this.renderUsersTable(filteredUsers);
    }

    filterUsersByRole(role) {
        const users = authController.getAllUsers();
        const filteredUsers = role === 'all' 
            ? users 
            : users.filter(user => user.role === role);
        this.renderUsersTable(filteredUsers);
    }

    // Export users data
    exportUsersData() {
        const users = authController.getAllUsers();
        const data = {
            users: users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
                lastAccess: user.lastAccess
            })),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize user management controller
window.userManagementController = new UserManagementController(); 
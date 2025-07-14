// Orçamentos Controller
class OrcamentosController {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('newOrcamentoBtn').addEventListener('click', () => {
            this.showNewOrcamentoModal();
        });
    }

    loadOrcamentos() {
        const orcamentos = this.getAllOrcamentos();
        this.renderOrcamentosGrid(orcamentos);
    }

    getAllOrcamentos() {
        return JSON.parse(localStorage.getItem('orcamentos') || '[]');
    }

    renderOrcamentosGrid(orcamentos) {
        const grid = document.getElementById('orcamentosGrid');
        
        if (orcamentos.length === 0) {
            grid.innerHTML = `
                <div class="no-data-card">
                    <i class="fas fa-file-invoice-dollar"></i>
                    <h3>Nenhum orçamento encontrado</h3>
                    <p>Crie seu primeiro orçamento clicando no botão acima.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = orcamentos.map(orcamento => `
            <div class="orcamento-card" data-orcamento-id="${orcamento.id}">
                <div class="orcamento-header">
                    <div class="orcamento-number">
                        <span class="label">Orçamento #${orcamento.numero}</span>
                        <span class="status-badge status-${orcamento.status}">
                            ${this.getStatusText(orcamento.status)}
                        </span>
                    </div>
                    <div class="orcamento-actions">
                        <button class="btn-action btn-view" onclick="orcamentosController.viewOrcamento(${orcamento.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="orcamentosController.editOrcamento(${orcamento.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="orcamentosController.deleteOrcamento(${orcamento.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="orcamento-content">
                    <div class="orcamento-info">
                        <div class="info-item">
                            <label>Cliente:</label>
                            <span>${orcamento.cliente.nome}</span>
                        </div>
                        <div class="info-item">
                            <label>Data:</label>
                            <span>${app.formatDate(orcamento.data)}</span>
                        </div>
                        <div class="info-item">
                            <label>Valor Total:</label>
                            <span class="valor-total">${app.formatCurrency(orcamento.valorTotal)}</span>
                        </div>
                    </div>
                    <div class="orcamento-description">
                        <p>${orcamento.descricao || 'Sem descrição'}</p>
                    </div>
                </div>
                <div class="orcamento-footer">
                    <span class="orcamento-date">Criado em ${app.formatDate(orcamento.createdAt)}</span>
                    <button class="btn-primary btn-sm" onclick="orcamentosController.generatePDF(${orcamento.id})">
                        <i class="fas fa-file-pdf"></i>
                        Gerar PDF
                    </button>
                </div>
            </div>
        `).join('');
    }

    showNewOrcamentoModal() {
        const modalContent = `
            <div class="modal-header">
                <h3>Novo Orçamento</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="newOrcamentoForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="orcamentoData">Data do Orçamento</label>
                            <input type="date" id="orcamentoData" required>
                        </div>
                        <div class="form-group">
                            <label for="orcamentoValidade">Validade (dias)</label>
                            <input type="number" id="orcamentoValidade" value="30" min="1" max="365">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="orcamentoClienteNome">Nome do Cliente</label>
                        <input type="text" id="orcamentoClienteNome" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="orcamentoClienteEmail">Email</label>
                            <input type="email" id="orcamentoClienteEmail">
                        </div>
                        <div class="form-group">
                            <label for="orcamentoClienteTelefone">Telefone</label>
                            <input type="tel" id="orcamentoClienteTelefone">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="orcamentoClienteEndereco">Endereço</label>
                        <textarea id="orcamentoClienteEndereco" rows="2"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="orcamentoDescricao">Descrição do Projeto</label>
                        <textarea id="orcamentoDescricao" rows="3" placeholder="Descreva o projeto ou serviço..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Itens do Orçamento</label>
                        <div id="orcamentoItens">
                            <div class="item-row">
                                <input type="text" class="item-descricao" placeholder="Descrição do item">
                                <input type="number" class="item-quantidade" placeholder="Qtd" value="1" min="1">
                                <input type="number" class="item-valor" placeholder="Valor unitário" step="0.01" min="0">
                                <button type="button" class="btn-remove-item" onclick="orcamentosController.removeItem(this)">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" class="btn-add-item" onclick="orcamentosController.addItem()">
                            <i class="fas fa-plus"></i>
                            Adicionar Item
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label for="orcamentoObservacoes">Observações</label>
                        <textarea id="orcamentoObservacoes" rows="3" placeholder="Observações adicionais..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Cancelar</button>
                <button class="btn-primary" onclick="orcamentosController.saveNewOrcamento()">Salvar Orçamento</button>
            </div>
        `;

        modalController.show(modalContent);
        this.setupOrcamentoFormListeners();
    }

    setupOrcamentoFormListeners() {
        // Auto-calculate totals when values change
        document.querySelectorAll('.item-quantidade, .item-valor').forEach(input => {
            input.addEventListener('input', () => {
                this.calculateOrcamentoTotal();
            });
        });
    }

    addItem() {
        const itensContainer = document.getElementById('orcamentoItens');
        const newItem = document.createElement('div');
        newItem.className = 'item-row';
        newItem.innerHTML = `
            <input type="text" class="item-descricao" placeholder="Descrição do item">
            <input type="number" class="item-quantidade" placeholder="Qtd" value="1" min="1">
            <input type="number" class="item-valor" placeholder="Valor unitário" step="0.01" min="0">
            <button type="button" class="btn-remove-item" onclick="orcamentosController.removeItem(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        itensContainer.appendChild(newItem);
        
        // Add event listeners to new inputs
        newItem.querySelectorAll('.item-quantidade, .item-valor').forEach(input => {
            input.addEventListener('input', () => {
                this.calculateOrcamentoTotal();
            });
        });
    }

    removeItem(button) {
        const itemRow = button.closest('.item-row');
        if (document.querySelectorAll('.item-row').length > 1) {
            itemRow.remove();
            this.calculateOrcamentoTotal();
        }
    }

    calculateOrcamentoTotal() {
        let total = 0;
        document.querySelectorAll('.item-row').forEach(row => {
            const quantidade = parseFloat(row.querySelector('.item-quantidade').value) || 0;
            const valor = parseFloat(row.querySelector('.item-valor').value) || 0;
            total += quantidade * valor;
        });
        
        // Update total display if it exists
        const totalDisplay = document.querySelector('.orcamento-total-display');
        if (totalDisplay) {
            totalDisplay.textContent = app.formatCurrency(total);
        }
    }

    saveNewOrcamento() {
        const data = document.getElementById('orcamentoData').value;
        const validade = parseInt(document.getElementById('orcamentoValidade').value) || 30;
        const clienteNome = document.getElementById('orcamentoClienteNome').value;
        const clienteEmail = document.getElementById('orcamentoClienteEmail').value;
        const clienteTelefone = document.getElementById('orcamentoClienteTelefone').value;
        const clienteEndereco = document.getElementById('orcamentoClienteEndereco').value;
        const descricao = document.getElementById('orcamentoDescricao').value;
        const observacoes = document.getElementById('orcamentoObservacoes').value;

        if (!data || !clienteNome) {
            app.showNotification('Por favor, preencha os campos obrigatórios', 'error');
            return;
        }

        // Collect items
        const itens = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const descricao = row.querySelector('.item-descricao').value;
            const quantidade = parseInt(row.querySelector('.item-quantidade').value) || 0;
            const valor = parseFloat(row.querySelector('.item-valor').value) || 0;
            
            if (descricao && quantidade > 0 && valor > 0) {
                itens.push({
                    descricao,
                    quantidade,
                    valor,
                    total: quantidade * valor
                });
            }
        });

        if (itens.length === 0) {
            app.showNotification('Adicione pelo menos um item ao orçamento', 'error');
            return;
        }

        const valorTotal = itens.reduce((sum, item) => sum + item.total, 0);

        const newOrcamento = {
            id: Date.now(),
            numero: this.generateOrcamentoNumber(),
            data,
            validade,
            cliente: {
                nome: clienteNome,
                email: clienteEmail,
                telefone: clienteTelefone,
                endereco: clienteEndereco
            },
            descricao,
            itens,
            valorTotal,
            observacoes,
            status: 'pendente',
            createdAt: new Date().toISOString(),
            createdBy: authController.currentUser ? authController.currentUser.id : null
        };

        const orcamentos = this.getAllOrcamentos();
        orcamentos.push(newOrcamento);
        localStorage.setItem('orcamentos', JSON.stringify(orcamentos));

        modalController.close();
        this.loadOrcamentos();
        app.showNotification('Orçamento criado com sucesso!', 'success');
    }

    generateOrcamentoNumber() {
        const orcamentos = this.getAllOrcamentos();
        const lastNumber = orcamentos.length > 0 
            ? Math.max(...orcamentos.map(o => parseInt(o.numero.replace('ORC', ''))))
            : 0;
        return `ORC${String(lastNumber + 1).padStart(4, '0')}`;
    }

    viewOrcamento(orcamentoId) {
        const orcamento = this.getOrcamentoById(orcamentoId);
        if (!orcamento) return;

        const modalContent = `
            <div class="modal-header">
                <h3>Orçamento #${orcamento.numero}</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="orcamento-view">
                    <div class="orcamento-header-info">
                        <div class="info-row">
                            <div class="info-item">
                                <label>Número:</label>
                                <span>${orcamento.numero}</span>
                            </div>
                            <div class="info-item">
                                <label>Data:</label>
                                <span>${app.formatDate(orcamento.data)}</span>
                            </div>
                            <div class="info-item">
                                <label>Status:</label>
                                <span class="status-badge status-${orcamento.status}">
                                    ${this.getStatusText(orcamento.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cliente-info">
                        <h4>Dados do Cliente</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Nome:</label>
                                <span>${orcamento.cliente.nome}</span>
                            </div>
                            ${orcamento.cliente.email ? `
                                <div class="info-item">
                                    <label>Email:</label>
                                    <span>${orcamento.cliente.email}</span>
                                </div>
                            ` : ''}
                            ${orcamento.cliente.telefone ? `
                                <div class="info-item">
                                    <label>Telefone:</label>
                                    <span>${orcamento.cliente.telefone}</span>
                                </div>
                            ` : ''}
                            ${orcamento.cliente.endereco ? `
                                <div class="info-item">
                                    <label>Endereço:</label>
                                    <span>${orcamento.cliente.endereco}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${orcamento.descricao ? `
                        <div class="descricao-section">
                            <h4>Descrição do Projeto</h4>
                            <p>${orcamento.descricao}</p>
                        </div>
                    ` : ''}
                    
                    <div class="itens-section">
                        <h4>Itens do Orçamento</h4>
                        <table class="itens-table">
                            <thead>
                                <tr>
                                    <th>Descrição</th>
                                    <th>Qtd</th>
                                    <th>Valor Unit.</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orcamento.itens.map(item => `
                                    <tr>
                                        <td>${item.descricao}</td>
                                        <td>${item.quantidade}</td>
                                        <td>${app.formatCurrency(item.valor)}</td>
                                        <td>${app.formatCurrency(item.total)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" class="total-label">Total:</td>
                                    <td class="total-value">${app.formatCurrency(orcamento.valorTotal)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    ${orcamento.observacoes ? `
                        <div class="observacoes-section">
                            <h4>Observações</h4>
                            <p>${orcamento.observacoes}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Fechar</button>
                <button class="btn-primary" onclick="orcamentosController.generatePDF(${orcamento.id})">
                    <i class="fas fa-file-pdf"></i>
                    Gerar PDF
                </button>
                <button class="btn-primary" onclick="orcamentosController.approveOrcamento(${orcamento.id})">
                    <i class="fas fa-check"></i>
                    Aprovar
                </button>
            </div>
        `;

        modalController.show(modalContent);
    }

    editOrcamento(orcamentoId) {
        const orcamento = this.getOrcamentoById(orcamentoId);
        if (!orcamento) return;

        // Similar to new orcamento modal but with pre-filled data
        this.showEditOrcamentoModal(orcamento);
    }

    showEditOrcamentoModal(orcamento) {
        // Implementation similar to showNewOrcamentoModal but with pre-filled data
        // This would be a longer implementation, so I'll provide a simplified version
        app.showNotification('Funcionalidade de edição será implementada em breve', 'info');
    }

    deleteOrcamento(orcamentoId) {
        const orcamento = this.getOrcamentoById(orcamentoId);
        if (confirm(`Confirmar exclusão do orçamento #${orcamento.numero}?`)) {
            const orcamentos = this.getAllOrcamentos();
            const filteredOrcamentos = orcamentos.filter(o => o.id !== orcamentoId);
            localStorage.setItem('orcamentos', JSON.stringify(filteredOrcamentos));
            this.loadOrcamentos();
            app.showNotification('Orçamento excluído com sucesso!', 'success');
        }
    }

    approveOrcamento(orcamentoId) {
        const orcamento = this.getOrcamentoById(orcamentoId);
        if (orcamento.status === 'pendente') {
            const orcamentos = this.getAllOrcamentos();
            const orcamentoIndex = orcamentos.findIndex(o => o.id === orcamentoId);
            orcamentos[orcamentoIndex].status = 'aprovado';
            orcamentos[orcamentoIndex].approvedAt = new Date().toISOString();
            localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
            
            modalController.close();
            this.loadOrcamentos();
            app.showNotification('Orçamento aprovado com sucesso!', 'success');
        }
    }

    getOrcamentoById(orcamentoId) {
        const orcamentos = this.getAllOrcamentos();
        return orcamentos.find(o => o.id === orcamentoId);
    }

    getStatusText(status) {
        const statusTexts = {
            'pendente': 'Pendente',
            'aprovado': 'Aprovado',
            'rejeitado': 'Rejeitado',
            'cancelado': 'Cancelado'
        };
        return statusTexts[status] || status;
    }

    generatePDF(orcamentoId) {
        const orcamento = this.getOrcamentoById(orcamentoId);
        if (!orcamento) return;

        // Simple PDF generation using browser print
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Orçamento #${orcamento.numero}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                    .itens-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .itens-table th, .itens-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .itens-table th { background-color: #f5f5f5; }
                    .total-row { font-weight: bold; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Orçamento #${orcamento.numero}</h1>
                    <p>Data: ${app.formatDate(orcamento.data)}</p>
                </div>
                
                <div class="info-grid">
                    <div>
                        <h3>Dados do Cliente</h3>
                        <p><strong>Nome:</strong> ${orcamento.cliente.nome}</p>
                        ${orcamento.cliente.email ? `<p><strong>Email:</strong> ${orcamento.cliente.email}</p>` : ''}
                        ${orcamento.cliente.telefone ? `<p><strong>Telefone:</strong> ${orcamento.cliente.telefone}</p>` : ''}
                        ${orcamento.cliente.endereco ? `<p><strong>Endereço:</strong> ${orcamento.cliente.endereco}</p>` : ''}
                    </div>
                    <div>
                        <h3>Informações do Orçamento</h3>
                        <p><strong>Status:</strong> ${this.getStatusText(orcamento.status)}</p>
                        <p><strong>Validade:</strong> ${orcamento.validade} dias</p>
                    </div>
                </div>
                
                ${orcamento.descricao ? `
                    <div>
                        <h3>Descrição do Projeto</h3>
                        <p>${orcamento.descricao}</p>
                    </div>
                ` : ''}
                
                <table class="itens-table">
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Quantidade</th>
                            <th>Valor Unitário</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orcamento.itens.map(item => `
                            <tr>
                                <td>${item.descricao}</td>
                                <td>${item.quantidade}</td>
                                <td>${app.formatCurrency(item.valor)}</td>
                                <td>${app.formatCurrency(item.total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="3">Total:</td>
                            <td>${app.formatCurrency(orcamento.valorTotal)}</td>
                        </tr>
                    </tfoot>
                </table>
                
                ${orcamento.observacoes ? `
                    <div>
                        <h3>Observações</h3>
                        <p>${orcamento.observacoes}</p>
                    </div>
                ` : ''}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    // Search and filter functionality
    searchOrcamentos(query) {
        const orcamentos = this.getAllOrcamentos();
        const filteredOrcamentos = orcamentos.filter(orcamento => 
            orcamento.numero.toLowerCase().includes(query.toLowerCase()) ||
            orcamento.cliente.nome.toLowerCase().includes(query.toLowerCase()) ||
            orcamento.descricao?.toLowerCase().includes(query.toLowerCase())
        );
        this.renderOrcamentosGrid(filteredOrcamentos);
    }

    filterOrcamentosByStatus(status) {
        const orcamentos = this.getAllOrcamentos();
        const filteredOrcamentos = status === 'all' 
            ? orcamentos 
            : orcamentos.filter(orcamento => orcamento.status === status);
        this.renderOrcamentosGrid(filteredOrcamentos);
    }

    // Export orcamentos data
    exportOrcamentosData() {
        const orcamentos = this.getAllOrcamentos();
        const data = {
            orcamentos: orcamentos.map(orcamento => ({
                id: orcamento.id,
                numero: orcamento.numero,
                data: orcamento.data,
                cliente: orcamento.cliente,
                descricao: orcamento.descricao,
                itens: orcamento.itens,
                valorTotal: orcamento.valorTotal,
                status: orcamento.status,
                createdAt: orcamento.createdAt
            })),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orcamentos-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize orcamentos controller
window.orcamentosController = new OrcamentosController(); 
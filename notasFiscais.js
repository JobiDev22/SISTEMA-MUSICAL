// Notas Fiscais Controller
class NotasFiscaisController {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('newNotaFiscalBtn').addEventListener('click', () => {
            this.showNewNotaFiscalModal();
        });
    }

    loadNotasFiscais() {
        const notasFiscais = this.getAllNotasFiscais();
        this.renderNotasFiscaisGrid(notasFiscais);
    }

    getAllNotasFiscais() {
        return JSON.parse(localStorage.getItem('notasFiscais') || '[]');
    }

    renderNotasFiscaisGrid(notasFiscais) {
        const grid = document.getElementById('notasFiscaisGrid');
        
        if (notasFiscais.length === 0) {
            grid.innerHTML = `
                <div class="no-data-card">
                    <i class="fas fa-receipt"></i>
                    <h3>Nenhuma nota fiscal encontrada</h3>
                    <p>Crie sua primeira nota fiscal clicando no botão acima.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = notasFiscais.map(nota => `
            <div class="nota-fiscal-card" data-nota-id="${nota.id}">
                <div class="nota-header">
                    <div class="nota-number">
                        <span class="label">NF #${nota.numero}</span>
                        <span class="status-badge status-${nota.status}">
                            ${this.getStatusText(nota.status)}
                        </span>
                    </div>
                    <div class="nota-actions">
                        <button class="btn-action btn-view" onclick="notasFiscaisController.viewNotaFiscal(${nota.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="notasFiscaisController.editNotaFiscal(${nota.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="notasFiscaisController.deleteNotaFiscal(${nota.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="nota-content">
                    <div class="nota-info">
                        <div class="info-item">
                            <label>Cliente:</label>
                            <span>${nota.cliente.nome}</span>
                        </div>
                        <div class="info-item">
                            <label>Data:</label>
                            <span>${app.formatDate(nota.dataEmissao)}</span>
                        </div>
                        <div class="info-item">
                            <label>Valor Total:</label>
                            <span class="valor-total">${app.formatCurrency(nota.valorTotal)}</span>
                        </div>
                    </div>
                    <div class="nota-description">
                        <p>${nota.descricao || 'Sem descrição'}</p>
                    </div>
                </div>
                <div class="nota-footer">
                    <span class="nota-date">Emitida em ${app.formatDate(nota.createdAt)}</span>
                    <button class="btn-primary btn-sm" onclick="notasFiscaisController.generatePDF(${nota.id})">
                        <i class="fas fa-file-pdf"></i>
                        Gerar PDF
                    </button>
                </div>
            </div>
        `).join('');
    }

    showNewNotaFiscalModal() {
        const modalContent = `
            <div class="modal-header">
                <h3>Nova Nota Fiscal</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="newNotaFiscalForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="notaDataEmissao">Data de Emissão</label>
                            <input type="date" id="notaDataEmissao" required>
                        </div>
                        <div class="form-group">
                            <label for="notaTipo">Tipo de Nota</label>
                            <select id="notaTipo" required>
                                <option value="produto">Produto</option>
                                <option value="servico">Serviço</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="notaClienteNome">Nome do Cliente</label>
                        <input type="text" id="notaClienteNome" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="notaClienteEmail">Email</label>
                            <input type="email" id="notaClienteEmail">
                        </div>
                        <div class="form-group">
                            <label for="notaClienteTelefone">Telefone</label>
                            <input type="tel" id="notaClienteTelefone">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="notaClienteEndereco">Endereço</label>
                        <textarea id="notaClienteEndereco" rows="2"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="notaClienteCPF">CPF/CNPJ</label>
                        <input type="text" id="notaClienteCPF" placeholder="000.000.000-00 ou 00.000.000/0000-00">
                    </div>
                    
                    <div class="form-group">
                        <label for="notaDescricao">Descrição dos Itens</label>
                        <textarea id="notaDescricao" rows="3" placeholder="Descreva os produtos ou serviços..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Itens da Nota Fiscal</label>
                        <div id="notaItens">
                            <div class="item-row">
                                <input type="text" class="item-descricao" placeholder="Descrição do item">
                                <input type="number" class="item-quantidade" placeholder="Qtd" value="1" min="1">
                                <input type="number" class="item-valor" placeholder="Valor unitário" step="0.01" min="0">
                                <select class="item-tipo">
                                    <option value="produto">Produto</option>
                                    <option value="servico">Serviço</option>
                                </select>
                                <button type="button" class="btn-remove-item" onclick="notasFiscaisController.removeNotaItem(this)">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" class="btn-add-item" onclick="notasFiscaisController.addNotaItem()">
                            <i class="fas fa-plus"></i>
                            Adicionar Item
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label for="notaObservacoes">Observações</label>
                        <textarea id="notaObservacoes" rows="3" placeholder="Observações adicionais..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Cancelar</button>
                <button class="btn-primary" onclick="notasFiscaisController.saveNewNotaFiscal()">Emitir Nota Fiscal</button>
            </div>
        `;

        modalController.show(modalContent);
        this.setupNotaFiscalFormListeners();
    }

    setupNotaFiscalFormListeners() {
        // Auto-calculate totals when values change
        document.querySelectorAll('.item-quantidade, .item-valor').forEach(input => {
            input.addEventListener('input', () => {
                this.calculateNotaFiscalTotal();
            });
        });
    }

    addNotaItem() {
        const itensContainer = document.getElementById('notaItens');
        const newItem = document.createElement('div');
        newItem.className = 'item-row';
        newItem.innerHTML = `
            <input type="text" class="item-descricao" placeholder="Descrição do item">
            <input type="number" class="item-quantidade" placeholder="Qtd" value="1" min="1">
            <input type="number" class="item-valor" placeholder="Valor unitário" step="0.01" min="0">
            <select class="item-tipo">
                <option value="produto">Produto</option>
                <option value="servico">Serviço</option>
            </select>
            <button type="button" class="btn-remove-item" onclick="notasFiscaisController.removeNotaItem(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        itensContainer.appendChild(newItem);
        
        // Add event listeners to new inputs
        newItem.querySelectorAll('.item-quantidade, .item-valor').forEach(input => {
            input.addEventListener('input', () => {
                this.calculateNotaFiscalTotal();
            });
        });
    }

    removeNotaItem(button) {
        const itemRow = button.closest('.item-row');
        if (document.querySelectorAll('.item-row').length > 1) {
            itemRow.remove();
            this.calculateNotaFiscalTotal();
        }
    }

    calculateNotaFiscalTotal() {
        let total = 0;
        document.querySelectorAll('.item-row').forEach(row => {
            const quantidade = parseFloat(row.querySelector('.item-quantidade').value) || 0;
            const valor = parseFloat(row.querySelector('.item-valor').value) || 0;
            total += quantidade * valor;
        });
        
        // Update total display if it exists
        const totalDisplay = document.querySelector('.nota-fiscal-total-display');
        if (totalDisplay) {
            totalDisplay.textContent = app.formatCurrency(total);
        }
    }

    saveNewNotaFiscal() {
        const dataEmissao = document.getElementById('notaDataEmissao').value;
        const tipo = document.getElementById('notaTipo').value;
        const clienteNome = document.getElementById('notaClienteNome').value;
        const clienteEmail = document.getElementById('notaClienteEmail').value;
        const clienteTelefone = document.getElementById('notaClienteTelefone').value;
        const clienteEndereco = document.getElementById('notaClienteEndereco').value;
        const clienteCPF = document.getElementById('notaClienteCPF').value;
        const descricao = document.getElementById('notaDescricao').value;
        const observacoes = document.getElementById('notaObservacoes').value;

        if (!dataEmissao || !clienteNome) {
            app.showNotification('Por favor, preencha os campos obrigatórios', 'error');
            return;
        }

        // Collect items
        const itens = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const descricao = row.querySelector('.item-descricao').value;
            const quantidade = parseInt(row.querySelector('.item-quantidade').value) || 0;
            const valor = parseFloat(row.querySelector('.item-valor').value) || 0;
            const tipo = row.querySelector('.item-tipo').value;
            
            if (descricao && quantidade > 0 && valor > 0) {
                itens.push({
                    descricao,
                    quantidade,
                    valor,
                    tipo,
                    total: quantidade * valor
                });
            }
        });

        if (itens.length === 0) {
            app.showNotification('Adicione pelo menos um item à nota fiscal', 'error');
            return;
        }

        const valorTotal = itens.reduce((sum, item) => sum + item.total, 0);

        const newNotaFiscal = {
            id: Date.now(),
            numero: this.generateNotaFiscalNumber(),
            dataEmissao,
            tipo,
            cliente: {
                nome: clienteNome,
                email: clienteEmail,
                telefone: clienteTelefone,
                endereco: clienteEndereco,
                cpf: clienteCPF
            },
            descricao,
            itens,
            valorTotal,
            observacoes,
            status: 'emitida',
            createdAt: new Date().toISOString(),
            createdBy: authController.currentUser ? authController.currentUser.id : null
        };

        const notasFiscais = this.getAllNotasFiscais();
        notasFiscais.push(newNotaFiscal);
        localStorage.setItem('notasFiscais', JSON.stringify(notasFiscais));

        modalController.close();
        this.loadNotasFiscais();
        app.showNotification('Nota fiscal emitida com sucesso!', 'success');
    }

    generateNotaFiscalNumber() {
        const notasFiscais = this.getAllNotasFiscais();
        const lastNumber = notasFiscais.length > 0 
            ? Math.max(...notasFiscais.map(n => parseInt(n.numero.replace('NF', ''))))
            : 0;
        return `NF${String(lastNumber + 1).padStart(4, '0')}`;
    }

    viewNotaFiscal(notaId) {
        const nota = this.getNotaFiscalById(notaId);
        if (!nota) return;

        const modalContent = `
            <div class="modal-header">
                <h3>Nota Fiscal #${nota.numero}</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="nota-fiscal-view">
                    <div class="nota-header-info">
                        <div class="info-row">
                            <div class="info-item">
                                <label>Número:</label>
                                <span>${nota.numero}</span>
                            </div>
                            <div class="info-item">
                                <label>Data de Emissão:</label>
                                <span>${app.formatDate(nota.dataEmissao)}</span>
                            </div>
                            <div class="info-item">
                                <label>Tipo:</label>
                                <span>${nota.tipo === 'produto' ? 'Produto' : 'Serviço'}</span>
                            </div>
                            <div class="info-item">
                                <label>Status:</label>
                                <span class="status-badge status-${nota.status}">
                                    ${this.getStatusText(nota.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cliente-info">
                        <h4>Dados do Cliente</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Nome:</label>
                                <span>${nota.cliente.nome}</span>
                            </div>
                            ${nota.cliente.email ? `
                                <div class="info-item">
                                    <label>Email:</label>
                                    <span>${nota.cliente.email}</span>
                                </div>
                            ` : ''}
                            ${nota.cliente.telefone ? `
                                <div class="info-item">
                                    <label>Telefone:</label>
                                    <span>${nota.cliente.telefone}</span>
                                </div>
                            ` : ''}
                            ${nota.cliente.cpf ? `
                                <div class="info-item">
                                    <label>CPF/CNPJ:</label>
                                    <span>${nota.cliente.cpf}</span>
                                </div>
                            ` : ''}
                            ${nota.cliente.endereco ? `
                                <div class="info-item">
                                    <label>Endereço:</label>
                                    <span>${nota.cliente.endereco}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${nota.descricao ? `
                        <div class="descricao-section">
                            <h4>Descrição dos Itens</h4>
                            <p>${nota.descricao}</p>
                        </div>
                    ` : ''}
                    
                    <div class="itens-section">
                        <h4>Itens da Nota Fiscal</h4>
                        <table class="itens-table">
                            <thead>
                                <tr>
                                    <th>Descrição</th>
                                    <th>Tipo</th>
                                    <th>Qtd</th>
                                    <th>Valor Unit.</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${nota.itens.map(item => `
                                    <tr>
                                        <td>${item.descricao}</td>
                                        <td>${item.tipo === 'produto' ? 'Produto' : 'Serviço'}</td>
                                        <td>${item.quantidade}</td>
                                        <td>${app.formatCurrency(item.valor)}</td>
                                        <td>${app.formatCurrency(item.total)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="4" class="total-label">Total:</td>
                                    <td class="total-value">${app.formatCurrency(nota.valorTotal)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    ${nota.observacoes ? `
                        <div class="observacoes-section">
                            <h4>Observações</h4>
                            <p>${nota.observacoes}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Fechar</button>
                <button class="btn-primary" onclick="notasFiscaisController.generatePDF(${nota.id})">
                    <i class="fas fa-file-pdf"></i>
                    Gerar PDF
                </button>
            </div>
        `;

        modalController.show(modalContent);
    }

    editNotaFiscal(notaId) {
        const nota = this.getNotaFiscalById(notaId);
        if (!nota) return;

        app.showNotification('Funcionalidade de edição será implementada em breve', 'info');
    }

    deleteNotaFiscal(notaId) {
        const nota = this.getNotaFiscalById(notaId);
        if (confirm(`Confirmar exclusão da nota fiscal #${nota.numero}?`)) {
            const notasFiscais = this.getAllNotasFiscais();
            const filteredNotasFiscais = notasFiscais.filter(n => n.id !== notaId);
            localStorage.setItem('notasFiscais', JSON.stringify(filteredNotasFiscais));
            this.loadNotasFiscais();
            app.showNotification('Nota fiscal excluída com sucesso!', 'success');
        }
    }

    getNotaFiscalById(notaId) {
        const notasFiscais = this.getAllNotasFiscais();
        return notasFiscais.find(n => n.id === notaId);
    }

    getStatusText(status) {
        const statusTexts = {
            'emitida': 'Emitida',
            'cancelada': 'Cancelada',
            'estornada': 'Estornada'
        };
        return statusTexts[status] || status;
    }

    generatePDF(notaId) {
        const nota = this.getNotaFiscalById(notaId);
        if (!nota) return;

        // Simple PDF generation using browser print
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Nota Fiscal #${nota.numero}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                    .itens-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .itens-table th, .itens-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .itens-table th { background-color: #f5f5f5; }
                    .total-row { font-weight: bold; }
                    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>NOTA FISCAL</h1>
                    <h2>#${nota.numero}</h2>
                    <p>Data de Emissão: ${app.formatDate(nota.dataEmissao)}</p>
                    <p>Tipo: ${nota.tipo === 'produto' ? 'Produto' : 'Serviço'}</p>
                </div>
                
                <div class="info-grid">
                    <div>
                        <h3>Dados do Cliente</h3>
                        <p><strong>Nome:</strong> ${nota.cliente.nome}</p>
                        ${nota.cliente.email ? `<p><strong>Email:</strong> ${nota.cliente.email}</p>` : ''}
                        ${nota.cliente.telefone ? `<p><strong>Telefone:</strong> ${nota.cliente.telefone}</p>` : ''}
                        ${nota.cliente.cpf ? `<p><strong>CPF/CNPJ:</strong> ${nota.cliente.cpf}</p>` : ''}
                        ${nota.cliente.endereco ? `<p><strong>Endereço:</strong> ${nota.cliente.endereco}</p>` : ''}
                    </div>
                    <div>
                        <h3>Informações da Nota</h3>
                        <p><strong>Status:</strong> ${this.getStatusText(nota.status)}</p>
                        <p><strong>Data de Criação:</strong> ${app.formatDate(nota.createdAt)}</p>
                    </div>
                </div>
                
                ${nota.descricao ? `
                    <div>
                        <h3>Descrição dos Itens</h3>
                        <p>${nota.descricao}</p>
                    </div>
                ` : ''}
                
                <table class="itens-table">
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Tipo</th>
                            <th>Quantidade</th>
                            <th>Valor Unitário</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${nota.itens.map(item => `
                            <tr>
                                <td>${item.descricao}</td>
                                <td>${item.tipo === 'produto' ? 'Produto' : 'Serviço'}</td>
                                <td>${item.quantidade}</td>
                                <td>${app.formatCurrency(item.valor)}</td>
                                <td>${app.formatCurrency(item.total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="4">Total:</td>
                            <td>${app.formatCurrency(nota.valorTotal)}</td>
                        </tr>
                    </tfoot>
                </table>
                
                ${nota.observacoes ? `
                    <div>
                        <h3>Observações</h3>
                        <p>${nota.observacoes}</p>
                    </div>
                ` : ''}
                
                <div class="footer">
                    <p>Esta é uma nota fiscal eletrônica gerada pelo Sistema Ayane</p>
                    <p>Data de impressão: ${new Date().toLocaleString('pt-BR')}</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    // Search and filter functionality
    searchNotasFiscais(query) {
        const notasFiscais = this.getAllNotasFiscais();
        const filteredNotasFiscais = notasFiscais.filter(nota => 
            nota.numero.toLowerCase().includes(query.toLowerCase()) ||
            nota.cliente.nome.toLowerCase().includes(query.toLowerCase()) ||
            nota.descricao?.toLowerCase().includes(query.toLowerCase())
        );
        this.renderNotasFiscaisGrid(filteredNotasFiscais);
    }

    filterNotasFiscaisByStatus(status) {
        const notasFiscais = this.getAllNotasFiscais();
        const filteredNotasFiscais = status === 'all' 
            ? notasFiscais 
            : notasFiscais.filter(nota => nota.status === status);
        this.renderNotasFiscaisGrid(filteredNotasFiscais);
    }

    filterNotasFiscaisByTipo(tipo) {
        const notasFiscais = this.getAllNotasFiscais();
        const filteredNotasFiscais = tipo === 'all' 
            ? notasFiscais 
            : notasFiscais.filter(nota => nota.tipo === tipo);
        this.renderNotasFiscaisGrid(filteredNotasFiscais);
    }

    // Export notas fiscais data
    exportNotasFiscaisData() {
        const notasFiscais = this.getAllNotasFiscais();
        const data = {
            notasFiscais: notasFiscais.map(nota => ({
                id: nota.id,
                numero: nota.numero,
                dataEmissao: nota.dataEmissao,
                tipo: nota.tipo,
                cliente: nota.cliente,
                descricao: nota.descricao,
                itens: nota.itens,
                valorTotal: nota.valorTotal,
                status: nota.status,
                createdAt: nota.createdAt
            })),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notas-fiscais-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize notas fiscais controller
window.notasFiscaisController = new NotasFiscaisController(); 
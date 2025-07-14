// Financeiro Controller
class FinanceiroController {
    constructor() {
        this.chart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addTransactionBtn').addEventListener('click', () => {
            this.showAddTransactionModal();
        });
    }

    loadFinanceiro() {
        this.updateFinancialSummary();
        this.loadTransactions();
        
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            this.createFinancialChart();
        }, 100);
    }

    updateFinancialSummary() {
        const transactions = this.getAllTransactions();
        
        const entradas = transactions
            .filter(t => t.type === 'entrada')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            
        const saidas = transactions
            .filter(t => t.type === 'saida')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            
        const reservado = transactions
            .filter(t => t.type === 'reservado')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            
        const saldo = entradas - saidas - reservado;

        document.getElementById('totalEntradas').textContent = app.formatCurrency(entradas);
        document.getElementById('totalSaidas').textContent = app.formatCurrency(saidas);
        document.getElementById('totalReservado').textContent = app.formatCurrency(reservado);
        document.getElementById('saldoTotal').textContent = app.formatCurrency(saldo);
        
        // Update color based on balance
        const saldoElement = document.getElementById('saldoTotal');
        saldoElement.className = 'stat-value ' + (saldo >= 0 ? 'positive' : 'negative');
    }

    loadTransactions() {
        const transactions = this.getAllTransactions();
        const transactionsList = document.getElementById('transactionsList');
        
        if (transactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-chart-line"></i>
                    <p>Nenhuma transação encontrada</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        transactionsList.innerHTML = sortedTransactions.slice(0, 10).map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-title">${transaction.description}</div>
                    <div class="transaction-date">${app.formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'entrada' ? '+' : transaction.type === 'saida' ? '-' : '='} 
                    ${app.formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-actions">
                    <button class="btn-action btn-view" onclick="financeiroController.viewTransaction(${transaction.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="financeiroController.editTransaction(${transaction.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="financeiroController.deleteTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    createFinancialChart() {
        const canvas = document.getElementById('financialChart');
        
        // Check if canvas exists
        if (!canvas) {
            console.error('Canvas element "financialChart" not found');
            return;
        }
        
        // Check if Chart.js is loaded, if not wait for it
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not loaded yet, waiting...');
            setTimeout(() => {
                this.createFinancialChart();
            }, 500);
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }

        const chartData = this.getChartData();
        
        // Check if we have data to display
        if (!chartData || !chartData.labels || chartData.labels.length === 0) {
            console.log('No chart data available');
            return;
        }
        
        try {
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: 'Entradas',
                            data: chartData.entradas,
                            borderColor: '#4caf50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            tension: 0.4,
                            borderWidth: 3
                        },
                        {
                            label: 'Saídas',
                            data: chartData.saidas,
                            borderColor: '#dc3545',
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            tension: 0.4,
                            borderWidth: 3
                        },
                        {
                            label: 'Saldo',
                            data: chartData.saldo,
                            borderColor: '#fff',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            tension: 0.4,
                            borderWidth: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#fff',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Evolução Financeira',
                            color: '#fff',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#bbb',
                                font: {
                                    size: 11
                                }
                            },
                            grid: {
                                color: '#333'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#bbb',
                                font: {
                                    size: 11
                                },
                                callback: function(value) {
                                    return app.formatCurrency(value);
                                }
                            },
                            grid: {
                                color: '#333'
                            }
                        }
                    }
                }
            });
            console.log('Chart created successfully');
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }

    getChartData() {
        const transactions = this.getAllTransactions();
        const last6Months = [];
        
        // Generate last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push(date.toISOString().slice(0, 7)); // YYYY-MM format
        }

        const labels = last6Months.map(month => {
            const [year, monthNum] = month.split('-');
            const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            return `${monthNames[parseInt(monthNum) - 1]}/${year}`;
        });

        const entradas = last6Months.map(month => {
            return transactions
                .filter(t => t.type === 'entrada' && t.date.startsWith(month))
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        });

        const saidas = last6Months.map(month => {
            return transactions
                .filter(t => t.type === 'saida' && t.date.startsWith(month))
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        });

        const saldo = last6Months.map((month, index) => {
            return entradas[index] - saidas[index];
        });

        // If no transactions exist, create some sample data for demonstration
        if (transactions.length === 0) {
            // Create sample data for the last 6 months
            const sampleEntradas = [15000, 18000, 22000, 19000, 25000, 28000];
            const sampleSaidas = [12000, 14000, 16000, 15000, 18000, 20000];
            const sampleSaldo = sampleEntradas.map((entrada, index) => entrada - sampleSaidas[index]);
            
            return { 
                labels, 
                entradas: sampleEntradas, 
                saidas: sampleSaidas, 
                saldo: sampleSaldo 
            };
        }

        return { labels, entradas, saidas, saldo };
    }

    showAddTransactionModal() {
        const modalContent = `
            <div class="modal-header">
                <h3>Nova Transação</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="addTransactionForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="transactionDate">Data</label>
                            <input type="date" id="transactionDate" required>
                        </div>
                        <div class="form-group">
                            <label for="transactionType">Tipo</label>
                            <select id="transactionType" required>
                                <option value="entrada">Entrada</option>
                                <option value="saida">Saída</option>
                                <option value="reservado">Reservado</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="transactionDescription">Descrição</label>
                        <input type="text" id="transactionDescription" placeholder="Descrição da transação" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="transactionAmount">Valor</label>
                        <input type="number" id="transactionAmount" placeholder="0,00" step="0.01" min="0" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="transactionCategory">Categoria</label>
                        <select id="transactionCategory">
                            <option value="">Selecione uma categoria</option>
                            <option value="vendas">Vendas</option>
                            <option value="servicos">Serviços</option>
                            <option value="investimentos">Investimentos</option>
                            <option value="despesas">Despesas</option>
                            <option value="impostos">Impostos</option>
                            <option value="salarios">Salários</option>
                            <option value="equipamentos">Equipamentos</option>
                            <option value="marketing">Marketing</option>
                            <option value="outros">Outros</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="transactionPaymentMethod">Forma de Pagamento</label>
                        <select id="transactionPaymentMethod">
                            <option value="">Selecione a forma de pagamento</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="pix">PIX</option>
                            <option value="cartao_credito">Cartão de Crédito</option>
                            <option value="cartao_debito">Cartão de Débito</option>
                            <option value="transferencia">Transferência</option>
                            <option value="boleto">Boleto</option>
                            <option value="cheque">Cheque</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="transactionObservations">Observações</label>
                        <textarea id="transactionObservations" rows="3" placeholder="Observações adicionais..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Cancelar</button>
                <button class="btn-primary" onclick="financeiroController.saveNewTransaction()">Salvar Transação</button>
            </div>
        `;

        modalController.show(modalContent);
        
        // Set default date to today
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
    }

    saveNewTransaction() {
        const date = document.getElementById('transactionDate').value;
        const type = document.getElementById('transactionType').value;
        const description = document.getElementById('transactionDescription').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const category = document.getElementById('transactionCategory').value;
        const paymentMethod = document.getElementById('transactionPaymentMethod').value;
        const observations = document.getElementById('transactionObservations').value;

        if (!date || !description || isNaN(amount) || amount <= 0) {
            app.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }

        const newTransaction = {
            id: Date.now(),
            date,
            type,
            description,
            amount,
            category,
            paymentMethod,
            observations,
            createdAt: new Date().toISOString(),
            createdBy: authController.currentUser ? authController.currentUser.id : null
        };

        const transactions = this.getAllTransactions();
        transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        modalController.close();
        this.loadFinanceiro();
        app.showNotification('Transação adicionada com sucesso!', 'success');
    }

    viewTransaction(transactionId) {
        const transaction = this.getTransactionById(transactionId);
        if (!transaction) return;

        const modalContent = `
            <div class="modal-header">
                <h3>Detalhes da Transação</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="transaction-details">
                    <div class="detail-item">
                        <label>Data:</label>
                        <span>${app.formatDate(transaction.date)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Tipo:</label>
                        <span class="transaction-type ${transaction.type}">
                            ${this.getTransactionTypeText(transaction.type)}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>Descrição:</label>
                        <span>${transaction.description}</span>
                    </div>
                    <div class="detail-item">
                        <label>Valor:</label>
                        <span class="transaction-amount ${transaction.type}">
                            ${transaction.type === 'entrada' ? '+' : transaction.type === 'saida' ? '-' : '='} 
                            ${app.formatCurrency(transaction.amount)}
                        </span>
                    </div>
                    ${transaction.category ? `
                        <div class="detail-item">
                            <label>Categoria:</label>
                            <span>${this.getCategoryText(transaction.category)}</span>
                        </div>
                    ` : ''}
                    ${transaction.paymentMethod ? `
                        <div class="detail-item">
                            <label>Forma de Pagamento:</label>
                            <span>${this.getPaymentMethodText(transaction.paymentMethod)}</span>
                        </div>
                    ` : ''}
                    ${transaction.observations ? `
                        <div class="detail-item">
                            <label>Observações:</label>
                            <span>${transaction.observations}</span>
                        </div>
                    ` : ''}
                    <div class="detail-item">
                        <label>Data de Criação:</label>
                        <span>${app.formatDateTime(transaction.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Fechar</button>
            </div>
        `;

        modalController.show(modalContent);
    }

    editTransaction(transactionId) {
        const transaction = this.getTransactionById(transactionId);
        if (!transaction) return;

        app.showNotification('Funcionalidade de edição será implementada em breve', 'info');
    }

    deleteTransaction(transactionId) {
        const transaction = this.getTransactionById(transactionId);
        if (confirm(`Confirmar exclusão da transação "${transaction.description}"?`)) {
            const transactions = this.getAllTransactions();
            const filteredTransactions = transactions.filter(t => t.id !== transactionId);
            localStorage.setItem('transactions', JSON.stringify(filteredTransactions));
            this.loadFinanceiro();
            app.showNotification('Transação excluída com sucesso!', 'success');
        }
    }

    getAllTransactions() {
        return JSON.parse(localStorage.getItem('transactions') || '[]');
    }

    getTransactionById(transactionId) {
        const transactions = this.getAllTransactions();
        return transactions.find(t => t.id === transactionId);
    }

    getTransactionTypeText(type) {
        const types = {
            'entrada': 'Entrada',
            'saida': 'Saída',
            'reservado': 'Reservado'
        };
        return types[type] || type;
    }

    getCategoryText(category) {
        const categories = {
            'vendas': 'Vendas',
            'servicos': 'Serviços',
            'investimentos': 'Investimentos',
            'despesas': 'Despesas',
            'impostos': 'Impostos',
            'salarios': 'Salários',
            'equipamentos': 'Equipamentos',
            'marketing': 'Marketing',
            'outros': 'Outros'
        };
        return categories[category] || category;
    }

    getPaymentMethodText(method) {
        const methods = {
            'dinheiro': 'Dinheiro',
            'pix': 'PIX',
            'cartao_credito': 'Cartão de Crédito',
            'cartao_debito': 'Cartão de Débito',
            'transferencia': 'Transferência',
            'boleto': 'Boleto',
            'cheque': 'Cheque'
        };
        return methods[method] || method;
    }

    // Financial reports
    generateFinancialReport(startDate, endDate) {
        const transactions = this.getAllTransactions();
        const filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            
            if (start && end) {
                return transactionDate >= start && transactionDate <= end;
            } else if (start) {
                return transactionDate >= start;
            } else if (end) {
                return transactionDate <= end;
            }
            return true;
        });

        const report = {
            period: {
                start: startDate,
                end: endDate
            },
            summary: {
                entradas: 0,
                saidas: 0,
                reservado: 0,
                saldo: 0
            },
            byCategory: {},
            byPaymentMethod: {},
            transactions: filteredTransactions
        };

        filteredTransactions.forEach(transaction => {
            report.summary[transaction.type] += transaction.amount;
            
            if (transaction.category) {
                report.byCategory[transaction.category] = (report.byCategory[transaction.category] || 0) + transaction.amount;
            }
            
            if (transaction.paymentMethod) {
                report.byPaymentMethod[transaction.paymentMethod] = (report.byPaymentMethod[transaction.paymentMethod] || 0) + transaction.amount;
            }
        });

        report.summary.saldo = report.summary.entradas - report.summary.saidas - report.summary.reservado;

        return report;
    }

    // Export financial data
    exportFinancialData() {
        const transactions = this.getAllTransactions();
        const data = {
            transactions: transactions.map(t => ({
                id: t.id,
                date: t.date,
                type: t.type,
                description: t.description,
                amount: t.amount,
                category: t.category,
                paymentMethod: t.paymentMethod,
                observations: t.observations,
                createdAt: t.createdAt
            })),
            summary: {
                totalEntradas: transactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0),
                totalSaidas: transactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0),
                totalReservado: transactions.filter(t => t.type === 'reservado').reduce((sum, t) => sum + t.amount, 0)
            },
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Search and filter functionality
    searchTransactions(query) {
        const transactions = this.getAllTransactions();
        const filteredTransactions = transactions.filter(transaction => 
            transaction.description.toLowerCase().includes(query.toLowerCase()) ||
            transaction.category?.toLowerCase().includes(query.toLowerCase()) ||
            transaction.paymentMethod?.toLowerCase().includes(query.toLowerCase())
        );
        this.renderTransactionsList(filteredTransactions);
    }

    filterTransactionsByType(type) {
        const transactions = this.getAllTransactions();
        const filteredTransactions = type === 'all' 
            ? transactions 
            : transactions.filter(transaction => transaction.type === type);
        this.renderTransactionsList(filteredTransactions);
    }

    filterTransactionsByCategory(category) {
        const transactions = this.getAllTransactions();
        const filteredTransactions = category === 'all' 
            ? transactions 
            : transactions.filter(transaction => transaction.category === category);
        this.renderTransactionsList(filteredTransactions);
    }

    renderTransactionsList(transactions) {
        const transactionsList = document.getElementById('transactionsList');
        
        if (transactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-chart-line"></i>
                    <p>Nenhuma transação encontrada</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        transactionsList.innerHTML = sortedTransactions.slice(0, 10).map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-title">${transaction.description}</div>
                    <div class="transaction-date">${app.formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'entrada' ? '+' : transaction.type === 'saida' ? '-' : '='} 
                    ${app.formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-actions">
                    <button class="btn-action btn-view" onclick="financeiroController.viewTransaction(${transaction.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="financeiroController.editTransaction(${transaction.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="financeiroController.deleteTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize financeiro controller
window.financeiroController = new FinanceiroController(); 
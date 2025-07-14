// Demo Data for Sistema Ayane
class DemoData {
    constructor() {
        this.init();
    }

    init() {
        // Only load demo data if no data exists
        if (this.shouldLoadDemoData()) {
            this.loadDemoData();
        }
    }

    shouldLoadDemoData() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const musics = JSON.parse(localStorage.getItem('musics') || '[]');
        const orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]');
        const notasFiscais = JSON.parse(localStorage.getItem('notasFiscais') || '[]');
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

        // Load demo data if only admin user exists and no other data
        const hasAdminUser = users.some(u => u.email === 'Geren@gmail.com');
        return hasAdminUser && users.length <= 1 && musics.length === 0 && orcamentos.length === 0 && 
               notasFiscais.length === 0 && transactions.length === 0;
    }

    loadDemoData() {
        console.log('Carregando dados de demonstração...');
        
        this.loadDemoUsers();
        this.loadDemoMusics();
        this.loadDemoOrcamentos();
        this.loadDemoNotasFiscais();
        this.loadDemoTransactions();
        
        console.log('Dados de demonstração carregados com sucesso!');
    }

    loadDemoUsers() {
        // Get existing admin user
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const adminUser = existingUsers.find(u => u.email === 'Geren@gmail.com');
        
        const users = [
            // Keep existing admin user or create new one
            adminUser || {
                id: 1,
                name: 'Administrador',
                email: 'Geren@gmail.com',
                password: 'Omojagun18',
                role: 'admin',
                status: 'active',
                createdAt: '2024-01-01T00:00:00.000Z',
                lastAccess: new Date().toISOString()
            },
            {
                id: 2,
                name: 'João Silva',
                email: 'joao@ayane.com',
                password: '123456',
                role: 'user',
                status: 'active',
                createdAt: '2024-01-15T00:00:00.000Z',
                lastAccess: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                name: 'Maria Santos',
                email: 'maria@ayane.com',
                password: '123456',
                role: 'user',
                status: 'active',
                createdAt: '2024-01-20T00:00:00.000Z',
                lastAccess: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 4,
                name: 'Pedro Costa',
                email: 'pedro@ayane.com',
                password: '123456',
                role: 'user',
                status: 'pending',
                createdAt: '2024-02-01T00:00:00.000Z',
                lastAccess: null
            }
        ];

        localStorage.setItem('users', JSON.stringify(users));
    }

    loadDemoMusics() {
        const musics = [
            {
                id: 1,
                dataPublicacao: '2024-01-15',
                dj: 'DJ Alok',
                interprete: 'Alok',
                link: 'https://open.spotify.com/track/example1',
                genero: 'house',
                bpm: 128,
                duracao: 3.45,
                observacoes: 'Música de sucesso no verão 2024',
                createdAt: '2024-01-15T10:00:00.000Z',
                createdBy: 2
            },
            {
                id: 2,
                dataPublicacao: '2024-01-20',
                dj: 'DJ Snake',
                interprete: 'DJ Snake ft. Justin Bieber',
                link: 'https://open.spotify.com/track/example2',
                genero: 'edm',
                bpm: 130,
                duracao: 3.20,
                observacoes: 'Colaboração internacional',
                createdAt: '2024-01-20T14:30:00.000Z',
                createdBy: 2
            },
            {
                id: 3,
                dataPublicacao: '2024-01-25',
                dj: 'Skrillex',
                interprete: 'Skrillex',
                link: 'https://open.spotify.com/track/example3',
                genero: 'dubstep',
                bpm: 140,
                duracao: 4.15,
                observacoes: 'Música experimental',
                createdAt: '2024-01-25T16:45:00.000Z',
                createdBy: 3
            },
            {
                id: 4,
                dataPublicacao: '2024-02-01',
                dj: 'Calvin Harris',
                interprete: 'Calvin Harris ft. Dua Lipa',
                link: 'https://open.spotify.com/track/example4',
                genero: 'pop',
                bpm: 120,
                duracao: 3.30,
                observacoes: 'Hit do momento',
                createdAt: '2024-02-01T09:15:00.000Z',
                createdBy: 3
            },
            {
                id: 5,
                dataPublicacao: '2024-02-05',
                dj: 'Martin Garrix',
                interprete: 'Martin Garrix',
                link: 'https://open.spotify.com/track/example5',
                genero: 'edm',
                bpm: 128,
                duracao: 3.55,
                observacoes: 'Música para festivais',
                createdAt: '2024-02-05T11:20:00.000Z',
                createdBy: 2
            }
        ];

        localStorage.setItem('musics', JSON.stringify(musics));
    }

    loadDemoOrcamentos() {
        const orcamentos = [
            {
                id: 1,
                numero: 'ORC0001',
                data: '2024-01-10',
                validade: 30,
                cliente: {
                    nome: 'Festival Eletrônico 2024',
                    email: 'contato@festivaleletronico.com',
                    telefone: '(11) 99999-9999',
                    endereco: 'Av. Paulista, 1000 - São Paulo, SP'
                },
                descricao: 'Produção musical para festival de música eletrônica',
                itens: [
                    {
                        descricao: 'Produção de 5 músicas originais',
                        quantidade: 5,
                        valor: 2000,
                        total: 10000
                    },
                    {
                        descricao: 'Mixagem e masterização',
                        quantidade: 1,
                        valor: 1500,
                        total: 1500
                    },
                    {
                        descricao: 'Direitos autorais',
                        quantidade: 1,
                        valor: 500,
                        total: 500
                    }
                ],
                valorTotal: 12000,
                observacoes: 'Prazo de entrega: 30 dias',
                status: 'aprovado',
                createdAt: '2024-01-10T08:00:00.000Z',
                approvedAt: '2024-01-12T10:00:00.000Z',
                createdBy: 2
            },
            {
                id: 2,
                numero: 'ORC0002',
                data: '2024-01-20',
                validade: 15,
                cliente: {
                    nome: 'Restaurante Sabor & Som',
                    email: 'gerente@sabor&som.com',
                    telefone: '(11) 88888-8888',
                    endereco: 'Rua Augusta, 500 - São Paulo, SP'
                },
                descricao: 'Playlist personalizada para ambiente',
                itens: [
                    {
                        descricao: 'Criação de playlist personalizada',
                        quantidade: 1,
                        valor: 800,
                        total: 800
                    },
                    {
                        descricao: 'Licenciamento de músicas',
                        quantidade: 1,
                        valor: 300,
                        total: 300
                    }
                ],
                valorTotal: 1100,
                observacoes: 'Playlist com 50 músicas',
                status: 'pendente',
                createdAt: '2024-01-20T14:30:00.000Z',
                createdBy: 3
            },
            {
                id: 3,
                numero: 'ORC0003',
                data: '2024-02-01',
                validade: 45,
                cliente: {
                    nome: 'Produtora de Vídeos CineArt',
                    email: 'produção@cineart.com',
                    telefone: '(11) 77777-7777',
                    endereco: 'Rua Oscar Freire, 200 - São Paulo, SP'
                },
                descricao: 'Trilha sonora para documentário',
                itens: [
                    {
                        descricao: 'Composição de trilha sonora',
                        quantidade: 1,
                        valor: 5000,
                        total: 5000
                    },
                    {
                        descricao: 'Gravação de instrumentos',
                        quantidade: 1,
                        valor: 2000,
                        total: 2000
                    },
                    {
                        descricao: 'Mixagem e finalização',
                        quantidade: 1,
                        valor: 1500,
                        total: 1500
                    }
                ],
                valorTotal: 8500,
                observacoes: 'Documentário de 60 minutos',
                status: 'aprovado',
                createdAt: '2024-02-01T09:15:00.000Z',
                approvedAt: '2024-02-03T16:00:00.000Z',
                createdBy: 2
            }
        ];

        localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    }

    loadDemoNotasFiscais() {
        const notasFiscais = [
            {
                id: 1,
                numero: 'NF0001',
                dataEmissao: '2024-01-15',
                tipo: 'servico',
                cliente: {
                    nome: 'Festival Eletrônico 2024',
                    email: 'contato@festivaleletronico.com',
                    telefone: '(11) 99999-9999',
                    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
                    cpf: '12.345.678/0001-90'
                },
                descricao: 'Serviços de produção musical',
                itens: [
                    {
                        descricao: 'Produção de 5 músicas originais',
                        quantidade: 5,
                        valor: 2000,
                        tipo: 'servico',
                        total: 10000
                    },
                    {
                        descricao: 'Mixagem e masterização',
                        quantidade: 1,
                        valor: 1500,
                        tipo: 'servico',
                        total: 1500
                    }
                ],
                valorTotal: 11500,
                observacoes: 'Nota fiscal referente ao orçamento ORC0001',
                status: 'emitida',
                createdAt: '2024-01-15T10:00:00.000Z',
                createdBy: 2
            },
            {
                id: 2,
                numero: 'NF0002',
                dataEmissao: '2024-02-05',
                tipo: 'servico',
                cliente: {
                    nome: 'Produtora de Vídeos CineArt',
                    email: 'produção@cineart.com',
                    telefone: '(11) 77777-7777',
                    endereco: 'Rua Oscar Freire, 200 - São Paulo, SP',
                    cpf: '98.765.432/0001-10'
                },
                descricao: 'Serviços de trilha sonora',
                itens: [
                    {
                        descricao: 'Composição de trilha sonora',
                        quantidade: 1,
                        valor: 5000,
                        tipo: 'servico',
                        total: 5000
                    },
                    {
                        descricao: 'Gravação de instrumentos',
                        quantidade: 1,
                        valor: 2000,
                        tipo: 'servico',
                        total: 2000
                    }
                ],
                valorTotal: 7000,
                observacoes: 'Nota fiscal referente ao orçamento ORC0003',
                status: 'emitida',
                createdAt: '2024-02-05T11:20:00.000Z',
                createdBy: 2
            }
        ];

        localStorage.setItem('notasFiscais', JSON.stringify(notasFiscais));
    }

    loadDemoTransactions() {
        const transactions = [
            {
                id: 1,
                date: '2024-01-15',
                type: 'entrada',
                description: 'Pagamento Festival Eletrônico 2024',
                amount: 11500,
                category: 'vendas',
                paymentMethod: 'transferencia',
                observations: 'Pagamento da NF0001',
                createdAt: '2024-01-15T15:00:00.000Z',
                createdBy: 2
            },
            {
                id: 2,
                date: '2024-01-20',
                type: 'saida',
                description: 'Compra de equipamentos de áudio',
                amount: 3500,
                category: 'equipamentos',
                paymentMethod: 'cartao_credito',
                observations: 'Interface de áudio e microfones',
                createdAt: '2024-01-20T09:30:00.000Z',
                createdBy: 1
            },
            {
                id: 3,
                date: '2024-01-25',
                type: 'entrada',
                description: 'Venda de música para comercial',
                amount: 2500,
                category: 'vendas',
                paymentMethod: 'pix',
                observations: 'Licenciamento de música para TV',
                createdAt: '2024-01-25T14:15:00.000Z',
                createdBy: 3
            },
            {
                id: 4,
                date: '2024-02-01',
                type: 'saida',
                description: 'Pagamento de impostos',
                amount: 1200,
                category: 'impostos',
                paymentMethod: 'boleto',
                observations: 'Impostos mensais',
                createdAt: '2024-02-01T10:00:00.000Z',
                createdBy: 1
            },
            {
                id: 5,
                date: '2024-02-05',
                type: 'entrada',
                description: 'Pagamento CineArt',
                amount: 7000,
                category: 'servicos',
                paymentMethod: 'transferencia',
                observations: 'Pagamento da NF0002',
                createdAt: '2024-02-05T16:30:00.000Z',
                createdBy: 2
            },
            {
                id: 6,
                date: '2024-02-10',
                type: 'reservado',
                description: 'Reserva para investimentos',
                amount: 5000,
                category: 'investimentos',
                paymentMethod: 'transferencia',
                observations: 'Reserva para novos equipamentos',
                createdAt: '2024-02-10T11:45:00.000Z',
                createdBy: 1
            },
            {
                id: 7,
                date: '2024-02-12',
                type: 'saida',
                description: 'Marketing digital',
                amount: 800,
                category: 'marketing',
                paymentMethod: 'cartao_credito',
                observations: 'Anúncios no Instagram e Facebook',
                createdAt: '2024-02-12T13:20:00.000Z',
                createdBy: 1
            },
            {
                id: 8,
                date: '2024-02-15',
                type: 'entrada',
                description: 'Workshop de produção musical',
                amount: 1800,
                category: 'servicos',
                paymentMethod: 'pix',
                observations: 'Workshop online com 20 participantes',
                createdAt: '2024-02-15T19:00:00.000Z',
                createdBy: 3
            }
        ];

        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Função para limpar dados de demonstração
    clearDemoData() {
        localStorage.removeItem('users');
        localStorage.removeItem('musics');
        localStorage.removeItem('orcamentos');
        localStorage.removeItem('notasFiscais');
        localStorage.removeItem('transactions');
        
        // Recarregar dados padrão
        this.loadDemoData();
        
        console.log('Dados de demonstração resetados!');
    }

    // Função para verificar se são dados de demonstração
    isDemoData() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.some(user => user.email === 'joao@ayane.com');
    }
}

// Initialize demo data
window.demoData = new DemoData(); 
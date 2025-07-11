// Sistema Ayane - Configurações
const CONFIG = {
    // Configurações gerais
    APP_NAME: 'Sistema Ayane',
    APP_VERSION: '1.0.0',
    COMPANY_NAME: 'Produtora Musical',
    
    // Configurações de autenticação
    AUTH: {
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
        MAX_LOGIN_ATTEMPTS: 5,
        BLOCK_DURATION: 15 * 60 * 1000, // 15 minutos
        PASSWORD_MIN_LENGTH: 6
    },
    
    // Configurações de upload
    UPLOAD: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_FILE_TYPES: ['mp3', 'wav', 'flac', 'aac'],
        MAX_FILES_PER_UPLOAD: 10
    },
    
    // Configurações financeiras
    FINANCE: {
        CURRENCY: 'BRL',
        DECIMAL_PLACES: 2,
        DEFAULT_CATEGORIES: [
            'vendas',
            'servicos',
            'investimentos',
            'despesas',
            'impostos',
            'salarios',
            'equipamentos',
            'marketing',
            'outros'
        ],
        PAYMENT_METHODS: [
            'dinheiro',
            'pix',
            'cartao_credito',
            'cartao_debito',
            'transferencia',
            'boleto',
            'cheque'
        ]
    },
    
    // Configurações de música
    MUSIC: {
        GENRES: [
            'house',
            'techno',
            'trance',
            'dubstep',
            'drum-bass',
            'edm',
            'pop',
            'rock',
            'outro'
        ],
        DEFAULT_BPM_RANGE: {
            min: 60,
            max: 200
        }
    },
    
    // Configurações de orçamentos
    ORCAMENTOS: {
        DEFAULT_VALIDITY_DAYS: 30,
        MAX_VALIDITY_DAYS: 365,
        STATUS_OPTIONS: [
            'pendente',
            'aprovado',
            'rejeitado',
            'cancelado'
        ]
    },
    
    // Configurações de notas fiscais
    NOTAS_FISCAIS: {
        TYPES: [
            'produto',
            'servico'
        ],
        STATUS_OPTIONS: [
            'emitida',
            'cancelada',
            'estornada'
        ]
    },
    
    // Configurações de usuários
    USERS: {
        ROLES: [
            'admin',
            'user'
        ],
        STATUS_OPTIONS: [
            'active',
            'pending',
            'inactive'
        ]
    },
    
    // Configurações de interface
    UI: {
        THEME: {
            PRIMARY_COLOR: '#667eea',
            SECONDARY_COLOR: '#764ba2',
            SUCCESS_COLOR: '#28a745',
            WARNING_COLOR: '#ffc107',
            DANGER_COLOR: '#dc3545',
            INFO_COLOR: '#17a2b8'
        },
        ANIMATIONS: {
            ENABLED: true,
            DURATION: 300
        },
        NOTIFICATIONS: {
            AUTO_HIDE: true,
            DURATION: 5000
        }
    },
    
    // Configurações de relatórios
    REPORTS: {
        DEFAULT_DATE_RANGE: 30, // dias
        MAX_EXPORT_RECORDS: 10000,
        CHART_COLORS: [
            '#667eea',
            '#764ba2',
            '#28a745',
            '#dc3545',
            '#ffc107',
            '#17a2b8'
        ]
    },
    
    // Configurações de backup
    BACKUP: {
        AUTO_BACKUP: true,
        BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
        MAX_BACKUP_FILES: 10
    },
    
    // Configurações de validação
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        CPF_REGEX: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        CNPJ_REGEX: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
        PHONE_REGEX: /^\(\d{2}\) \d{5}-\d{4}$/
    },
    
    // Mensagens do sistema
    MESSAGES: {
        SUCCESS: {
            LOGIN: 'Login realizado com sucesso!',
            LOGOUT: 'Logout realizado com sucesso!',
            USER_CREATED: 'Usuário criado com sucesso!',
            USER_UPDATED: 'Usuário atualizado com sucesso!',
            USER_DELETED: 'Usuário deletado com sucesso!',
            USER_APPROVED: 'Usuário aprovado com sucesso!',
            MUSIC_ADDED: 'Música adicionada com sucesso!',
            MUSIC_UPDATED: 'Música atualizada com sucesso!',
            MUSIC_DELETED: 'Música excluída com sucesso!',
            ORCAMENTO_CREATED: 'Orçamento criado com sucesso!',
            ORCAMENTO_UPDATED: 'Orçamento atualizado com sucesso!',
            ORCAMENTO_DELETED: 'Orçamento excluído com sucesso!',
            ORCAMENTO_APPROVED: 'Orçamento aprovado com sucesso!',
            NOTA_CREATED: 'Nota fiscal emitida com sucesso!',
            NOTA_UPDATED: 'Nota fiscal atualizada com sucesso!',
            NOTA_DELETED: 'Nota fiscal excluída com sucesso!',
            TRANSACTION_ADDED: 'Transação adicionada com sucesso!',
            TRANSACTION_UPDATED: 'Transação atualizada com sucesso!',
            TRANSACTION_DELETED: 'Transação excluída com sucesso!',
            DATA_EXPORTED: 'Dados exportados com sucesso!'
        },
        ERROR: {
            LOGIN_FAILED: 'Email ou senha incorretos',
            ACCESS_DENIED: 'Acesso negado',
            REQUIRED_FIELDS: 'Por favor, preencha todos os campos obrigatórios',
            INVALID_EMAIL: 'Email inválido',
            INVALID_PASSWORD: 'A senha deve ter pelo menos 6 caracteres',
            PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
            EMAIL_EXISTS: 'Este email já está cadastrado',
            USER_NOT_FOUND: 'Usuário não encontrado',
            MUSIC_NOT_FOUND: 'Música não encontrada',
            ORCAMENTO_NOT_FOUND: 'Orçamento não encontrado',
            NOTA_NOT_FOUND: 'Nota fiscal não encontrada',
            TRANSACTION_NOT_FOUND: 'Transação não encontrada',
            INVALID_URL: 'Link inválido',
            FILE_TOO_LARGE: 'Arquivo muito grande',
            INVALID_FILE_TYPE: 'Tipo de arquivo não permitido',
            NETWORK_ERROR: 'Erro de conexão',
            UNKNOWN_ERROR: 'Erro desconhecido'
        },
        WARNING: {
            CONFIRM_DELETE: 'Esta ação não pode ser desfeita. Confirmar exclusão?',
            SESSION_EXPIRING: 'Sua sessão expirará em breve',
            UNSAVED_CHANGES: 'Você tem alterações não salvas'
        },
        INFO: {
            FEATURE_COMING_SOON: 'Funcionalidade será implementada em breve',
            NO_DATA: 'Nenhum dado encontrado',
            LOADING: 'Carregando...',
            SAVING: 'Salvando...',
            EXPORTING: 'Exportando...'
        }
    },
    
    // Configurações de desenvolvimento
    DEV: {
        DEBUG_MODE: false,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        MOCK_DATA: false
    }
};

// Função para obter configuração
function getConfig(path) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    
    return value;
}

// Função para definir configuração
function setConfig(path, value) {
    const keys = path.split('.');
    let current = CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
}

// Função para validar configuração
function validateConfig() {
    const required = [
        'APP_NAME',
        'AUTH.SESSION_TIMEOUT',
        'FINANCE.CURRENCY',
        'UI.THEME.PRIMARY_COLOR'
    ];
    
    const missing = [];
    
    for (const path of required) {
        if (getConfig(path) === undefined) {
            missing.push(path);
        }
    }
    
    if (missing.length > 0) {
        console.error('Configuração inválida. Campos obrigatórios ausentes:', missing);
        return false;
    }
    
    return true;
}

// Função para carregar configuração personalizada
function loadCustomConfig() {
    const customConfig = localStorage.getItem('ayane_custom_config');
    if (customConfig) {
        try {
            const parsed = JSON.parse(customConfig);
            Object.assign(CONFIG, parsed);
        } catch (error) {
            console.error('Erro ao carregar configuração personalizada:', error);
        }
    }
}

// Função para salvar configuração personalizada
function saveCustomConfig(config) {
    try {
        localStorage.setItem('ayane_custom_config', JSON.stringify(config));
        Object.assign(CONFIG, config);
        return true;
    } catch (error) {
        console.error('Erro ao salvar configuração personalizada:', error);
        return false;
    }
}

// Função para resetar configuração
function resetConfig() {
    localStorage.removeItem('ayane_custom_config');
    location.reload();
}

// Carregar configuração personalizada ao inicializar
loadCustomConfig();

// Validar configuração
if (!validateConfig()) {
    console.error('Configuração do sistema inválida');
}

// Exportar para uso global
window.CONFIG = CONFIG;
window.getConfig = getConfig;
window.setConfig = setConfig;
window.saveCustomConfig = saveCustomConfig;
window.resetConfig = resetConfig; 
// Modal Controller
class ModalController {
    constructor() {
        this.currentModal = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close modal when clicking overlay
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modalOverlay')) {
                this.close();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.close();
            }
        });
    }

    show(content) {
        const modal = document.getElementById('modal');
        const overlay = document.getElementById('modalOverlay');
        
        modal.innerHTML = content;
        overlay.classList.add('active');
        this.currentModal = modal;
        
        // Focus first input if exists
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);

        // Add animation class
        modal.classList.add('modal-show');
    }

    close() {
        const overlay = document.getElementById('modalOverlay');
        const modal = document.getElementById('modal');
        
        // Add closing animation
        modal.classList.add('modal-hide');
        
        setTimeout(() => {
            overlay.classList.remove('active');
            modal.classList.remove('modal-show', 'modal-hide');
            modal.innerHTML = '';
            this.currentModal = null;
        }, 200);
    }

    // Utility methods for common modal operations
    showConfirmation(title, message, onConfirm, onCancel) {
        const modalContent = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Cancelar</button>
                <button class="btn-primary" onclick="modalController.executeConfirm()">Confirmar</button>
            </div>
        `;

        this.show(modalContent);
        
        // Store callbacks
        this.confirmCallback = onConfirm;
        this.cancelCallback = onCancel;
    }

    executeConfirm() {
        if (this.confirmCallback) {
            this.confirmCallback();
        }
        this.close();
    }

    showAlert(title, message, type = 'info') {
        const iconClass = {
            'info': 'fa-info-circle',
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'error': 'fa-times-circle'
        }[type] || 'fa-info-circle';

        const modalContent = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="alert alert-${type}">
                    <i class="fas ${iconClass}"></i>
                    <p>${message}</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="modalController.close()">OK</button>
            </div>
        `;

        this.show(modalContent);
    }

    showLoading(title = 'Carregando...', message = 'Aguarde enquanto processamos sua solicitação.') {
        const modalContent = `
            <div class="modal-header">
                <h3>${title}</h3>
            </div>
            <div class="modal-body">
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>${message}</p>
                </div>
            </div>
        `;

        this.show(modalContent);
    }

    hideLoading() {
        this.close();
    }

    // Form validation helper
    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.highlightError(input, 'Este campo é obrigatório');
                isValid = false;
            } else {
                this.clearError(input);
            }
        });

        return isValid;
    }

    highlightError(input, message) {
        input.classList.add('error');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    clearError(input) {
        input.classList.remove('error');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Auto-resize textarea
    setupAutoResize() {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        });
    }

    // File upload helper
    setupFileUpload(inputId, allowedTypes = [], maxSize = 5 * 1024 * 1024) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Check file type
            if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
                this.showAlert('Erro', 'Tipo de arquivo não permitido', 'error');
                input.value = '';
                return;
            }

            // Check file size
            if (file.size > maxSize) {
                this.showAlert('Erro', 'Arquivo muito grande', 'error');
                input.value = '';
                return;
            }
        });
    }

    // Date picker helper
    setupDatePicker(inputId, minDate = null, maxDate = null) {
        const input = document.getElementById(inputId);
        if (!input) return;

        if (minDate) {
            input.min = minDate;
        }
        if (maxDate) {
            input.max = maxDate;
        }

        // Set default to today if no value
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    }

    // Currency input helper
    setupCurrencyInput(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = (parseFloat(value) / 100).toFixed(2);
            e.target.value = value;
        });
    }

    // Phone input helper
    setupPhoneInput(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
            
            e.target.value = value;
        });
    }

    // CPF/CNPJ input helper
    setupCPFCNPJInput(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                // CPF format
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length <= 14) {
                // CNPJ format
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            }
            
            e.target.value = value;
        });
    }

    // Search input helper
    setupSearchInput(inputId, onSearch, delay = 300) {
        const input = document.getElementById(inputId);
        if (!input) return;

        let timeout;
        input.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                onSearch(e.target.value);
            }, delay);
        });
    }

    // Select with search helper
    setupSelectWithSearch(selectId, options = []) {
        const select = document.getElementById(selectId);
        if (!select) return;

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Digite para buscar...';
        searchInput.className = 'select-search-input';
        
        // Insert search input before select
        select.parentNode.insertBefore(searchInput, select);
        
        // Filter options based on search
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const options = select.querySelectorAll('option');
            
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            });
        });
    }

    // Multi-step form helper
    createMultiStepForm(steps = []) {
        let currentStep = 0;
        
        const showStep = (stepIndex) => {
            steps.forEach((step, index) => {
                if (index === stepIndex) {
                    step.style.display = 'block';
                } else {
                    step.style.display = 'none';
                }
            });
        };

        const nextStep = () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        };

        const prevStep = () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        };

        return { showStep, nextStep, prevStep, currentStep };
    }

    // Progress bar helper
    createProgressBar(containerId, totalSteps) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill"></div>
            <div class="progress-text">0%</div>
        `;
        
        container.appendChild(progressBar);

        const updateProgress = (currentStep) => {
            const percentage = (currentStep / totalSteps) * 100;
            const fill = progressBar.querySelector('.progress-fill');
            const text = progressBar.querySelector('.progress-text');
            
            fill.style.width = percentage + '%';
            text.textContent = Math.round(percentage) + '%';
        };

        return { updateProgress };
    }
}

// Initialize modal controller
window.modalController = new ModalController(); 
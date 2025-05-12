/**
 * Implementação do Padrão Singleton
 * 
 * O Singleton é um padrão criacional que garante que uma classe tenha apenas uma instância
 * e fornece um ponto de acesso global a ela.
 */
class ConfigManager {
    constructor() {
        // Verificar se a instância já existe
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }
        
        // Configurações padrão
        this.config = {
            darkMode: false,
            notificationSound: true,
            autoSave: true,
            language: 'pt-BR',
            dateFormat: 'DD/MM/YYYY'
        };
        
        // Armazenar a instância
        ConfigManager.instance = this;
    }
    
    // Obter uma configuração
    getConfig(key) {
        return this.config[key];
    }
    
    // Definir uma configuração
    setConfig(key, value) {
        this.config[key] = value;
        
        // Salvar no localStorage
        this.saveToLocalStorage();
        
        // Disparar evento para atualizar a UI
        document.dispatchEvent(new CustomEvent('config-changed', { 
            detail: { key, value } 
        }));
        
        return this;
    }
    
    // Obter todas as configurações
    getAllConfig() {
        return { ...this.config };
    }
    
    // Salvar configurações no localStorage
    saveToLocalStorage() {
        localStorage.setItem('taskManagerConfig', JSON.stringify(this.config));
    }
    
    // Carregar configurações do localStorage
    loadFromLocalStorage() {
        const savedConfig = localStorage.getItem('taskManagerConfig');
        if (savedConfig) {
            this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }
        return this;
    }
    
    // Aplicar configurações visuais
    applyVisualConfig() {
        // Aplicar modo escuro, se ativado
        if (this.config.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Outros ajustes visuais conforme configurações
        document.documentElement.setAttribute('data-language', this.config.language);
        
        return this;
    }
}

// Exportar uma única instância
const configManager = new ConfigManager().loadFromLocalStorage().applyVisualConfig(); 
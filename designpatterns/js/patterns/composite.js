/**
 * Implementação do Padrão Composite
 * 
 * O Composite é um padrão estrutural que permite compor objetos em estruturas
 * de árvore para representar hierarquias parte-todo. O Composite permite aos
 * clientes tratarem objetos individuais e composições de objetos uniformemente.
 */

/**
 * Interface comum para todas as tarefas (componentes simples e compostos)
 */
class TaskComponent {
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = 'pendente';
        this.createdAt = new Date();
    }
    
    getId() { return this.id; }
    getTitle() { return this.title; }
    getDescription() { return this.description; }
    getStatus() { return this.status; }
    setStatus(status) { this.status = status; }
    getCreatedAt() { return this.createdAt; }
    
    // Métodos que serão implementados de forma diferente pelos componentes
    addTask(task) { throw new Error("Método não implementado"); }
    removeTask(taskId) { throw new Error("Método não implementado"); }
    getChildTasks() { throw new Error("Método não implementado"); }
    getTaskCount() { throw new Error("Método não implementado"); }
    
    // Método para verificar se é uma tarefa composta
    isComposite() { return false; }
    
    // Métodos para UI e representação
    getType() { return 'Tarefa Genérica'; }
    getHtmlRepresentation() { throw new Error("Método não implementado"); }
}

/**
 * Classe para uma tarefa individual (folha na estrutura Composite)
 */
class SingleTask extends TaskComponent {
    constructor(id, title, description, type = 'generic') {
        super(id, title, description);
        this.type = type;
    }
    
    getType() {
        switch(this.type) {
            case 'personal': return 'Pessoal';
            case 'work': return 'Trabalho';
            case 'study': return 'Estudo';
            case 'project': return 'Projeto';
            default: return 'Tarefa Genérica';
        }
    }
    
    // Implementações vazias para manter a interface comum
    getTaskCount() { return 1; }
    
    getHtmlRepresentation() {
        let taskClass = 'list-group-item task-item';
        switch(this.type) {
            case 'personal': taskClass += ' task-personal'; break;
            case 'work': taskClass += ' task-work'; break;
            case 'study': taskClass += ' task-study'; break;
            case 'project': taskClass += ' task-project'; break;
        }
        
        return `
            <div class="${taskClass}" id="task-${this.id}">
                <h5 class="mb-1">${this.getTitle()}</h5>
                <p class="mb-1">${this.getDescription()}</p>
                <small>Criada em: ${this.createdAt.toLocaleString()}</small>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <span class="badge bg-secondary">${this.getType()}</span>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary status-btn" data-task-id="${this.id}" data-status="em_andamento">Em Andamento</button>
                        <button class="btn btn-sm btn-outline-success status-btn" data-task-id="${this.id}" data-status="concluida">Concluída</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-task-id="${this.id}">Excluir</button>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Classe para uma tarefa composta (contém subtarefas)
 */
class CompositeTask extends TaskComponent {
    constructor(id, title, description) {
        super(id, title, description);
        this.children = [];
        this.expanded = false;
    }
    
    // Sobrescrever para retornar true para tarefas compostas
    isComposite() { return true; }
    
    // Implementação dos métodos específicos de composite
    addTask(task) {
        this.children.push(task);
        return this;
    }
    
    removeTask(taskId) {
        this.children = this.children.filter(task => task.getId() !== taskId);
        return this;
    }
    
    getChildTasks() {
        return [...this.children];
    }
    
    // Contar todas as tarefas, incluindo subtarefas aninhadas
    getTaskCount() {
        return this.children.reduce((total, task) => total + task.getTaskCount(), 0);
    }
    
    // Atualizar status propaga para todas as tarefas filhas
    setStatus(status) {
        this.status = status;
        this.children.forEach(task => task.setStatus(status));
    }
    
    getType() {
        return 'Grupo de Tarefas';
    }
    
    toggleExpanded() {
        this.expanded = !this.expanded;
    }
    
    getHtmlRepresentation() {
        const childCount = this.getTaskCount();
        const expandIcon = this.expanded ? '▼' : '►';
        
        let html = `
            <div class="list-group-item task-item task-group" id="task-${this.id}">
                <div class="d-flex justify-content-between">
                    <h5 class="mb-1">
                        <button class="btn btn-sm btn-outline-secondary expand-btn me-2" data-task-id="${this.id}">
                            ${expandIcon}
                        </button>
                        ${this.getTitle()} <span class="badge bg-info">${childCount} subtarefa${childCount !== 1 ? 's' : ''}</span>
                    </h5>
                </div>
                <p class="mb-1">${this.getDescription()}</p>
                <small>Criada em: ${this.createdAt.toLocaleString()}</small>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <span class="badge bg-secondary">${this.getType()}</span>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary status-btn" data-task-id="${this.id}" data-status="em_andamento">Em Andamento (Todas)</button>
                        <button class="btn btn-sm btn-outline-success status-btn" data-task-id="${this.id}" data-status="concluida">Concluir Todas</button>
                        <button class="btn btn-sm btn-outline-info add-subtask-btn" data-task-id="${this.id}">Adicionar Subtarefa</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-task-id="${this.id}">Excluir Grupo</button>
                    </div>
                </div>`;
        
        // Renderizar subtarefas se estiver expandido
        if (this.expanded && this.children.length > 0) {
            html += `<div class="subtasks-container mt-3 ms-4">`;
            this.children.forEach(task => {
                html += task.getHtmlRepresentation();
            });
            html += `</div>`;
        }
        
        html += `</div>`;
        return html;
    }
} 
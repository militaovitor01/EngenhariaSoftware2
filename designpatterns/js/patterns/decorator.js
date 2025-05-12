/**
 * Implementação do Padrão Decorator
 * 
 * O Decorator é um padrão estrutural que permite adicionar novos comportamentos
 * a objetos dinamicamente, envolvendo-os em objetos "wrapper" especiais.
 */

/**
 * Classe base para os decoradores de tarefa
 */
class TaskDecorator {
    constructor(task) {
        this.task = task;
    }
    
    getId() {
        return this.task.getId();
    }
    
    getTitle() {
        return this.task.getTitle();
    }
    
    getDescription() {
        return this.task.getDescription();
    }
    
    getStatus() {
        return this.task.getStatus();
    }
    
    setStatus(status) {
        this.task.setStatus(status);
    }
    
    getType() {
        return this.task.getType();
    }
    
    getCreatedAt() {
        return this.task.getCreatedAt();
    }
    
    getHtmlRepresentation() {
        return this.task.getHtmlRepresentation();
    }
}

/**
 * Decorador para adicionar alta prioridade a uma tarefa
 */
class HighPriorityDecorator extends TaskDecorator {
    getTitle() {
        return `⭐ ${this.task.getTitle()}`;
    }
    
    getHtmlRepresentation() {
        let html = this.task.getHtmlRepresentation();
        html = html.replace('list-group-item task-item', 'list-group-item task-item high-priority-task');
        // Adicionando badge de prioridade alta
        html = html.replace('<span class="badge', '<span class="badge bg-danger me-2">PRIORITÁRIO</span><span class="badge');
        return html;
    }
}

/**
 * Decorador para adicionar uma etiqueta colorida a uma tarefa
 */
class ColorLabelDecorator extends TaskDecorator {
    constructor(task, color) {
        super(task);
        this.color = color;
    }
    
    getHtmlRepresentation() {
        let html = this.task.getHtmlRepresentation();
        // Adicionando etiqueta colorida
        html = html.replace('<span class="badge', `<span class="badge label-${this.color} me-2">${this.getColorName()}</span><span class="badge`);
        return html;
    }
    
    getColorName() {
        switch(this.color) {
            case 'red': return 'Urgente';
            case 'green': return 'Fácil';
            case 'blue': return 'Em progresso';
            case 'yellow': return 'Atenção';
            default: return this.color;
        }
    }
}

/**
 * Decorador para adicionar data de vencimento a uma tarefa
 */
class DueDateDecorator extends TaskDecorator {
    constructor(task, dueDate) {
        super(task);
        this.dueDate = new Date(dueDate);
    }
    
    getHtmlRepresentation() {
        let html = this.task.getHtmlRepresentation();
        // Formatar a data no formato local
        const formattedDate = this.dueDate.toLocaleDateString();
        
        // Adicionar a data de vencimento após a data de criação
        html = html.replace(
            `Criada em: ${this.task.getCreatedAt().toLocaleString()}`,
            `Criada em: ${this.task.getCreatedAt().toLocaleString()} | <strong class="due-date">Vencimento: ${formattedDate}</strong>`
        );
        return html;
    }
}

/**
 * Decorador para adicionar lembretes a uma tarefa
 */
class ReminderDecorator extends TaskDecorator {
    constructor(task, reminderDate) {
        super(task);
        this.reminderDate = new Date(reminderDate);
    }
    
    getHtmlRepresentation() {
        let html = this.task.getHtmlRepresentation();
        // Formatar a data no formato local
        const formattedDate = this.reminderDate.toLocaleDateString();
        
        // Adicionar ícone de lembrete e a data
        html = html.replace(
            '<h5 class="mb-1">',
            `<h5 class="mb-1">🔔 `
        );
        
        // Adicionar a informação do lembrete após o título
        html = html.replace(
            '</h5>',
            ` <small class="reminder-badge">(Lembrete: ${formattedDate})</small></h5>`
        );
        
        return html;
    }
}
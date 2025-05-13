/**
 * Classe base para todas as tarefas
 */
class Task {
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = 'pendente'; // pendente, em_andamento, concluída
        this.createdAt = new Date();
    }
    
    getId() {
        return this.id;
    }
    
    getTitle() {
        return this.title;
    }
    
    getDescription() {
        return this.description;
    }
    
    getStatus() {
        return this.status;
    }
    
    setStatus(status) {
        this.status = status;
    }
    
    getType() {
        return 'Tarefa Genérica';
    }
    
    getCreatedAt() {
        return this.createdAt;
    }
    
    // Método para obter representação visual da tarefa (usado na UI)
    getHtmlRepresentation() {
        return `
            <div class="list-group-item task-item" id="task-${this.id}">
                <h5 class="mb-1">${this.getTitle()}</h5>
                <p class="mb-1">${this.getDescription()}</p>
                <small>Criada em: ${this.createdAt.toLocaleString()}</small>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <span class="badge bg-secondary">${this.getType()}</span>
                    <span class="badge ${this.status === 'pendente' ? 'bg-warning' : this.status === 'em_andamento' ? 'bg-info' : 'bg-success'}">
                        ${this.status === 'pendente' ? 'Pendente' : this.status === 'em_andamento' ? 'Em Andamento' : 'Concluída'}
                    </span>
                </div>
            </div>
        `;
    }
}

/**
 * Classe para tarefas pessoais
 */
class PersonalTask extends Task {
    getType() {
        return 'Pessoal';
    }
    
    getHtmlRepresentation() {
        const baseHtml = super.getHtmlRepresentation();
        return baseHtml.replace('list-group-item task-item', 'list-group-item task-item task-personal');
    }
}

/**
 * Classe para tarefas de trabalho
 */
class WorkTask extends Task {
    getType() {
        return 'Trabalho';
    }
    
    getHtmlRepresentation() {
        const baseHtml = super.getHtmlRepresentation();
        return baseHtml.replace('list-group-item task-item', 'list-group-item task-item task-work');
    }
}

/**
 * Classe para tarefas de estudo
 */
class StudyTask extends Task {
    getType() {
        return 'Estudo';
    }
    
    getHtmlRepresentation() {
        const baseHtml = super.getHtmlRepresentation();
        return baseHtml.replace('list-group-item task-item', 'list-group-item task-item task-study');
    }
}

/**
 * Classe para tarefas de projeto
 */
class ProjectTask extends Task {
    getType() {
        return 'Projeto';
    }
    
    getHtmlRepresentation() {
        const baseHtml = super.getHtmlRepresentation();
        return baseHtml.replace('list-group-item task-item', 'list-group-item task-item task-project');
    }
}

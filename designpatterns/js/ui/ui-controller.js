/**
 * Controlador da interface do usuário
 * Gerencia as interações entre os padrões e a interface
 */
class UIController {
    constructor() {
        this.tasks = [];
        this.taskFactory = new TaskFactory();
        this.taskSubject = new TaskSubject();
        this.notifications = [];
        
        // Novos componentes
        this.configManager = configManager; // Singleton
        this.commandManager = new CommandManager(); // Command
        
        // Inicializar observadores
        this.initObservers();
        
        // Configurar manipuladores de eventos
        this.setupEventListeners();
        
        // Carregar configurações
        this.loadConfigSettings();
    }
    
    // Inicializar os observadores com base nas configurações do usuário
    initObservers() {
        // Adicionar observadores iniciais com base nas caixas de seleção
        if (document.getElementById('screen-observer').checked) {
            this.taskSubject.addObserver(new ScreenObserver(this.addNotification.bind(this)));
        }
        
        if (document.getElementById('email-observer').checked) {
            this.taskSubject.addObserver(new EmailObserver(this.addNotification.bind(this)));
        }
        
        if (document.getElementById('log-observer').checked) {
            this.taskSubject.addObserver(new LogObserver(this.addNotification.bind(this)));
        }
        
        // Add new Push observer
        if (document.getElementById('push-observer').checked) {
            this.taskSubject.addObserver(new PushObserver(this.addNotification.bind(this)));
        }
    }
    
    // Configurar manipuladores de eventos para a interface do usuário
    setupEventListeners() {
        // Manipular envio do formulário de tarefa
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });
        
        // Delegação de eventos para expandir/colapsar grupos de tarefas
        document.getElementById('tasks-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('expand-btn')) {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                const task = this.findTaskById(taskId);
                if (task && task.isComposite()) {
                    task.toggleExpanded();
                    this.renderTasks();
                }
            }
            
            if (e.target.classList.contains('add-subtask-btn')) {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                document.getElementById('parent-task-id').value = taskId;
                new bootstrap.Modal(document.getElementById('add-subtask-modal')).show();
            }
        });
        
        // Manipular aplicação de decoradores
        document.getElementById('apply-decorators').addEventListener('click', () => {
            this.applyDecorators();
        });
        
        // Manipular botões de status na seção de recursos
        document.getElementById('task-status-progress').addEventListener('click', () => {
            const selectElement = document.getElementById('decorate-task-select');
            const taskId = parseInt(selectElement.value);
            if (taskId) {
                this.updateTaskStatus(taskId, 'em_andamento');
            } else {
                alert('Por favor, selecione uma tarefa primeiro.');
            }
        });
        
        document.getElementById('task-status-completed').addEventListener('click', () => {
            const selectElement = document.getElementById('decorate-task-select');
            const taskId = parseInt(selectElement.value);
            if (taskId) {
                this.updateTaskStatus(taskId, 'concluida');
            } else {
                alert('Por favor, selecione uma tarefa primeiro.');
            }
        });
        
        document.getElementById('task-delete').addEventListener('click', () => {
            const selectElement = document.getElementById('decorate-task-select');
            const taskId = parseInt(selectElement.value);
            if (taskId) {
                if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                    this.deleteTask(taskId);
                }
            } else {
                alert('Por favor, selecione uma tarefa primeiro.');
            }
        });
        
        // Atualizar observadores quando as caixas de seleção forem alteradas
        document.getElementById('screen-observer').addEventListener('change', this.updateObservers.bind(this));
        document.getElementById('email-observer').addEventListener('change', this.updateObservers.bind(this));
        document.getElementById('log-observer').addEventListener('change', this.updateObservers.bind(this));
        document.getElementById('push-observer').addEventListener('change', this.updateObservers.bind(this));
        
        // Eventos para o ConfigManager (Singleton)
        document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
            this.updateConfig('darkMode', e.target.checked);
        });
        
        document.getElementById('notification-sound-toggle').addEventListener('change', (e) => {
            this.updateConfig('notificationSound', e.target.checked);
        });
        
        document.getElementById('auto-save-toggle').addEventListener('change', (e) => {
            this.updateConfig('autoSave', e.target.checked);
        });
        
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.updateConfig('language', e.target.value);
        });
        
        // Eventos para grupos de tarefas (Composite)
        document.getElementById('group-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTaskGroup();
        });
        
        document.getElementById('subtask-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const parentId = parseInt(document.getElementById('parent-task-id').value);
            this.addSubtask(parentId);
        });
        
        // Eventos para Command (Undo/Redo)
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undo();
        });
        
        document.getElementById('redo-btn').addEventListener('click', () => {
            this.redo();
        });
    }
    
    // Criar uma nova tarefa usando o Factory Method
    createTask() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const taskType = document.getElementById('task-type').value;
        
        if (!title) {
            alert('Por favor, insira um título para a tarefa.');
            return;
        }
        
        // Usar o Factory Method para criar a tarefa
        const task = this.taskFactory.createTask(taskType, title, description);
        this.tasks.push(task);
        
        // Atualizar a interface
        this.renderTasks();
        
        // Limpar o formulário
        document.getElementById('task-form').reset();
    }
    
    // Atualizar o status de uma tarefa e notificar os observadores
    updateTaskStatus(taskId, status) {
        const task = this.findTaskById(taskId);
        if (task) {
            task.setStatus(status);
            
            // Notificar observadores sobre a mudança de status
            this.taskSubject.notifyObservers(task, status);
            
            // Atualizar a interface
            this.renderTasks();
        }
    }
    
    // Excluir uma tarefa
    deleteTask(taskId) {
        const index = this.tasks.findIndex(task => task.getId() === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.renderTasks();
        }
    }
    
    // Aplicar decoradores à tarefa selecionada
    applyDecorators() {
        const selectElement = document.getElementById('decorate-task-select');
        const taskId = parseInt(selectElement.value);
        
        if (!taskId) {
            alert('Por favor, selecione uma tarefa para aplicar os decoradores.');
            return;
        }
        
        // Encontrar a tarefa pelo ID
        let task = this.findTaskById(taskId);
        if (!task) return;
        
        // Armazenar o taskId para uso posterior
        const originalTaskId = task.getId();
        
        // Verificar se a tarefa já é um decorador
        // Se for, precisamos encontrar a tarefa original dentro de todos os decoradores aninhados
        let originalTask = task;
        while (originalTask instanceof TaskDecorator) {
            originalTask = originalTask.task;
        }
        
        // Começar com a tarefa original para aplicar os novos decoradores
        task = originalTask;
        
        // Aplicar decorador de alta prioridade, se selecionado
        if (document.getElementById('high-priority').checked) {
            task = new HighPriorityDecorator(task);
        }
        
        // Aplicar decorador de etiqueta colorida, se selecionado
        if (document.getElementById('color-label').checked) {
            const color = document.getElementById('color-select').value;
            task = new ColorLabelDecorator(task, color);
        }
        
        // Aplicar decorador de data de vencimento, se selecionado
        if (document.getElementById('due-date').checked) {
            const dueDate = document.getElementById('due-date-input').value;
            if (dueDate) {
                task = new DueDateDecorator(task, dueDate);
            }
        }
        
        // Aplicar decorador de lembrete, se selecionado
        if (document.getElementById('reminder-decorator').checked) {
            const reminderDate = document.getElementById('reminder-date-input').value;
            if (reminderDate) {
                task = new ReminderDecorator(task, reminderDate);
            }
        }
        
        // Atualizar a tarefa na lista
        const index = this.tasks.findIndex(t => t.getId() === originalTaskId);
        if (index !== -1) {
            this.tasks[index] = task;
            this.renderTasks();
        }
    }
    
    // Atualizar os observadores com base nas caixas de seleção
    updateObservers() {
        // Limpar todos os observadores
        this.taskSubject = new TaskSubject();
        
        // Reconstruir a lista de observadores com base nas caixas de seleção
        this.initObservers();
    }
    
    // Adicionar uma notificação à lista
    addNotification(notification) {
        this.notifications.push(notification);
        this.renderNotifications();
    }
    
    // Renderizar a lista de tarefas na interface do usuário
    renderTasks() {
        const container = document.getElementById('tasks-container');
        
        if (this.tasks.length === 0) {
            container.innerHTML = `
                <div class="list-group-item text-center text-muted">
                    Nenhuma tarefa criada ainda
                </div>
            `;
            document.getElementById('decorate-task-select').innerHTML = `
                <option value="">Selecione uma tarefa...</option>
            `;
            return;
        }
        
        container.innerHTML = '';
        let selectOptions = '<option value="">Selecione uma tarefa...</option>';
        
        this.tasks.forEach(task => {
            container.innerHTML += task.getHtmlRepresentation();
            selectOptions += `<option value="${task.getId()}">${task.getTitle()}</option>`;
        });
        
        // Atualizar o select de decoração
        document.getElementById('decorate-task-select').innerHTML = selectOptions;
        
        // Atualizar botões undo/redo
        this.updateUndoRedoButtons();
    }
    
    // Renderizar notificações na interface do usuário
    renderNotifications() {
        const container = document.getElementById('notifications-container');
        
        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="list-group-item text-center text-muted">
                    Nenhuma notificação ainda
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        // Mostrar as notificações mais recentes primeiro (limite de 10)
        const recentNotifications = [...this.notifications]
            .reverse()
            .slice(0, 10);
            
        recentNotifications.forEach(notification => {
            container.innerHTML += notification.getHtmlRepresentation();
        });
    }
    
    // Encontrar uma tarefa pelo ID
    findTaskById(id) {
        return this.tasks.find(task => task.getId() === id);
    }
    
    // Novos métodos para o Singleton (ConfigManager)
    loadConfigSettings() {
        // Carregar e aplicar configurações do Singleton
        const config = this.configManager.getAllConfig();
        
        // Aplicar configurações na UI
        document.getElementById('dark-mode-toggle').checked = config.darkMode;
        document.getElementById('notification-sound-toggle').checked = config.notificationSound;
        document.getElementById('auto-save-toggle').checked = config.autoSave;
        document.getElementById('language-select').value = config.language;
    }
    
    updateConfig(key, value) {
        this.configManager.setConfig(key, value);
    }
    
    // Métodos para o Composite Pattern
    createTaskGroup() {
        const title = document.getElementById('group-title').value;
        const description = document.getElementById('group-description').value;
        
        if (!title) {
            alert('Por favor, insira um título para o grupo de tarefas.');
            return;
        }
        
        const id = ++TaskFactory.lastId;
        const taskGroup = new CompositeTask(id, title, description);
        
        // Usar padrão Command
        const command = new AddTaskCommand(this, taskGroup);
        this.commandManager.executeCommand(command);
        
        // Atualizar a interface
        this.renderTasks();
        document.getElementById('group-form').reset();
    }
    
    addSubtask(parentId) {
        const parentTask = this.findTaskById(parentId);
        if (!parentTask || !parentTask.isComposite()) {
            alert('Grupo de tarefas não encontrado.');
            return;
        }
        
        const title = document.getElementById('subtask-title').value;
        const description = document.getElementById('subtask-description').value;
        const taskType = document.getElementById('subtask-type').value;
        
        if (!title) {
            alert('Por favor, insira um título para a subtarefa.');
            return;
        }
        
        const id = ++TaskFactory.lastId;
        const subtask = new SingleTask(id, title, description, taskType);
        
        // Adicionar ao grupo
        parentTask.addTask(subtask);
        
        // Atualizar a interface
        this.renderTasks();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('add-subtask-modal'));
        if (modal) modal.hide();
    }
    
    // Métodos atualizados para trabalhar com o padrão Command
    createTask() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const taskType = document.getElementById('task-type').value;
        
        if (!title) {
            alert('Por favor, insira um título para a tarefa.');
            return;
        }
        
        // Criar a tarefa usando Factory
        const task = this.taskFactory.createTask(taskType, title, description);
        
        // Usar Command pattern para adicionar a tarefa
        const command = new AddTaskCommand(this, task);
        this.commandManager.executeCommand(command);
        
        // Atualizar a interface
        this.renderTasks();
        
        // Limpar o formulário
        document.getElementById('task-form').reset();
    }
    
    updateTaskStatus(taskId, status) {
        // Criar comando para a mudança de status
        const command = new ChangeTaskStatusCommand(this, taskId, status);
        this.commandManager.executeCommand(command);
        
        // Atualizar a interface
        this.renderTasks();
    }
    
    deleteTask(taskId) {
        // Usar Command pattern para remover a tarefa
        const command = new RemoveTaskCommand(this, taskId);
        this.commandManager.executeCommand(command);
        
        // Atualizar a interface
        this.renderTasks();
    }
    
    // Métodos auxiliares para o Command pattern
    addTaskDirectly(task) {
        this.tasks.push(task);
    }
    
    removeTaskById(taskId) {
        const index = this.tasks.findIndex(task => task.getId() === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
    }
    
    notifyTaskStatusChange(task, status) {
        this.taskSubject.notifyObservers(task, status);
    }
    
    // Métodos para desfazer/refazer
    undo() {
        if (this.commandManager.undo()) {
            this.renderTasks();
            this.updateUndoRedoButtons();
        }
    }
    
    redo() {
        if (this.commandManager.redo()) {
            this.renderTasks();
            this.updateUndoRedoButtons();
        }
    }
    
    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        
        if (undoBtn) {
            undoBtn.disabled = !this.commandManager.canUndo();
        }
        
        if (redoBtn) {
            redoBtn.disabled = !this.commandManager.canRedo();
        }
    }
}
/**
 * Implementação do Padrão Command
 * 
 * O Command é um padrão comportamental que transforma uma solicitação em um objeto 
 * autônomo que contém todas as informações sobre a solicitação. Essa transformação
 * permite parametrizar métodos com diferentes solicitações, atrasar ou enfileirar a 
 * execução de uma solicitação e suportar operações que podem ser desfeitas.
 */

/**
 * Interface para todos os comandos
 */
class Command {
    execute() { throw new Error("Método não implementado"); }
    undo() { throw new Error("Método não implementado"); }
    getDescription() { throw new Error("Método não implementado"); }
}

/**
 * Comando para adicionar uma tarefa
 */
class AddTaskCommand extends Command {
    constructor(taskManager, task) {
        super();
        this.taskManager = taskManager;
        this.task = task;
        this.taskId = task.getId();
    }
    
    execute() {
        this.taskManager.addTaskDirectly(this.task);
        return true;
    }
    
    undo() {
        this.taskManager.removeTaskById(this.taskId);
        return true;
    }
    
    getDescription() {
        return `Adicionar tarefa: "${this.task.getTitle()}"`;
    }
}

/**
 * Comando para remover uma tarefa
 */
class RemoveTaskCommand extends Command {
    constructor(taskManager, taskId) {
        super();
        this.taskManager = taskManager;
        this.taskId = taskId;
        this.removedTask = null; // Armazenar para poder desfazer
    }
    
    execute() {
        // Armazenar a tarefa antes de removê-la
        this.removedTask = this.taskManager.findTaskById(this.taskId);
        if (!this.removedTask) {
            return false;
        }
        
        this.taskManager.removeTaskById(this.taskId);
        return true;
    }
    
    undo() {
        if (this.removedTask) {
            this.taskManager.addTaskDirectly(this.removedTask);
            return true;
        }
        return false;
    }
    
    getDescription() {
        return `Remover tarefa: "${this.removedTask ? this.removedTask.getTitle() : 'Desconhecida'}"`;
    }
}

/**
 * Comando para mudar o status de uma tarefa
 */
class ChangeTaskStatusCommand extends Command {
    constructor(taskManager, taskId, newStatus) {
        super();
        this.taskManager = taskManager;
        this.taskId = taskId;
        this.newStatus = newStatus;
        this.oldStatus = null; // Armazenar para poder desfazer
    }
    
    execute() {
        const task = this.taskManager.findTaskById(this.taskId);
        if (!task) {
            return false;
        }
        
        this.oldStatus = task.getStatus();
        task.setStatus(this.newStatus);
        
        // Notificar observadores
        this.taskManager.notifyTaskStatusChange(task, this.newStatus);
        return true;
    }
    
    undo() {
        if (this.oldStatus) {
            const task = this.taskManager.findTaskById(this.taskId);
            if (task) {
                task.setStatus(this.oldStatus);
                // Notificar observadores
                this.taskManager.notifyTaskStatusChange(task, this.oldStatus);
                return true;
            }
        }
        return false;
    }
    
    getDescription() {
        const task = this.taskManager.findTaskById(this.taskId);
        const statusText = this.newStatus === 'em_andamento' ? 'Em Andamento' : 
                         this.newStatus === 'concluida' ? 'Concluída' : this.newStatus;
                         
        return `Alterar status da tarefa "${task ? task.getTitle() : 'Desconhecida'}" para "${statusText}"`;
    }
}

/**
 * Gerenciador de comandos - implementa desfazer/refazer
 */
class CommandManager {
    constructor() {
        this.undoStack = []; // Comandos executados (para desfazer)
        this.redoStack = []; // Comandos desfeitos (para refazer)
        this.maxStackSize = 20; // Limitar tamanho do histórico
    }
    
    executeCommand(command) {
        const success = command.execute();
        
        if (success) {
            // Adicionar ao topo da pilha de desfazer
            this.undoStack.push(command);
            
            // Limitar tamanho da pilha
            if (this.undoStack.length > this.maxStackSize) {
                this.undoStack.shift(); // Remover o comando mais antigo
            }
            
            // Limpar a pilha de refazer quando um novo comando é executado
            this.redoStack = [];
        }
        
        return success;
    }
    
    undo() {
        if (this.undoStack.length === 0) {
            return false;
        }
        
        const command = this.undoStack.pop();
        const success = command.undo();
        
        if (success) {
            this.redoStack.push(command);
        } else {
            // Se falhar ao desfazer, colocar de volta na pilha
            this.undoStack.push(command);
        }
        
        return success;
    }
    
    redo() {
        if (this.redoStack.length === 0) {
            return false;
        }
        
        const command = this.redoStack.pop();
        const success = command.execute();
        
        if (success) {
            this.undoStack.push(command);
        } else {
            // Se falhar ao refazer, colocar de volta na pilha
            this.redoStack.push(command);
        }
        
        return success;
    }
    
    canUndo() {
        return this.undoStack.length > 0;
    }
    
    canRedo() {
        return this.redoStack.length > 0;
    }
    
    getUndoStack() {
        return [...this.undoStack];
    }
    
    getRedoStack() {
        return [...this.redoStack];
    }
} 
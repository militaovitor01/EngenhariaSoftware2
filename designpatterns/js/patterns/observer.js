/**
 * Implementação do Padrão Observer
 * 
 * O Observer é um padrão comportamental que permite definir um mecanismo de 
 * assinatura para notificar múltiplos objetos sobre quaisquer eventos que 
 * aconteçam com o objeto que eles estão observando.
 */

/**
 * Subject - Objeto observado que notifica os observadores sobre mudanças
 */
class TaskSubject {
    constructor() {
        this.observers = [];
    }
    
    // Adicionar um observador à lista
    addObserver(observer) {
        this.observers.push(observer);
    }
    
    // Remover um observador da lista
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    
    // Notificar todos os observadores sobre uma mudança
    notifyObservers(task, status) {
        this.observers.forEach(observer => {
            observer.update(task, status);
        });
    }
}

/**
 * Interface para todos os observadores
 */
class Observer {
    update(task, status) {
        throw new Error("O método update deve ser implementado pelas subclasses");
    }
}

/**
 * Observador que mostra notificações na tela
 */
class ScreenObserver extends Observer {
    constructor(notificationCallback) {
        super();
        this.notificationCallback = notificationCallback;
    }
    
    update(task, status) {
        const statusText = status === 'em_andamento' ? 'em andamento' : status;
        const message = `A tarefa "${task.getTitle()}" foi marcada como ${statusText}.`;
        
        // Mostrar toast na tela
        const toast = document.getElementById('notification-toast');
        const toastBody = toast.querySelector('.toast-body');
        toastBody.textContent = message;
        
        // Usar Bootstrap para mostrar o toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Adicionar à lista de notificações
        this.notificationCallback(new Notification(message, 'screen'));
    }
}

/**
 * Observador que simula envio de email
 */
class EmailObserver extends Observer {
    constructor(notificationCallback) {
        super();
        this.notificationCallback = notificationCallback;
    }
    
    update(task, status) {
        const statusText = status === 'em_andamento' ? 'em andamento' : status;
        const message = `EMAIL: Notificação - A tarefa "${task.getTitle()}" do tipo ${task.getType()} foi atualizada para "${statusText}".`;
        
        // Simular envio de email (apenas log)
        console.log(`Enviando email: ${message}`);
        
        // Adicionar à lista de notificações
        this.notificationCallback(new Notification(message, 'email'));
    }
}

/**
 * Observador que faz log no console
 */
class LogObserver extends Observer {
    constructor(notificationCallback) {
        super();
        this.notificationCallback = notificationCallback;
    }
    
    update(task, status) {
        const statusText = status === 'em_andamento' ? 'em andamento' : status;
        const timestamp = new Date().toISOString();
        const message = `LOG [${timestamp}]: Tarefa #${task.getId()} "${task.getTitle()}" mudou status para "${statusText}"`;
        
        // Registrar no console
        console.log(message);
        
        // Adicionar à lista de notificações
        this.notificationCallback(new Notification(message, 'log'));
    }
}

/**
 * Observador que simula notificações push
 */
class PushObserver extends Observer {
    constructor(notificationCallback) {
        super();
        this.notificationCallback = notificationCallback;
    }
    
    update(task, status) {
        const statusText = status === 'em_andamento' ? 'em andamento' : status;
        const message = `PUSH: Alerta - A tarefa "${task.getTitle()}" foi atualizada para "${statusText}".`;
        
        // Simular envio de notificação push (apenas log)
        console.log(`Enviando notificação push: ${message}`);
        
        // Adicionar à lista de notificações
        this.notificationCallback(new Notification(message, 'push'));
    }
}
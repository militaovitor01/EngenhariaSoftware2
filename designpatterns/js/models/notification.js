/**
 * Classe para representar uma notificação
 */
class Notification {
    constructor(message, type, timestamp = new Date()) {
        this.message = message;
        this.type = type; // screen, email, log
        this.timestamp = timestamp;
    }
    
    getMessage() {
        return this.message;
    }
    
    getType() {
        return this.type;
    }
    
    getTimestamp() {
        return this.timestamp;
    }
    
    // Obter representação HTML da notificação
    getHtmlRepresentation() {
        let typeClass = '';
        let icon = '';
        
        switch(this.type) {
            case 'screen':
                typeClass = 'notification-screen';
                icon = '🖥️';
                break;
            case 'email':
                typeClass = 'notification-email';
                icon = '✉️';
                break;
            case 'log':
                typeClass = 'notification-log';
                icon = '📝';
                break;
            case 'push':
                typeClass = 'notification-push';
                icon = '📱';
                break;
        }
        
        return `
            <div class="list-group-item notification-item ${typeClass}">
                <div class="d-flex w-100 justify-content-between">
                    <strong>${icon} ${this.type === 'screen' ? 'Tela' : this.type === 'email' ? 'Email' : this.type === 'log' ? 'Log' : 'Push'}</strong>
                    <small>${this.timestamp.toLocaleTimeString()}</small>
                </div>
                <p class="mb-1">${this.message}</p>
            </div>
        `;
    }
}
// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Criar e iniciar o controlador da interface
    const uiController = new UIController();
    
    // Renderizar estado inicial da interface
    uiController.renderTasks();
    uiController.renderNotifications();
    
    console.log('Aplicação de Gerenciamento de Tarefas inicializada com sucesso!');
    console.log('Padrões de Design implementados: Factory Method, Decorator e Observer.');
});
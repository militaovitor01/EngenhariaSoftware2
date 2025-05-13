# Sistema de Gerenciamento de Tarefas - Implementação de Design Patterns

Este documento descreve as adições implementadas no Sistema de Gerenciamento de Tarefas, que demonstra o uso de diferentes design patterns.

Alunos:
-Vitor Militão
-Diego Polanski

## Implementações Adicionadas (Parte 1)

### 1. Novo Tipo de Tarefa - Projeto (Factory Method)

Foi adicionado um novo tipo de tarefa "Projeto" ao sistema, demonstrando a flexibilidade do padrão Factory Method.

#### Arquivos modificados:
- **js/models/task.js**: Adicionada nova classe `ProjectTask` que estende a classe base `Task`
- **js/patterns/factory.js**: Atualizado o método `createTask()` para incluir o novo tipo 'project'
- **index.html**: Adicionada nova opção no select de criação de tarefas
- **css/styles.css**: Adicionado estilo visual para tarefas do tipo projeto

```js
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
```

### 2. Novo Decorador - Lembrete (Decorator)

Foi implementado um novo decorador que adiciona funcionalidade de lembretes às tarefas, demonstrando o Padrão Decorator.

#### Arquivos modificados:
- **js/patterns/decorator.js**: Adicionada nova classe `ReminderDecorator` que estende `TaskDecorator`
- **js/ui/ui-controller.js**: Atualizado o método `applyDecorators()` para suportar o novo decorador
- **index.html**: Adicionada nova checkbox e input de data para a interface do decorador
- **css/styles.css**: Adicionado estilo para o texto do lembrete

```js
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
```

### 3. Novo Observador - Notificação Push (Observer)

Foi adicionado um novo observador que simula o envio de notificações push quando ocorrem mudanças no estado das tarefas, demonstrando o Padrão Observer.

#### Arquivos modificados:
- **js/patterns/observer.js**: Adicionada nova classe `PushObserver` que estende `Observer`
- **js/ui/ui-controller.js**: Atualizados os métodos `initObservers()` e `setupEventListeners()` para incluir o novo observador
- **js/models/notification.js**: Atualizado o método `getHtmlRepresentation()` para mostrar notificações do tipo push
- **index.html**: Adicionada nova checkbox para ativar/desativar notificações push
- **css/styles.css**: Adicionado estilo para notificações push

```js
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
```

## Implementações Adicionadas (Parte 2)

### 4. Gerenciador de Configurações - Singleton (Padrão Criacional)

Foi implementado um gerenciador de configurações global utilizando o padrão Singleton, que garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global a ela.

#### Arquivos adicionados/modificados:
- **js/patterns/singleton.js**: Nova implementação do padrão Singleton com a classe `ConfigManager`
- **js/ui/ui-controller.js**: Integração do Singleton para gerenciar configurações da aplicação
- **index.html**: Adicionada seção de configurações na interface
- **css/styles.css**: Adicionado suporte a modo escuro e outras configurações visuais

```js
/**
 * Implementação do Padrão Singleton
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
    
    // Métodos para gerenciar configurações...
}

// Exportar uma única instância
const configManager = new ConfigManager().loadFromLocalStorage().applyVisualConfig();
```

#### Benefícios:
- **Controle de acesso**: Garante um único ponto de acesso global às configurações
- **Inicialização preguiçosa**: A instância só é criada quando necessária
- **Substituição de variáveis globais**: Evita poluir o namespace global com variáveis de configuração
- **Persistência automática**: Salva automaticamente as configurações no localStorage
- **Consistência**: Mantém uma única fonte de verdade para as configurações do sistema

### 5. Sistema de Tarefas Compostas - Composite (Padrão Estrutural)

Foi implementado um sistema de tarefas compostas utilizando o padrão Composite, que permite compor objetos em estruturas de árvore para representar hierarquias parte-todo, tratando objetos individuais e composições uniformemente.

#### Arquivos adicionados/modificados:
- **js/patterns/composite.js**: Nova implementação do padrão Composite com as classes `TaskComponent`, `SingleTask` e `CompositeTask`
- **js/ui/ui-controller.js**: Adicionados métodos para criar e gerenciar grupos de tarefas e subtarefas
- **index.html**: Adicionada interface para criação de grupos e subtarefas
- **css/styles.css**: Adicionados estilos para grupos de tarefas e subtarefas

```js
/**
 * Implementação do Padrão Composite
 */
// Interface comum para todas as tarefas (componentes simples e compostos)
class TaskComponent {
    // Métodos base...
    
    // Métodos específicos do composite
    addTask(task) { throw new Error("Método não implementado"); }
    removeTask(taskId) { throw new Error("Método não implementado"); }
    getChildTasks() { throw new Error("Método não implementado"); }
    isComposite() { return false; }
}

// Classe para uma tarefa individual (folha)
class SingleTask extends TaskComponent {
    // Implementações...
}

// Classe para uma tarefa composta (contém subtarefas)
class CompositeTask extends TaskComponent {
    constructor(id, title, description) {
        super(id, title, description);
        this.children = [];
        this.expanded = false;
    }
    
    // Implementa os métodos do composite
    isComposite() { return true; }
    addTask(task) { this.children.push(task); return this; }
    removeTask(taskId) { /* implementação... */ }
    
    // Outros métodos...
}
```

#### Benefícios:
- **Hierarquia flexível**: Permite criar estruturas hierárquicas de tarefas (tarefas principais e subtarefas)
- **Interface uniforme**: Trata objetos individuais e composições de maneira uniforme
- **Facilidade de expansão**: Facilita a adição de novos tipos de componentes
- **Organização lógica**: Agrupa tarefas relacionadas, melhorando a organização para o usuário
- **Operações em lote**: Permite aplicar operações a grupos inteiros de tarefas (ex: marcar todas como concluídas)

### 6. Sistema de Desfazer/Refazer - Command (Padrão Comportamental)

Foi implementado um sistema de desfazer/refazer utilizando o padrão Command, que transforma solicitações em objetos independentes contendo todas as informações sobre a solicitação.

#### Arquivos adicionados/modificados:
- **js/patterns/command.js**: Nova implementação do padrão Command com as classes `Command`, `AddTaskCommand`, `RemoveTaskCommand`, `ChangeTaskStatusCommand` e `CommandManager`
- **js/ui/ui-controller.js**: Integrado o sistema de comandos para todas as ações principais
- **index.html**: Adicionados botões de desfazer/refazer na interface
- **css/styles.css**: Adicionados estilos para os botões e histórico de comandos

```js
/**
 * Implementação do Padrão Command
 */
// Interface para todos os comandos
class Command {
    execute() { throw new Error("Método não implementado"); }
    undo() { throw new Error("Método não implementado"); }
    getDescription() { throw new Error("Método não implementado"); }
}

// Exemplos de comandos concretos
class AddTaskCommand extends Command {
    // Implementação...
}

class RemoveTaskCommand extends Command {
    // Implementação...
}

// Gerenciador de comandos
class CommandManager {
    constructor() {
        this.undoStack = []; // Comandos executados (para desfazer)
        this.redoStack = []; // Comandos desfeitos (para refazer)
        this.maxStackSize = 20; // Limitar tamanho do histórico
    }
    
    executeCommand(command) {
        // Implementação...
    }
    
    undo() {
        // Implementação...
    }
    
    redo() {
        // Implementação...
    }
}
```

#### Benefícios:
- **Operações reversíveis**: Permite desfazer e refazer ações do usuário
- **Histórico de ações**: Mantém registro das operações executadas
- **Encapsulamento**: Encapsula solicitações como objetos
- **Desacoplamento**: Separa objetos que enviam solicitações dos que as executam
- **Parametrização de comandos**: Permite parametrizar clientes com diferentes solicitações
- **Composição de comandos**: Permite criar comandos complexos a partir de comandos simples

## Como Usar as Novas Funcionalidades (Parte 2)

### Gerenciador de Configurações (Singleton)

1. Acesse a seção "Configurações" na interface
2. Altere as configurações conforme desejado:
   - **Modo Escuro**: Alterna o tema visual da aplicação
   - **Som de Notificação**: Ativa/desativa sons ao receber notificações
   - **Auto-Salvar**: Ativa/desativa salvamento automático de tarefas
   - **Idioma**: Altera o idioma da interface

As configurações são salvas automaticamente e persistem entre sessões.

### Grupos de Tarefas (Composite)

1. Use o formulário "Criar Grupo de Tarefas" para criar um novo grupo
2. Clique no botão "▶" para expandir um grupo e ver suas subtarefas
3. Clique em "Adicionar Subtarefa" para adicionar uma nova tarefa ao grupo
4. Ao alterar o status de um grupo, todas as subtarefas são atualizadas automaticamente

### Desfazer/Refazer (Command)

1. Realize qualquer ação no sistema (criar, excluir, alterar status de tarefas)
2. Clique no botão "Desfazer" para reverter a última ação
3. Clique no botão "Refazer" para reaplicar uma ação desfeita
4. Os botões ficam desabilitados quando não há ações para desfazer/refazer

## Resumo de Todos os Design Patterns Implementados

### Padrões Criacionais
1. **Factory Method**: Criação de diferentes tipos de tarefas sem especificar suas classes concretas
2. **Singleton**: Gerenciador de configurações global com acesso centralizado

### Padrões Estruturais
1. **Decorator**: Adição dinâmica de comportamentos às tarefas existentes
2. **Composite**: Organização hierárquica de tarefas em estruturas de árvore

### Padrões Comportamentais
1. **Observer**: Notificação de múltiplos observadores quando ocorrem mudanças no estado das tarefas
2. **Command**: Sistema de desfazer/refazer que encapsula solicitações como objetos

Esta implementação demonstra como os padrões de design podem ser combinados para criar um sistema flexível, modular e extensível. 
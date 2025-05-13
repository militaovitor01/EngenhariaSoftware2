/**
 * Implementação do Padrão Factory Method
 * 
 * O Factory Method é um padrão criacional que fornece uma interface para criar
 * objetos em uma superclasse, mas permite que as subclasses alterem o tipo de
 * objetos que serão criados.
 */
class TaskFactory {
    // Contador para gerar IDs únicos
    static lastId = 0;
    
    // Factory Method para criar tarefas com base no tipo
    createTask(type, title, description) {
        const id = ++TaskFactory.lastId;
        
        switch(type) {
            case 'personal':
                return new PersonalTask(id, title, description);
            case 'work':
                return new WorkTask(id, title, description);
            case 'study':
                return new StudyTask(id, title, description);
            case 'project':
                return new ProjectTask(id, title, description);
            default:
                throw new Error(`Tipo de tarefa desconhecido: ${type}`);
        }
    }
}
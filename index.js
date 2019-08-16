class Model {
    constructor() {
        if(!localStorage.getItem('uid_const')){
            localStorage.setItem('uid_const','0');
        }
            if(!localStorage.getItem('myToDos')) {
                console.log('No todos!');
                this.todos = [];
                localStorage.setItem('myToDos', JSON.stringify(this.todos));
            } else {
                console.log('There are todos!');
                this.todos = JSON.parse(localStorage.getItem('myToDos'));
            }
    }
    addToDo(todoObj){
        //
        let todo = {
            id: parseInt(localStorage.getItem('uid_const'))+1,
            header:todoObj.header,
            info:todoObj.info,
            createDate: new Date(),
            completed: false,
            completeDate: new Date('01/01/2999')
        };

        this.todos.push(todo);
        localStorage.setItem('myToDos', JSON.stringify(this.todos));
        localStorage.setItem('uid_const',parseInt(localStorage.getItem('uid_const'))+1);
    }

    //delete todo
    deleteToDo(){
    }
    // update todo
    updateToDo(){

    }


}

class View {
    constructor() {
        let todoName =  document.createElement('input');
            todoName.id = 'todo_header';
            todoName.placeholder = 'Your todo item header';
            todoName.title = 'Please insert todo item header to here!';
            document.body.appendChild(todoName);

        let todoInfo =  document.createElement('textarea');
            todoInfo.id = 'todo_info';
            todoInfo.placeholder = 'Your todo item details';
            todoInfo.title = 'Please insert todo detailed information here';
            document.body.appendChild(todoInfo);

        let addToDoButton = document.createElement('button');
            addToDoButton.id = 'add_todo_button';
            addToDoButton.type = 'button';
            addToDoButton.innerText = 'Add ToDo';
            document.body.appendChild(addToDoButton);

        this.todoName = todoName;
        this.todoInfo = todoInfo;
        this.addToDoButton = addToDoButton;
    }
    get _thisName(){
        return this.todoName.value;
    }
    get _thisInfo(){
        return this.todoInfo.value;
    }
    bindAddToDo(handlerx){
        this.addToDoButton.addEventListener('click',()=>{
            handlerx({header:this._thisName, info:this._thisInfo});
        });
    }
}
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.bindAddToDo(this.handleAddTodo);
    }

    handleAddTodo = (tobj) => {this.model.addToDo(tobj)};


}

const app = new Controller(new Model(), new View());



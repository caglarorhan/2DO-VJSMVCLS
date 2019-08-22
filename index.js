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
        this.reRefreshToDoList(this.getToDos());
        return true;
    }

    getToDos(){
        this.todos = JSON.parse(localStorage.getItem('myToDos'));
        return this.todos;
    }

    findToDoIndex(todoID){
        let todos = this.getToDos();
        let todosLength =todos.length;
        console.log(todoID);
        for(let todoIndex=0; todoIndex<todosLength; todoIndex++){
            if(parseInt(todos[todoIndex].id)===parseInt(todoID)){
                return todoIndex;
            }
        }
        return -1;
    }


    //delete todo
    deleteToDo(todoID){
        if(this.findToDoIndex(todoID)===-1){
            console.log(`Couldn't find the todo record!`);
            return false;
        }
        console.log(`${todoID} id ile silinme talebi geldi!`);
        let todoIndex= this.findToDoIndex(todoID);
        let oToDo = this.todos[todoIndex];
        if(confirm(`Do you want to delete ${oToDo.header}?`)){
            let a_1 = this.todos.slice(0,todoIndex);
            let a_2 = this.todos.slice(todoIndex+1, this.todos.length);
            this.todos = a_1.concat(a_2);
            localStorage.setItem('myToDos', JSON.stringify(this.todos));
            this.reRefreshToDoList(this.getToDos());
            return true;
        }else{
            return false;
        }

    }
    // update todo
    updateToDo(todoObj){

    }

    bindRefreshToDoList(callback){
        this.reRefreshToDoList = callback;
    }

}

class View {
    constructor() {
        // header or name of todo
        let todoName =  document.createElement('input');
        let todoName_label = document.createElement('span');
            todoName_label.innerText = 'To Do Name:';
            todoName.id = 'todo_header';
            todoName.placeholder = 'Your todo item header';
            todoName.title = 'Please insert todo item header to here!';
            //
            document.body.appendChild(todoName);
            document.body.insertBefore(todoName_label, todoName);

            //
            document.body.appendChild(document.createElement('br'));
        // detail or information of todo
        let todoInfo =  document.createElement('textarea');
        let todoInfo_label = document.createElement('span');
            todoInfo_label.innerText = 'To Do Information:';
            todoInfo.id = 'todo_info';
            todoInfo.placeholder = 'Your todo item details';
            todoInfo.title = 'Please insert todo detailed information here';
            document.body.appendChild(todoInfo);
            document.body.insertBefore(todoInfo_label,todoInfo);
        //
        document.body.appendChild(document.createElement('br'));
        //
        // todo adding button
        let addToDoButton = document.createElement('button');
            addToDoButton.id = 'add_todo_button';
            addToDoButton.type = 'button';
            addToDoButton.innerText = 'Add ToDo';
            document.body.appendChild(addToDoButton);
        //
        document.body.appendChild(document.createElement('br'));


        //

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



    bindAddToDo(handler){
        this.addToDoButton.addEventListener('click', async ()=>{
            let todoLists = await handler({header:this._thisName, info:this._thisInfo});
        });
    }

    bindDeleteToDo(handler){
        let links = document.querySelectorAll('a.todoLink');
        links.forEach((theLink)=>{
            theLink.addEventListener('click',async ()=>{
                 let responseFromProcess = await handler(theLink.dataset.id);
                 //console.log(responseFromProcess)
                 if(responseFromProcess){
                     console.log('Done! Deleted!');
                 }
            })
        })
    }


    listToDos(toDoList){
        let listContainer;


            if(!document.getElementById('list-container')){
                let listContainerDiv = document.createElement('div');
                listContainerDiv.id='list-container';
                document.body.appendChild(listContainerDiv);
            }

        listContainer = document.getElementById('list-container');
            listContainer.innerHTML='';

        let todoUnOrderedListHeader = document.createElement('h3');
        todoUnOrderedListHeader.innerText = 'ToDo List';
        listContainer.appendChild(todoUnOrderedListHeader);
        if(toDoList.length<1){
            listContainer.innerHTML='There is no todo in the list!'
        }else{
            // todo list

            let todoUnOrderedList = document.createElement('ul');
            listContainer.appendChild(todoUnOrderedList);
            toDoList.forEach((todo)=>{
                let todoElm = document.createElement('li');
                todoElm.innerHTML = `<input type="checkbox" ${todo.completed?"checked":''}> : <b>${todo.header}</b> <i>${todo.info} </i> <a class="todoLink" href="void:0" data-id="${todo.id}">DELETE</a>`;
                todoUnOrderedList.appendChild(todoElm);
            })
        }
    }




}
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.bindAddToDo((tobj) => { return this.model.addToDo(tobj)});
        this.refreshToDoList(this.model.getToDos());
        this.model.bindRefreshToDoList(this.refreshToDoList);
        this.view.bindDeleteToDo((todoId) => {return this.model.deleteToDo(todoId)});
    }

        refreshToDoList = (todos)=>{
            this.view.listToDos(todos);
        }

        refreshBindDeleteToDo(){

        }


}

const app = new Controller(new Model(), new View());



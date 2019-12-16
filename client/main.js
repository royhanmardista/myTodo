//import { isArray } from "util"

$(document).ready( () => {
    ceckStatus()         
    $('#to_login').click(toLogin)
    $('#to_register').click(toRegister)
    $('#register').submit(registerMember)
    $('#login').submit(loginMember)
    $('#add-button').click(function(event){
        $('#todo_form').show()
        $('#empty-todo').hide()
    })

    // ini form untuk membuat todolist baru
    $('#todo_form').submit(addTodo)    
    // todo today
    $('#today-list').click(function(event){        
        event.preventDefault()
        viewTodoToday()
    })
    //all todo list
    $('#all-list').click(function(event){        
        event.preventDefault()
        viewAll()
    }) 
}) // ini tutup bagian document




function viewAll() {
    $('#project').hide()
    $('#todo').show()
    $.ajax({
        url : `http://35.240.216.157/todo/all`,
        method : 'GET',
        headers : {
            token: localStorage.getItem('token')
        }
    })
    .done(todos => {        
        if (todos.length === 0) {
            prepareEmpty()  
        } else {
            $('#todo-container').empty()
            displayTodos(todos,'all')
            prepareForm('all')   
        }
    })
    .fail(err => {
        Swal.fire({
            title: 'error',
            type: 'error',
            text: err.responseJSON.message
        })
    })
}

function viewTodoToday(data) {       
    $('#project').hide()
    $('#todo').show()
    $.ajax({
        url : `http://35.240.216.157/todo`,
        method : 'GET',
        headers : {
            token: localStorage.getItem('token')
        }
    })
    .done(todos => {
        if (todos.length === 0) {
            prepareEmpty()      
        } else {
            $('#todo-container').empty()
            displayTodos(todos,'today')
            prepareForm('today')
        }       
    })
    .fail(err => {
        Swal.fire({
            title: 'error',
            type: 'error',
            text: err.responseJSON.message
        })
    })
}


function prepareEmpty(event) {
    $('#todo-container').empty()    
    $('#todo-container').append(empty_todo)
    $('#add-button').click(function(event){
        event.preventDefault()
        $('#todo-container').empty()    
        $('#todo-container').append(addTodoForm)
        $('#todo_form').submit(addTodo)
        $('#CencelForm').click(viewTodoToday)
    })  
}

function prepareForm(day) {
    $('#todo-container').prepend(`
        <div class="d-flex justify-content-end">
            <button class="btn mr-2 my-2 w-15" id="add-button" >
                <i class="glyphicon glyphicon-plus-sign"  ></i>
                Add Activity
            </button>    
        </div>     
    `)    
              
    $('#add-button').click(function(event){
        event.preventDefault()
        $('#todo-container').empty()    
        $('#todo-container').append(addTodoForm)
        $('#todo_form').submit(addTodo)        
        $('#CencelForm').click(day => {
            if (day === 'today') {
                viewTodoToday()
            } else {
                viewAll()
            }
        })
    }) 
    
}

function setUser(user) {
    $('#user-email').empty()
    $('#user-email').append(`<li class="list-group-item pl-1" id="user-title"><i class="fa fa-user-o mr-2"></i>${user.username}</li>`)
    $('#user-email').append(`<li class="list-group-item pl-1" id="user-title"><i class="fa fa-envelope-o mr-2"></i>${user.email}</li>`)
}

// setting untuk google
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    $('#user-email').empty()
    $('#user-email').append(`<li class="list-group-item pl-1" id="user-title"><i class="fa fa-user-o mr-2"></i>${profile.ig}</li>`)
    $('#user-email').append(`<li class="list-group-item pl-1" id="user-title">${profile.U3}</li>`)
    $.ajax({
        url : `http://35.240.216.157/login-google`,
        method : "POST",
        data : {
            google_token : id_token
        }        
    })
    .done( data => {
        localStorage.setItem("token", data.token)
        ceckStatus()    
    })
    .done (function() {
        viewTodoToday()
    })
    .fail(err=> {
        Swal.fire({
            title: 'error',
            type: 'error',
            text: err.responseJSON.message
        })
    })
}

function signOut() {
    localStorage.removeItem("token")
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        ceckStatus()   
    });
}

function ceckStatus() {
    if(localStorage.getItem('token')){
        $('#main-page').show()
        $('#front-page').hide()
        $('#logout').show() 
        $('#google').hide()
        $('#todo_form').hide()
        viewTodoToday() 
    } else {
        $('#register').show()
        $('#logout').hide()
        $('#google').show()
    } 
}

function registerMember(event) {
        event.preventDefault()
        let email = $('#email').val()
        let password = $('#password').val()
        let username = $('#username').val()
        $.ajax({
            url : `http://35.240.216.157/register`,
            method : 'POST',
            data : {
                email : email,
                password : password,
                username
            }
        }).done( result => {
            Swal.fire(
                'Register Success!',
                'You have been registered in our web!',
                'success'
              )
            $('#register').hide()
            $('#login').show()
        }).fail( err => {
            Swal.fire({
                title: 'error',
                type: 'error',
                text: err.responseJSON.message.join(', ')
            })
        })    
}

function loginMember(event) {
    event.preventDefault()        
    let email = $('#email_login').val()
    let password = $('#password_login').val()
    $.ajax({
        url : `http://35.240.216.157/login`,
        method : 'POST',
        data : {
            email : email,
            password : password
        }
    })
    .done( data => {
        setUser(data.user)
        Swal.fire(
            'Loggin Success!',
            'You are now loggin in our web!',
            'success'
            )
        localStorage.setItem("token", data.token)
        ceckStatus()   
    })
    .fail( err => {
        Swal.fire({
            title: 'Ops...',
            type: 'error',
            text: err.responseJSON.message
        })
    })    
}

function updateTodo(id, day){
    let todo_id = id
    $.ajax({
        url : `http://35.240.216.157/todo/${todo_id}`,
        method : 'GET',                
        headers : {
            token: localStorage.getItem('token')
        }
    })
    .done(function (todo) {    
        Swal.fire({
            title: 'Update Todo Form',
            html:
              `<label for="title">please input title</label>` +
              `<input id="title" class="swal2-input" value= "${todo.title}">` +  
              `<label for="description">please input description</label>` +
              `<input id="description" class="swal2-input" value= "${todo.description}">` +
              `<label for="input_date">Date</label>
                <input type="date" class="form-control" required id="input_date" placeholder="input date" value="${todo.dueDate.slice(0, 'yyyy-mm-dd'.length)}">
                <label for="input_time">Time</label>
                <input type="time" class="form-control" required id="input_time" placeholder="input time" value = "${new Date(todo.dueDate).getHours()}:${new Date(todo.dueDate).getMinutes()}">`,
            focusConfirm: false,
            preConfirm: () => {
              return {
                title : document.getElementById('title').value,
                date : document.getElementById('input_date').value,
                time : document.getElementById('input_time').value,
                description : document.getElementById('description').value
              }   
            }
          })
          .then (function (input) {
            $.ajax({
                url : `http://35.240.216.157/todo/${todo._id}`,
                method : 'PUT',   
                data : {
                    title : input.value.title,
                    dueDate : new Date(`${input.value.date} ${input.value.time}`),
                    description : input.value.description
                },             
                headers : {
                    token: localStorage.getItem('token')
                },
                
            })
            .done (function (data) {
                Swal.fire(
                    'Updated!',
                    'Your Todo has been updated.',
                    'success'
                )   
                if (day == 'all') {
                    viewAll()    
                } else {
                    viewTodoToday()
                }
            })
            .fail(function(err) {
                    Swal.fire({
                        title: 'Ops...',
                        type: 'error',
                        text: err.responseJSON.message
                    })
            })
          })
          
    })                      
}

function deleteTodo(id, day) {  
    let todo_id = id                       
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then( function(result) {
        if (result.value) {
            $.ajax({
                method: 'DELETE',
                url: `http://35.240.216.157/todo/${todo_id}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(function(data) {
                $(`#${todo_id}`).parents('li').hide() 
                Swal.fire(
                    'Deleted!',
                    'Your Todo has been deleted.',
                    'success'
                )  
                if (day == 'all') {
                    viewAll()    
                } else {
                    viewTodoToday()
                }                      
            })
            .fail(function(err) {
                Swal.fire({
                    title: 'Ops...',
                    type: 'error',
                    text: err.responseJSON.message
                })
                viewAll()
            })

        }
      })
}

function addTodo(event) {
    event.preventDefault()        
    let title = $('#input_title').val()
    let description = $('#input_description').val()
    let dueDate = $('#input_date').val()
    let time = $('#input_time').val()
    $.ajax({
        url : `http://35.240.216.157/todo`,
        method : 'POST',
        headers : {
            token: localStorage.getItem('token')
        },
        data : {
            title,
            dueDate : new Date(`${dueDate} ${time}`),
            description,            
        }
        
    })
    .done( data => {
        Swal.fire(
            'Adding the todo list success!',                
            'success'
            )            
        viewAll()  
    })
    .fail( err => {
        if (Array.isArray(err.responseJSON.message)) {
            Swal.fire({
                title: 'Ops...',
                type: 'error',
                text: err.responseJSON.message.join(', ')
            })
        } else {
            Swal.fire({
                title: 'Ops...',
                type: 'error',
                text: err.responseJSON.message
            })
        }
    })    
}

function displayTodos(todos, day) {
    setUser(todos[0].user) 
    todos.forEach(todo => {
        $('#todo-container').append(
        `<ul class="m-2 shadow rounded" id="bg${todo._id}">
            <li class="list-group-item py-4 d-flex justify-content-between "> 
                <div>Title : ${todo.title}</div> 
                <div class="d-flex col-sm-3 justify-content-between">
                    <div class="mr-2" ><i class="fa fa-calendar-check-o pr-1"></i>${new Date(todo.doneDate || todo.dueDate).toLocaleDateString('en-US')} </div>
                    <div> <i class="fa fa-clock-o pr-1"></i>${new Date(todo.doneDate || todo.dueDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} </div> 
                </div>                
            </li>
            <li class="list-group-item py-4 d-flex justify-content-between"> 
                <div>Description : ${todo.description}</div>
                <div class="d-flex flex-column">
                    <div class="ml-4">
                        <button class='btn' id="${todo._id}" onclick="doneTodo('${todo._id}','${todo.status}', '${day}')"><i class="glyphicon glyphicon-ok" id="ok${todo._id}"></i><i class="fa fa-times" id="no${todo._id}"></i></button>                         
                        <button class='btn' onclick="updateTodo('${todo._id}', '${day}')"><div class="glyphicon glyphicon-edit" id="${todo._id}"></div></button> 
                        <button class='btn' onclick="deleteTodo('${todo._id}', '${day}')"><div class="glyphicon glyphicon-trash" id="${todo._id}" ></div></button> 
                    </div>
                </div>
            </li> 
        </ul>        
        `)
        if (todo.status == false) {
            $(`#bg${todo._id}`).css('background-color', '#DD2D4A').css('color', '#DD2D4A')
            $(`#ok${todo._id}`).show()
            $(`#no${todo._id}`).hide()
        } else {
            $(`#bg${todo._id}`).css('background-color', 'green').css('color', 'green')
            $(`#ok${todo._id}`).hide()
            $(`#no${todo._id}`).show()
        }
    });    
}

function toLogin(event) {
    event.preventDefault()
    $('#register').hide('slow') 
    $('#login').show('slow') 
}

function toRegister(event) {
    event.preventDefault()
    $('#register').show('slow') 
    $('#login').hide('slow') 
}

function doneTodo(id, status, day) {
    let update
    if ( status == "true") {
        update = "false"
    } else {
        update = true
    }
    $.ajax({
        url: `http://35.240.216.157/todo/${id}/status`,
        method: 'patch',
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            status: update
        }
    })
    .done (({todo}) => {  
        if (todo.status == false) {
            Swal.fire({
                title: 'Unchecked',
                type: 'success',
                text: 'Unchecked todo success'
            })
        } else {
            Swal.fire({
                title: 'Checked',
                type: 'success',
                text: 'Todo completed success'
            })
        }
        if (day == 'all') {
            viewAll()    
        } else {
            viewTodoToday()
        }
    })
    .fail (err => { 
        Swal.fire({
            title: 'Ops...',
            type: 'error',
            text: err.responseJSON.message
        })
    })
}

const empty_todo = 
`<li class="list-group-item pt-5 pb-5" id="empty-todo">
    <div class="" style="width: 50%; margin : 0px auto;">
        <img src="./image/empty.png" class="card-img-top rounded" alt="...">
        <div class="card-body">
            <h5 class="card-title text-center">Todays Activity</h5>
            <p class="card-text">It seems that you have no activity, do you want to add new todo list ?</p>
            <button class="btn" id="add-button">
                <i class="glyphicon glyphicon-plus-sign"  ></i>
                Add Activity</button>
        </div>
    </div>
</li>` 
const addTodoForm =
`<li>
    <div class="d-flex border rounded bg-white py-3">
        <form id="todo_form" class="col-sm-8 offset-2 border border-info rounded p-2">
                <h2 class="text-center">Form Add Todo</h2>
            <div class="form-row align-items-center pl-1">
                <div class="col-sm-12 my-2">
                    <label for="input_title">Title</label>
                    <input type="text" class="form-control" required id="input_title" placeholder="Please fill the title">
                </div>
                <div class="col-sm-12 my-2">
                    <label for="input_description">Description</label>
                    <textarea class="form-control" required id="input_description" placeholder="Please fill your the discription"></textarea>
                </div>
                <div class="col-sm-12 my-1">
                    <label for="input_date">Date</label>
                    <input type="date" class="form-control" required id="input_date" placeholder="input date">
                </div>   
                <div class="col-sm-12 my-1">
                    <label for="input_time">Time</label>
                    <input type="time" class="form-control" required id="input_time" placeholder="input time">
                </div>                                
                <div class="col-auto my-1 pt-0 pb-0">
                    <button type="submit" class="btn ">Add</button>
                    <button class="btn " id="CencelForm" >Cancel</button>
                </div>
            </div>
        </form>
    </div>
</li> `


const editTodoForm =
`<li>
    <div class="d-flex border rounded bg-white py-3">
        <form id="todo_form" class="col-sm-8 offset-2 border border-info rounded p-2">
                <h2 class="text-center">Form Add Todo</h2>
            <div class="form-row align-items-center pl-1">
                <div class="col-sm-12 my-2">
                    <label for="input_title">Title</label>
                    <input type="text" class="form-control" required id="input_title" placeholder="Please fill the title">
                </div>
                <div class="col-sm-12 my-2">
                    <label for="input_description">Description</label>
                    <textarea class="form-control" required id="input_description" placeholder="Please fill your the discription"></textarea>
                </div>
                <div class="col-sm-12 my-1">
                    <label for="input_date">Date</label>
                    <input type="date" class="form-control" required id="input_date" placeholder="input date">
                </div>   
                <div class="col-sm-12 my-1">
                    <label for="input_time">Time</label>
                    <input type="time" class="form-control" required id="input_time" placeholder="input time">
                </div>                                
                <div class="col-auto my-1 pt-0 pb-0">
                    <button type="submit" class="btn ">Add</button>
                    <button class="btn " id="CencelForm" >Cancel</button>
                </div>
            </div>
        </form>
    </div>
</li> `

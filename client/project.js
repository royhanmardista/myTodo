$(document).ready( () => {
       
    $('#project_form').submit(addProject)
    // todo today   
    $('#all-project').click(function(event){               
        event.preventDefault()
        viewProject()
    })

}) // ini tutup bagian document

function prepareFormAddMember(projectId) {
    $('#project-container').empty()    
    $('#project-container').append(
    `<li class="list-group-item">            
    <div class="container">
        <div class="row">
            <div class="col-sm-5">
                <div class="d-flex rounded bg-white py-3">
                    <form class="form-inline w-100 p-2" id="searchMember">
                        <input id="search-member-input" class="form-control form-control-md w-100" type="text" placeholder="Search"
                        aria-label="Search">
                        <input class="btn mt-2" type="submit" value="search">
                    </form>
                </div> 
            </div>
            <div class="card m-1 border-info text-center text-info col-sm-5 d-flex flex-column justify-content-between">
                <div class="card-header">
                    <div class="h2" style="font-family: 'Bree Serif', serif;
                    ">User list</div>                 
                </div>
                <div class="card-body" id="project-member-container">     
                </div>
            </div>            
        </div>
    </div>
</li>
`)
        $('#searchMember').submit(function(event) {
            event.preventDefault()
            let email = $('#search-member-input').val()
            $.ajax({
                url : `http://35.240.216.157/search/${email}`,
                method : 'GET',
                headers : {
                    token: localStorage.getItem('token')
                }   
            })
            .done( users => {
                $('#project-member-container').empty()
                if (users.length > 0) {                    
                    users.forEach(user => {                        
                        $('#project-member-container').append(`
                            <li>Username : ${user.username}</li>
                            <li>Email: ${user.email}</li>
                            <button class="btn" onclick="addMemberToProject('${user._id}','${projectId}')">add member</button>
                        `)                    
                    })
                } else {
                    $('#project-member-container').append(`
                            <li>there is no one with that name in our database, please check again ...</li>                            
                    `)
                }
            })
            .fail( err => {
                Swal.fire({
                    title: 'Ops...',
                    type: 'error',
                    text: err.responseJSON.message
                })
            })    
        })
}

function addMemberToProject(userId, projectId) {
    $.ajax({
        url : `http://35.240.216.157/project/${projectId}/member`,
        method : 'PUT',
        headers : {
            token: localStorage.getItem('token')
        },
        data : {
            newMember: userId
        }
    })
    .then(projects => {  
        Swal.fire(
            'Adding new member to project success!',                
            'success'
            )              
        viewProject()
    })
    .fail(err => {
        Swal.fire({
            title: 'Ops...',
            type: 'error',
            text: err.responseJSON.message
        })
    })
}

function viewProject() {
    $('#todo').hide()
    $('#project').show() 
    $.ajax({
        url : `http://35.240.216.157/project/all`,
        method : 'GET',
        headers : {
            token: localStorage.getItem('token')
        }
    })
    .then(projects => {        
        $('#project-container').empty()
        if (projects.length > 0) {
            displayProjects(projects)
        }
        prepareFormProject() 
    })
    .fail(err => {
        Swal.fire({
            title: 'Ops...',
            type: 'error',
            text: err.responseJSON.message
        })
    })
}
//addProjectTodoForm

function prepareFormProjectTodo(id) {        
    $('#project-container').empty()    
    $('#project-container').append(`
    <li>
        <div class="d-flex border rounded bg-white py-3">
            <form id='project${id}' class="col-sm-8 offset-2" onsubmit="addProjectTodo('${id}')">
                    <h2 class="text-center">Form Add Todo to Project</h2>
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
    </li> `)    
    //$(`#project${id}`).submit(addProjectTodo(id))
    $('#CencelForm').click(viewProject)    
}

function addProjectTodo(id) {
    event.preventDefault()        
    let title = $('#input_title').val()
    let description = $('#input_description').val()
    let dueDate = $('#input_date').val()
    let time = $('#input_time').val()
    $.ajax({
        url : `http://35.240.216.157/project/${id}/todo`,
        method : 'PUT',
        headers : {
            token: localStorage.getItem('token')
        },
        data : {
            title,
            dueDate : new Date(`${dueDate} ${time}`),
            description,     
            //projectId : id       
        }
        
    })
    .done( data => {
        Swal.fire(
            'Adding the project list success!',                
            'success'
            )
        viewProject()    
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




function prepareFormProject() {
    $('#project-container').prepend(`
        <div class="d-flex justify-content-end">
            <button class="btn my-2 w-15" id="add-project" >
                <i class="glyphicon glyphicon-plus-sign"  ></i>
                Add Project
            </button>    
        </div>     
    `)  
    $('#add-project').click(function(event){
        event.preventDefault()
        $('#project-container').empty()    
        $('#project-container').append(addProjectForm)
        $('#project_form').submit(addProject)
        $('#CencelForm').click(viewProject)
    }) 
    
}

function displayProjects(projects) {
    setUser(projects[0].user)
    projects.forEach(project => {
        $('#project-container').append(
        `<li class="list-group-item">            
            <div class="container">
                <div class="row">
                    <div class="card border-primary shadow m-1 text-center text-dark col-sm-auto d-flex flex-column justify-content-between">
                        <div class="card-header">
                            <div class="h2" style="font-family: 'Bree Serif', serif;
                            ">${project.title.toUpperCase()}</div>                 
                        </div>
                        <div class="card-body">     
                            <div class="d-flex justify-content-between mb-2">
                                <div class="mr-2" ><i class="fa fa-calendar-check-o pr-1"></i>${new Date(project.doneDate || project.dueDate).toLocaleDateString('en-US')} </div>
                                <div class=""> <i class="fa fa-clock-o pr-1"></i>${new Date(project.dueDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} </div> 
                            </div>
                            <p class="card-text text-start border-top border-bottom py-2">${project.description}</p>                       
                            <div class="d-flex p-1 justify-content-between">
                                <button class='btn mr-1' onclick="updateProject('${project._id}')"><div class="glyphicon glyphicon-edit" id="${project._id}"></div></button> 
                                <button class='btn mr-1' onclick="prepareFormProjectTodo('${project._id}')">Add Todo</button>
                                <button class='btn mr-1' onclick="prepareFormAddMember('${project._id}')">Add Member</button>
                                <button class='btn mr-1' onclick="deleteProject('${project._id}')"><div class="glyphicon glyphicon-trash" id="${project._id}" ></div></button> 
                            </div>
                        </div>

                    </div>
                    <div class="card m-1 shadow border-warning text-center text-warning col-sm-5 d-flex flex-column justify-content-between">
                        <div class="card-header">
                            <div class="h2" style="font-family: 'Bree Serif', serif;
                            ">Todos</div>                 
                        </div>
                        <div class="card-body" id="project-todos-container${project._id}">                            
                            
                        </div>
                    </div>
                    <div class="card m-1 shadow border-secondary text-center text-success col-sm-3 d-flex flex-column justify-content-between">
                        <div class="card-header">
                            <div class="h2" style="font-family: 'Bree Serif', serif;
                            ">Members</div>                 
                        </div>
                        <div class="card-body" id="project-member-container${project._id}">                            
                            
                        </div>
                    </div>
                </div>
            </div>
        </li>`)
    displayTodosProject(project)      
    displayTodosMember(project)
    });    
}

function displayTodosMember(project) {
    project.members.forEach(member => {
        $(`#project-member-container${project._id}`).append(
        `<div class="m-2" id="bg${member._id}">  
            <li class="list-group-item d-flex justify-content-between">
                <div><i class="fa fa-user-o"> ${member.username}</i></div>
                <button id="deleteMember${member._id}" class='btn' onclick="deleteProjectMember('${member._id}','${project._id}')"><i class="fa fa-times-circle"></i></button>                 

            </li>
            <li class="list-group-item d-flex justify-content-between"> 
                <div><i class="fa fa-envelope"> ${member.email}</i></div>
            </li> 
            <div class="d-flex justify-content-between bg-light p-1" >
            </div>
        </div>        
        `)        
    });
}

function displayTodosProject(project) {
    project.todos.forEach(todo => {
        $(`#project-todos-container${project._id}`).append(
        `<div class="m-2 card shadow rounded" id="bg${todo._id}">
            <div class="card-header h3 text-light" style="font-family: 'Bree Serif', serif;
            ">${todo.title}</div>                 
            <li class="list-group-item d-flex justify-content-between">
                    <div class="mr-2" ><i class="fa fa-calendar-check-o pr-1"></i>${new Date(todo.doneDate || todo.dueDate).toLocaleDateString('en-US')} </div>
                    <div> <i class="fa fa-clock-o pr-1"></i>${new Date(todo.doneDate || todo.dueDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} </div> 
                   
            </li>
            <li class="list-group-item d-flex justify-content-between"> 
                <div>${todo.description}</div>
            </li> 
            <div class="d-flex justify-content-between bg-light p-1" >
                <button class='btn' onclick="doneTodoProject('${todo._id}','${project._id}', '${todo.status}')"><i class="glyphicon glyphicon-ok" id="ok${todo._id}"></i><i class="fa fa-times" id="no${todo._id}"></i></button>                         
                <button class='btn' onclick="updateTodoProject('${todo._id}','${project._id}')"><div class="glyphicon glyphicon-edit" id="${todo._id}"></div></button> 
                <button class='btn' onclick="deleteTodoProject('${todo._id}','${project._id}')"><div class="glyphicon glyphicon-trash" id="${todo._id}" ></div></button> 
            </div>
        </div>        
        `)
        if (todo.status == false) {
            $(`#bg${todo._id}`).css('color', 'red').css('background-color', '#DD2D4A')
            $(`#ok${todo._id}`).show()
            $(`#no${todo._id}`).hide()
        } else {
            $(`#bg${todo._id}`).css('background-color', '#3DA35D').css('color', '#3E8914')
            $(`#ok${todo._id}`).hide()
            $(`#no${todo._id}`).show()
        }
    });
}

function updateTodoProject(todoId, projectId) {
    $.ajax({
        url : `http://35.240.216.157/todo/${todoId}`,
        method : 'GET',                
        headers : {
            token: localStorage.getItem('token')
        }
    })
    .then(function (todo) {     
        console.log(new Date(todo.dueDate))
        Swal.fire({
            title: 'Update Todo Form',
            html:
              `<label for="title">please input title</label>` +
              `<input id="title" class="swal2-input" value= "${todo.title}">` +  
              `<label for="description">please input description</label>` +
              `<input id="description" class="swal2-input" value= "${todo.description}">` +                  
              `<label for="input_date">Date</label>
                <input type="date" class="form-control" required id="input_date" placeholder="input date" value= "${todo.dueDate.slice(0, 'yyyy-mm-dd'.length)}">
                <label for="input_time">Time</label>
                <input type="time" class="form-control" required id="input_time" placeholder="input time" value= "${new Date(todo.dueDate).getHours()}:${new Date(todo.dueDate).getMinutes()}">`,
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
                url : `http://35.240.216.157/project/${projectId}/update/todo/${todoId}`,
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
                viewProject()                
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

function doneTodoProject(todoId, projectId, status) {
    let update
    if ( status == "true") {
        update = "false"
    } else {
        update = true
    }
    $.ajax({
        url: `http://35.240.216.157/project/${projectId}/update/status/${todoId}`,
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
        viewProject()
    })
    .fail (err => {        
        Swal.fire({
            title: 'Ops...',
            type: 'error',
            text: err.responseJSON.message
        })
    })
}


function deleteProjectMember(memberId, projectId) {
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
                method: 'PUT',
                url: `http://35.240.216.157/project/${projectId}/remove/member/${memberId}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(function(data) {
                $(`#${memberId}`).parents('li').hide() 
                Swal.fire(
                    'Deleted!',
                    'Your member has been removed.',
                    'success'
                )  
                viewProject()                   
            })
            .fail(function(err) {
                Swal.fire({
                    title: 'Ops...',
                    type: 'error',
                    text: err.responseJSON.message
                })
                viewProject()                   
            })

        }
      })
}


function deleteTodoProject(todoId, projectId) {
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
                method: 'PUT',
                url: `http://35.240.216.157/project/${projectId}/delete/todo/${todoId}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(function(data) {
                $(`#${todoId}`).parents('li').hide() 
                Swal.fire(
                    'Deleted!',
                    'Your Todo has been deleted.',
                    'success'
                )  
                viewProject()                   
            })
            .fail(function(err) {
                Swal.fire({
                    title: 'Ops...',
                    type: 'error',
                    text: err.responseJSON.message
                })
                viewProject()                   
            })

        }
      })
}

function updateProject(id){
    $.ajax({
        url : `http://35.240.216.157/project/${id}`,
        method : 'GET',                
        headers : {
            token: localStorage.getItem('token')
        }
    })
    .then(function (project) {     
        Swal.fire({
            title: 'Update Project Form',
            html:
              `<label for="title">please input title</label>` +
              `<input id="title" class="swal2-input" value= "${project.title}">` +  
              `<label for="description">please input description</label>` +
              `<input id="description" class="swal2-input" value= "${project.description}">` +                  
              `<label for="input_date">Date</label>
                <input type="date" class="form-control" required id="input_date" placeholder="input date" value="${project.dueDate.slice(0, 'yyyy-mm-dd'.length)}">
                <label for="input_time">Time</label>
                <input type="time" class="form-control" required id="input_time" placeholder="input time" value = "${new Date(project.dueDate).getHours()}:${new Date(project.dueDate).getMinutes()}">`,
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
                url : `http://35.240.216.157/project/${id}`,
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
                    'Your Project has been updated.',
                    'success'
                )   
                viewProject()
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


function deleteProject(id) {  
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
                url: `http://35.240.216.157/project/${id}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(function(data) {
                $(`#${id}`).parents('li').hide() 
                Swal.fire(
                    'Deleted!',
                    'Your Project has been deleted.',
                    'success'
                )  
                viewProject()                   
            })
            .fail(function(err) {
                Swal.fire({
                    title: 'Ops...',
                    type: 'error',
                    text: err.responseJSON.message
                })
                viewProject() 
            })

        }
      })
}

function addProject(event) {
    event.preventDefault()        
    let title = $('#input_title').val()
    let description = $('#input_description').val()
    let dueDate = $('#input_date').val()
    let time = $('#input_time').val()
    $.ajax({
        url : `http://35.240.216.157/project`,
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
            'Adding the project list success!',                
            'success'
            )
        viewProject()    
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
const addProjectForm =
`<li>
    <div class="d-flex border rounded bg-white py-3">
        <form id="project_form" class="col-sm-8 offset-2 border border-info rounded p-2">
                <h2 class="text-center">Form Add Project</h2>
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

const addProjectTodoForm =
`<li>
    <div class="d-flex bg-white py-3">
        <form id="project_todo_form" class="col-sm-8 offset-2 border border-info rounded p-2">
                <h2 class="text-center">Form Add Todo to Project</h2>
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
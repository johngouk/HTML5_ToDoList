// Set ToDo list variable
var toDoListName = 'toDos';
var toDoList = JSON.parse(localStorage.getItem(toDoListName));

function setLiValue(id, toDoName, toDoDate){
  var liValue = '<li id="task-'+id+'"><a id="toDo_link" href="#edit" data-todoname="'+toDoName+'" data-tododate="'+toDoDate+'">'+toDoName+'</a></li>';
//console.log("liValue:"+liValue);
  return liValue;
}

function loadLiItems(){
  // Load the list of ToDos on the page
  if (localStorage.getItem(toDoListName)!=null){
    // loop and output LI items
    var i = 0;
    var liValue = "";
    $.each(toDoList, function(key, value){
      $('#toDos').prepend(setLiValue(i,value.toDoName, value.toDoDate));
      i++;
    });
    // Refresh
    $('#toDos').listview('refresh');
  }
} 

function addEntry (theName, theDate){
  // Simple field validation
  if (theName == ''){
    alert('Please give the To Do a name!');
    return false;
  } else if (theDate == ''){
    alert('Please give the To Do a date!');
    return false;
  } else {
    toDoList = JSON.parse(localStorage.getItem(toDoListName));
    if (toDoList == null){
      toDoList = [];
    }
    // Create array entry with new To Do values
    var newToDo = {"toDoName":theName, "toDoDate":theDate};
    toDoList.push(newToDo);
    localStorage.setItem(toDoListName,JSON.stringify(toDoList));
    return true;
  }  
}

$(document).ready(function(){
  console.log("Document ready!");
  
  loadLiItems();
  
  /***********************************
  * Home page code
  ***********************************/
  // Clear all To Dos
  $('#clearButton').click(function(){
    console.log("Clear button clicked!");
    localStorage.removeItem(toDoListName);
    $('#toDos').empty();
    $('#toDos').listview('refresh');    
  });

  // User selected a ToDo to edit by clicking it in the list
  $('#toDos').on('click','#toDo_link', function(event){
    console.log("toDos clicked!");
    console.log("data-todoname:"+$(this).data('todoname'));
    console.log("data-tododate:"+$(this).data('tododate'));
    // Save the current values because we need them to find the entry to modify
    // after they have changed!
    localStorage.setItem('currentToDoName',$(this).data('todoname'));
    localStorage.setItem('currentToDoDate',$(this).data('tododate'));
    // Experiment - can I set the editForm values from here? Yes!!
    $('#editForm input[name=toDoNameEdit]').val($(this).data('todoname'));
    $('#editForm input[name=toDoDateEdit]').val($(this).data('tododate'));
    
  });
  
  
  /***********************************
  * Add page code
  ***********************************/
  // Add Form submitted by clicking Save button
  $('#add').on('click', '#addButton', function(){
    // Get submitted values
    var toDoName = $('#toDoNameAdd').val();
    var toDoDate = $('#toDoDateAdd').val();
  
    if (addEntry(toDoName, toDoDate)) {
      // Put in the display list
      $('#toDos').prepend(setLiValue((toDoList.length-1),toDoName,toDoDate));
      // Clear the edit fields as we saved this one
      $('#toDoNameAdd').val("");
      $('#toDoDateAdd').val("");
      // Refresh
      $('#toDos').listview('refresh');    
      $.mobile.changePage($('#home'), 'pop');
    } // Otherwise stay here?
  
  });  

  /***********************************
  * Edit page code
  ***********************************/

  
  // Edit Form submitted by clicking Save button
//  $('#editForm').submit(function(){
  $('#edit').on('click', '#saveButton', function(){
    // Get existing values
    console.log("Save button clicked");
    var currentToDoName = localStorage.getItem('currentToDoName');
    var currentToDoDate = localStorage.getItem('currentToDoDate');
    // Find and remove the ToDo specified
    for (var i= 0;i<toDoList.length; i++){
      if (toDoList[i].toDoName == currentToDoName) {
        toDoList.splice(i,1);
        localStorage.setItem(toDoListName,JSON.stringify(toDoList));
      }
    }
    // Get submitted values
    var toDoNameEdit = $('#toDoNameEdit').val();
    var toDoDateEdit = $('#toDoDateEdit').val();
    if (addEntry(toDoNameEdit, toDoDateEdit)){
      // Remove all list items and replace with the new list
      $('#toDos').empty();
      loadLiItems();
      $.mobile.changePage($('#home'), 'pop');
      // Clear the edit fields as we saved this one
      $('#toDoNameEdit').val("");
      $('#toDoDateEdit').val("");
    } // Otherwise stay here
  
  });
  
  // Delete ToDo button clicked
  $('#editForm').on('click', '#deleteButton', function(){
    console.log("Delete button clicked");
    var currentToDoName = localStorage.getItem('currentToDoName');
    var currentToDoDate = localStorage.getItem('currentToDoDate');
    // Find and remove the ToDo specified
    for (var i= 0;i<toDoList.length; i++){
      if (toDoList[i].toDoName == currentToDoName) {
        toDoList.splice(i,1);
        localStorage.setItem(toDoListName,JSON.stringify(toDoList));
      }
    }
    // Remove all list items and replace with the new list
    $('#toDos').empty();
    loadLiItems();
    $.mobile.changePage($('#home'), 'pop');
  });
  
});

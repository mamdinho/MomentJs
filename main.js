/************************************************************************
**********  WEB422 –Assignment2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Mohammed Suleiman Mohamed AL-falahy Student ID: 121083174 Date: Jan 28, 2019
*
*
********************************************************************************/ 

const link = "https://thawing-wildwood-69422.herokuapp.com/"; //heroku link for the TEAMS-API
let employeesModel = []; //empty variable for our current employees

$(document).ready(function () {
    initializeEmployeesModel(); // populating the employeesModel

    $("#employee-search").on("keyup" , function(){
       let filtered = getFilteredEmployeesModel($("#employee-search").val()); // invoke the filter function with the searched value string
       refreshEmployeeRows(filtered); // invoking the refresh function and passing the filtered employee array returned above
    })

    $("#employees-table").on("click",".body-row",function(){
        
        let empcopy = getEmployeeModelById( $(this).attr("data-id") );
        empcopy.HireDate = moment(empcopy.HireDate).format("LL"); // changing hiredate to a moment object
        

        let template2 = _.template("<strong>Address:</strong>" + " <%- emp.AddressStreet %>" + " " 
                                     +"<%- emp.AddressCity %>" +", " + " <%- emp.AddressState %>" +" " +"<%- emp.AddressZip %>" + "<br>"
                                     +"<strong>Phone:</strong>" + " <%- emp.PhoneNum %>" +" ext: " + "<%- emp.Extension %>" + "<br>"
                                     +"<strong>Hire Date:</strong>" +" <%- emp.HireDate %>"
                                    );
        let empDetails = template2({"emp" : empcopy});  // empDetails is a string consisting of all the employee details  
        let empname = empcopy.FirstName + " " + empcopy.LastName;

        showGenericModal(empname,empDetails) ; // displays the popover for the clicked employee                    
    });
});

function initializeEmployeesModel() {
    $.ajax({
        url: link + "employees",
        type: "GET",
        contentType: "application/json"
    })
    .done(function(emps){
        for(var i=0; i<emps.length; i++){
            employeesModel[i] = emps[i];
        }
        refreshEmployeeRows(employeesModel); //invoking(calling) the function refreshEmployeeRows
    })
    .fail(function(err){
        showGenericModal("Error" , "Unable to get Employees"); //error = title & "Unable ..." = message
    })
}

function showGenericModal(title,messgae){
    $(".modal-body").empty();
    $(".modal-title").text(title); // setting the modal title
    $(".modal-body").append(messgae); // setting the modal body

    $('#genericModal').modal({ // show the modal programmatically
        backdrop: 'static', // disable clicking on the backdrop to close
        keyboard: false // disable using the keyboard to close
    });
}

function refreshEmployeeRows(employees){
  let employeeTemplate = _.template('<% _.forEach(employees , function(emp) { %>' 
                      + '<div class="row body-row" data-id= "<%- emp._id %>"' + '>'
                      + '<div class="col-xs-4 body-column">' + '<%- emp.FirstName %>' +'</div>' 
                      + '<div class="col-xs-4 body-column">' + '<%- emp.LastName %>' +'</div>'
                      + '<div class="col-xs-4 body-column">' + '<%- emp.Position.PositionName %>' +'</div>'
                      + '</div>'
                      + '<% }); %>');

    let employeesTable = $("#employees-table");    // selecting the div element with id = employees-table               
    let emprows =  employeeTemplate({'employees' : employees}); // passing the parameter employees array to the lodash template 

    employeesTable.empty(); // emptying the prev contents
    employeesTable.append(emprows);   
}

function getFilteredEmployeesModel(filterString){
      let filteredEmps = _.filter(employeesModel , function(employee){ // filters the employeesModel by the filterString provided
          return employee.FirstName.toUpperCase().includes(filterString.toUpperCase()) || employee.LastName.toUpperCase().includes(filterString.toUpperCase()) || employee.Position.PositionName.toUpperCase().includes(filterString.toUpperCase());
      });

      return filteredEmps; // returns the filtered version of the array
}

function getEmployeeModelById(id){
  let indexOfEmp = _.findIndex(employeesModel , function(employee){
      return employee._id == id;
  });

  if(indexOfEmp == -1){ // this means the employee with the provided id doesn't exist
      return null;
  }
  else{ // else return a deep clone of the employee with the id 
    let empClonedDeep = _.cloneDeep(employeesModel[indexOfEmp]);
    return empClonedDeep;
  }
}


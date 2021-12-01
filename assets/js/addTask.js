

 //store that acts as a task manager.
const store = new TaskManager();
const session={};
store.restoreData("localStorage");
session.taskModified=false;
let taskModalInstance=null;

//window event listeners
// when window loses focus - store data 
window.addEventListener('blur',(ev)=>{
    store.persistData();
});

//when window gains focus - restore data from local storage & refresh
window.addEventListener('focus',(ev)=>{
    store.restoreData("localStorage");
    renderTask();
});

//check status every quater second
window.setInterval(statusCheck,250);

//main function for the page
function main(){
    //format a new date for the date field. 
    const cDt = new Date();
    const cMnth=cDt.getMonth()+1;
    const cMonth=cMnth<10?"0"+cMnth.toString():cMnth.toString();
    const cDate=`${cDt.getFullYear()}-${cMonth}-${cDt.getDate()}`;
    // make a constant with modal contents
    // initialize on a <div class="modal"> with all options
    // Note: options object is optional
    taskModalInstance = new BSN.Modal(
        // target selector
        '#taskModal', 
        // options object
        { 
        content: "", // sets modal content
        backdrop: 'static', // we don't want to dismiss Modal when Modal or backdrop is the click event target
        keyboard: false // we don't want to dismiss Modal on pressing Esc key
        }
    ); //end taskModalInstance
    //get form
     const form = document.getElementById("taskForm");
     //set date attributes
    const dateFld =  document.querySelector("#dDate");
    dateFld.setAttribute("value",cDate);
    dateFld.setAttribute("min", cDate);
    //render task table
    renderTask();
    //add event listeners, submit & reset
    form.addEventListener('submit', event => {
        event.preventDefault();
        form.classList.add('was-validated');
        // check if any form-controls have form-control:invalid class, stop if true
        // otherwise add the task to the store.taskList and render on screen.
        if (form.checkValidity()){
            //no invalid controls detected - continue:
            const projectName = document.querySelector("#projNam").value;
            const taskName = document.querySelector("#taskNam").value;
            const desc = document.querySelector("#desc").value;
            const assignee = document.querySelector("#assignee").value; 
            const status = document.querySelector("#status").value; 
            const dueDate = document.querySelector("#dDate").value;
            store.addTask(projectName, taskName, desc, assignee, status, dueDate);
            form.classList.remove("was-validated");
            form.reset();
            session.taskModified=true;
        }
    });
    //reset form when button is pressed
    form.addEventListener('reset', event=>{
        form.classList.remove("was-validated");
        form.reset();
    });
}

/* check if an element is visible on a page */
function isVisible (ele) {
    var style = window.getComputedStyle(ele);
    return (style.width !== "0" &&
    style.height !== "0" &&
    style.opacity !== "0" &&
    style.display!=='none' &&
    style.visibility!== 'hidden');
}

//check status of tasks - if changed renderTasks afresh
function statusCheck() {
    //check if any of the two pages have modified the task in any form 
    //get from localStorage status of pages: 
    if (session.taskModified){
        //something has chaned on the page - renderTasks afresh
        renderTask();
        session.taskModified=false;
        //persist data to local storage and mark as changed
        store.persistData();
    }
}

//display task added to list after it is added
function renderTask(){
    //reset TaskTable
    resetTable();
    //get task table body
    const taskTableBody=document.querySelector("#taskTableBody");
    //delete existing display of data in the table
    //check if task table body contains any rows - if so delete all of them
    if (taskTableBody!=null){
        while(taskTableBody.hasChildNodes()) 
            taskTableBody.removeChild(taskTableBody.firstChild);
    }
    if (store.getNoOfTasks()>0){
        //run a Array.forEach here to process each element in the task list
        store.taskList.forEach(ele=>{
            // create a new table row
            const tbRow=document.createElement("TR");
            tbRow.setAttribute("id",`${ele.allData["ID"]}`);
            tbRow.classList.add("taskTableRow");
            // get all data values from task and add it to a row
            for (prop in ele.allData){
                //create a new table row data field - task name
                const tbCell=document.createElement("TD");
                //add a text node with contents
                const tbCellCnt=document.createTextNode(ele.allData[prop]);
                //add text node to table data field
                tbCell.appendChild(tbCellCnt);
                //add data field to table row
                tbRow.appendChild(tbCell);
            }
            // //add the row to the body
            taskTableBody.appendChild(tbRow);
            if (isVisible(document.querySelector("#noDataLine"))){
                document.querySelector("#noDataLine").classList.add("d-none");
                document.querySelector("#taskTable").classList.remove("d-none");
            }
        });
    //removed -- initModal();
    document.querySelector("#taskTable").addEventListener("click",tableClickHandler);
    }
    // no of tasks in tasklist is 0
    else if (isVisible(document.querySelector("#taskTable"))){
            document.querySelector("#noDataLine").classList.remove("d-none");
            document.querySelector("#taskTable").classList.add("d-none");
        }
}
     
//function: handler for double click events on the table row
function tableClickHandler(event){     
    const element = event.target.closest('.taskTableRow'); 
    const id = Number(element.getAttribute("id"));
    //update modal body with task details
    updateModalBody(id);
    //add an event listener -- for the modal 'mark as done' button
    document.querySelector(".modalBtn").addEventListener("click",event=>{
        const element = event.target;
        const id2 = Number(element.getAttribute("id"));
        //modify task status in store
        store.modifyTaskStatus(id2,"done");
        //reset the taskmodified flag for table refresh
        session.taskModified=true;
        // disable the 'mark as done' button
        element.classList.add("d-none");
        //toggle off the modal
        taskModalInstance.update();
    });//end event listener --- for the modal 'mark as done' button
    //turn on the modal 
    taskModalInstance.toggle();
} //end function: event listener handler -- for the double click on list of tasks

// update modal body with task details and set up a "mark as done" button
const updateModalBody = id => {
    const cTask = store.getTaskById(id);
    //variables and constants used for modal 
    const modalContHeader = 
    `<!-- Modal Header -->
    <div class="modal-header">
        <h4 class="w-100 modal-title text-center">Mark Task</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="close">&times;</button>
    </div>`;
    const modalContFooter = 
    `<!-- Modal Footer -->
    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="close">Close</button>
    </div>`;
    const preButtonBody=`<!-- Modal Body -->
    <div class="modal-body">
        <div class="row d-flex align-items-center">
            <div class="col-12 d-flex justify-content-center">
                <h5 class="text-center"> Task ID: ${cTask.id} </h5>
            </div>
        </div>
        <hr/>
        <div class="row d-flex align-items-center">
            <div class="col-12 d-flex">
                <p><strong>Task: </strong> ${cTask.taskName} <br/>
                <strong>Assigned to: </strong>${cTask.assignee}  <br/>
                <strong>Status: </strong>${cTask.status} </p> 
            </div>
        </div>
        <div class="row d-flex align-items-center">
            <div class="col-12 d-flex justify-content-center">`;
    const postButtonBody=`
            </div> 
        </div>
        <hr/>
        <div class="row d-flex align-items-center">
            <div class="col-12 d-flex justify-content-center">
                <p> To modify or delete a task go to <a href="manageTasks.html"> Manage Tasks Page </a> </p> 
            </div>
        </div>
    </div>`;
    const modalContBody = cTask.status!=="done" ? 
            preButtonBody
            + `<button type='button' class='btn btn-primary modalBtn' id='${cTask.id}'> Mark as Done </button>`
            + postButtonBody :
            preButtonBody 
            + `<button type='button' class='btn btn-primary modalBtn d-none' id='${cTask.id}'> Mark as Done </button>`
            + postButtonBody ;
    const modalCont=modalContHeader+modalContBody+modalContFooter;
    taskModalInstance.setContent(modalCont);
}; //end sub-function --- updateModalBody 

const resetTable=()=>{
    //get table header row
    const taskTableHead=document.querySelector("#taskTableHead");
    //delete existing table header
    //check if task table body contains any rows - if so delete all of them
    if (taskTableHead!=null){
        while(taskTableHead.hasChildNodes()) 
            taskTableHead.removeChild(taskTableHead.firstChild);
    }
    //add the appropriate content to the table head
    const taskTblHdRw=document.createElement("TR");
    //prepare the th row
    const taskTblHdCnt = store.getTaskHeaders().map(ele=>{
        let fieldName;
        if (ele==="Desc") fieldName="Description";
        else if(ele==="Due") fieldName="Due Date";
        else fieldName=ele; 
        return(`<th> ${fieldName} </th>`);
    }).join(' ');
    //display
    taskTblHdRw.insertAdjacentHTML("afterbegin",taskTblHdCnt);
    taskTableHead.appendChild(taskTblHdRw);
}

/* custom code for date check: 
    //check value of date field if it is blank or in the past - raise error
    const todayDt = new Date();
    // check if date is blank after triming, if so return null
    const valueDt = dateFld.value.trim() ? new Date(dateFld.value) : null;
    // check if date is blank or in the past...
    if (valueDt==null || valueDt < todayDt) {
        // add invalid class to date input
        dateFld.classList.add("is-invalid");
        //check if error message is visible or not, if not add class 
        //to make it visible
        if (!isVisible(document.getElementById("invalidDateMsg"))){
            document.getElementById("invalidDateMsg").classList.add("d-block");
        }
    }

redundant --
// function to initialise a modal which will allow a task to be modified
const initModal=()=>{
    //check if modal body exists - if so delete it 
    if (document.querySelector(".modal-header")!=null){
        const modalBody = document.querySelector(".modal-header").parentElement;
        modalBody.removeChild(document.querySelector(".modal-header"));
        modalBody.removeChild(document.querySelector(".modal-body"));
        modalBody.removeChild(document.querySelector(".modal-footer"));
        document.querySelector("#taskTable").removeEventListener("click",tableClickHandler);
    }
     // add an event listener for double clicks on the list of tasks
     document.querySelector("#taskTable").addEventListener("click",tableClickHandler);
}//end initModal()

*/
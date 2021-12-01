
//store that acts as a task manager.
const store = new TaskManager();
store.restoreData("localStorage");
const session={};
session.noTasks=store.getNoOfTasks();

 //set up eventlistener
    
// when window loses focus - store data
window.addEventListener('blur',()=>{
    store.persistData();
});

//when window gains focus - restore data from local storage
window.addEventListener('focus',()=>{
    store.restoreData("localStorage");
    renderCards();
});

function main() {
    renderCards();
    
    document.querySelector("#loadTestButton").addEventListener('click',()=>{
        store.deleteAllTasks();
        store.restoreData("testData");
        renderCards();
    });

    document.querySelector("#deleteTasksButton").addEventListener('click',()=>{
        if (window.confirm("Do you really want to Delete all tasks?")){
            store.deleteAllTasks();
            renderCards();
        }
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


function renderCards() {
    if (store.getNoOfTasks()>0){
        let ctr=0;
        //delete existing cards
        //check if row has any cards - if so delete all of them
        const taskCardRow=document.querySelector("#cardRow");
        if (taskCardRow!=null){
            while(taskCardRow.hasChildNodes()) 
                taskCardRow.removeChild(taskCardRow.firstChild);
        }
        //prepare & display card row
        //for each task make a card and display it
        //add a card for each task & display
        store.taskList.forEach(ele => {
            const cardRow=document.querySelector("#cardRow");
            //create a col to hold the card
            const cardCol=document.createElement("DIV");
            cardCol.classList.add("col-md4");
            //create a card
            const card=document.createElement("DIV");
            card.classList.add("card","task-card");
            //add card body
            const cardBody=document.createElement("DIV");
            cardBody.classList.add("card-body");
            //create a card title
            const cardTitle=document.createElement("H5");
            cardTitle.classList.add("card-title","text-center");
            const cardTitleText=document.createTextNode(`Task No. ${++ctr}`);
            // add text in title
            cardTitle.appendChild(cardTitleText);
            // add title to catd
            cardBody.appendChild(cardTitle);
            //start a loop to process all values of the task
            let vId=0;
            for (prop in ele.allData){
                if (prop==="ID"){
                    vId=ele.allData[prop];
                }
                // start a new row
                const cardPropRow=document.createElement("DIV");
                cardPropRow.classList.add("row");
                // start column 1 
                const cardPropRowCol1=document.createElement("DIV");
                cardPropRowCol1.classList.add("col-5");
                // start property name to col as a strong title
                const cardPropRowCol1Tl=document.createElement("P");
                cardPropRowCol1Tl.classList.add("card-text");
                const cardPropRowCol1TlBld=document.createElement("STRONG");
                // start title contents
                const cardPropRowCol1TlBldCt=document.createTextNode(prop);
                //add all to col
                cardPropRowCol1TlBld.appendChild(cardPropRowCol1TlBldCt);
                cardPropRowCol1Tl.appendChild(cardPropRowCol1TlBld);
                cardPropRowCol1.appendChild(cardPropRowCol1Tl);
                // add col to row
                cardPropRow.appendChild(cardPropRowCol1);
                // start column 2 to card row
                const cardPropRowCol2=document.createElement("DIV");
                cardPropRowCol2.classList.add("col-7");
                // add contents to col 
                var cardPropRowCol2El;
                if (prop==="Status"){
                    //add a drop down select list as an element 
                    cardPropRowCol2El=document.createElement("SELECT");
                    cardPropRowCol2El.setAttribute("id",prop+'_'+vId);
                    cardPropRowCol2El.setAttribute("name",prop+'_'+vId);
                    cardPropRowCol2El.classList.add("cardSelect");
                    const options=["to do","in progress","review","done"];
                    options.forEach(el2=>{
                        //make an option element for each option and add it to the select
                        const cardPropRowCol2ElOpt = document.createElement("OPTION");
                        cardPropRowCol2ElOpt.setAttribute("value",el2);
                        const cardPropRowCol2ElOptCt=document.createTextNode(el2.toUpperCase());
                        cardPropRowCol2ElOpt.appendChild(cardPropRowCol2ElOptCt);
                        cardPropRowCol2El.appendChild(cardPropRowCol2ElOpt);
                    });
                    cardPropRowCol2El.value=ele.allData[prop];
                } else{
                    cardPropRowCol2El=document.createElement("P");
                    cardPropRowCol2El.classList.add("card-text");
                    const cardPropRowCol2ElCt=document.createTextNode(ele.allData[prop]);
                    //add to col
                    cardPropRowCol2El.appendChild(cardPropRowCol2ElCt);
                }             
                cardPropRowCol2.appendChild(cardPropRowCol2El);
                // add col to row
                cardPropRow.appendChild(cardPropRowCol2);
                // add row to card body
                cardBody.appendChild(cardPropRow);
                //add a horizontal line
                const hr=document.createElement("HR");
                cardBody.appendChild(hr);
            } //end for loop to process each field 
           
            // add a delete button to the card - only one
            const cardDelRow=document.createElement("DIV");
            cardDelRow.classList.add("row");
            //make a col for the row
            const cardDelRowCol=document.createElement("DIV");
            cardDelRowCol.classList.add("col-12","d-flex","justify-content-center");
            // make a delete button for the col
            const cardDelRowColBtn=document.createElement("BUTTON");
            cardDelRowColBtn.classList.add("btn","btn-danger","delBtn");
            cardDelRowColBtn.setAttribute("id",`btn_${vId}`);
            if (ele.allData["Status"]!== "done"){
                cardDelRowColBtn.setAttribute("disabled","");
            }
            //add text to button
            const cardDelRowColBtnLbl=document.createTextNode("Delete Task");
            cardDelRowColBtn.appendChild(cardDelRowColBtnLbl);
            //add button to column
            cardDelRowCol.appendChild(cardDelRowColBtn);
            //add column to row
            cardDelRow.appendChild(cardDelRowCol);
            //add row to card body
            cardBody.appendChild( cardDelRow);
            // add the card body to the card
            card.appendChild(cardBody);
            cardCol.appendChild(card);
            cardRow.appendChild(cardCol);
        }); //end setting up cards

        //set up event listeners for each card
        document.querySelectorAll(".task-card").forEach(ele=>{
            //event listener on delete button
            const cardBtn = ele.querySelector('.delBtn');
            cardBtn.addEventListener("click",eve=>{
                //get the id 
                let vId=Number(cardBtn.getAttribute("id").split('_')[1]);
                //delete task from store
                store.deleteTask(vId);
                //rendercards refresh
                store.persistData();
                renderCards();
            }); //end event listener - click delete button
            //event listener on select control
            const cardSel = ele.querySelector('.cardSelect');
            cardSel.addEventListener("change",eve=>{
                let vId=Number(cardSel.getAttribute("id").split('_')[1]);
                //modify in store
                store.modifyTaskStatus(vId,cardSel.value);
                //set trigger for rendercard refresh
                if (cardSel.value==="done") {
                    ele.querySelector(`#btn_${vId}`).removeAttribute("disabled");
                }
                else {
                    ele.querySelector(`#btn_${vId}`).setAttribute("disabled","");
                }
                store.persistData();
                renderCards();
            }); //end event listener for change on status
        }); // end for each card
       
        const cardRow=document.querySelector("#cardRow");
        const noTaskRow=document.querySelector("#noTaskRow");
        if(isVisible(noTaskRow)){
             //display card row & hide "no task" message
            noTaskRow.classList.remove("d-flex");
            noTaskRow.classList.add("d-none");
            cardRow.classList.remove("d-none");
            cardRow.classList.add("d-flex");
        }
        //enable delete tasks button
        document.querySelector("#deleteTasksButton").removeAttribute("disabled");
        //disbale load tasks button
        if (isVisible(document.querySelector("#loadTestButtonRow"))){
            document.querySelector("#loadTestButtonRow").classList.add("d-none");
            document.querySelector("#loadTestButton").classList.add("d-none");
        }
        
    }
    else {
        const cardRow=document.querySelector("#cardRow");
        const noTaskRow=document.querySelector("#noTaskRow");
        if(isVisible(cardRow)){
            //hide card row & display "no task" message
            cardRow.classList.remove("d-flex");
            cardRow.classList.add("d-none");
            noTaskRow.classList.remove("d-none");
            noTaskRow.classList.add("d-flex");
        }
        //enable load tasks button
        document.querySelector("#loadTestButtonRow").classList.remove("d-none");
        document.querySelector("#loadTestButton").classList.remove("d-none");
        //disable delete tasks button
        document.querySelector("#deleteTasksButton").setAttribute("disabled","");
    }
}
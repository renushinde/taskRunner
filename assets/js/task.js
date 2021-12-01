

//class definition of Task
class Task {
    constructor(id,projectName, taskName, desc, assignee, status, dueDate){
        this._id = id;
        this._projectName=projectName;
        this._taskName=taskName;
        this._desc=desc;
        this._assignee=assignee;
        this._status=status;
        this._dueDate=dueDate;
    }

    static fieldNames = ["ID","Project","Task","Desc","Assignee","Status","Due"];
    //setters
    set id(pId){
        this._id=pId;
    }

    set status(pStatus) {
        this._status=pStatus;
    }
    //getters
    get id() {return(this._id);}

    get projectName() {return(this._projectName);}

    get taskName() {return(this._taskName);}

    get desc() {return(this._desc);}

    get assignee() {return(this._assignee);}

    get status() {return(this._status);}

    get dueDate() {return(this._dueDate);}

    get allData(){
        return({"ID": this._id,
                "Project":this._projectName,
                "Task":this._taskName,
                "Desc":this._desc,
                "Assignee":this._assignee,
                "Status":this._status,
                "Due":this._dueDate
        });
    }

    toJSON(){
        return({ID: this._id,
                Project:this._projectName,
                Task:this._taskName,
                Desc:this._desc,
                Assignee:this._assignee,
                Status:this._status,
                Due:this._dueDate
        });
    }
}

// Taskmanager is the class used to store the taskList array
class TaskManager{ 
    constructor(){
            // array of tasks
            this._taskList=[];
    }

    //return the taskList
    get taskList() {
        return(this._taskList);
    }

    //return the latest id in the series 
    getLatestId(){
        const lastId=localStorage.getItem('id');
        if (lastId!=null) {
            //id found add 1 to it to get the latest id.
            const latestId=Number(JSON.parse(lastId).id)+1;
            localStorage.setItem('id',JSON.stringify({id:latestId}));
            return latestId;
        }
        else{
            //id not found start from 10
            localStorage.setItem('id',JSON.stringify({id:10}));
            return 10;
        }
    };

    //return all task field names
    getTaskHeaders() {return(Task.fieldNames);}

    //get a particular task by using it's id
    getTaskById(pId){
        const index = this._taskList.findIndex(ele=>ele.id===pId);
        if (index===-1) throw(new Error("not found error"));
        else return(this._taskList[index]);
    }

    //return no of tasks in taskList
    getNoOfTasks(){
        return this._taskList.length;
    }

    //add a new task to the task list
    addTask(projectName, taskName, desc, assignee, status, dueDate, vId=null){
        //check data isn't null
        if (projectName.trim()==="" || taskName.trim()==="" || desc.trim()==="" || status.trim()==="" || dueDate.trim()==="") {
            throw(new Error("invalid data error"));
        }
        // make an id
        let id = 0;
        if (vId==null) id = this.getLatestId();
        else if(vId!=null) id = vId;
        // get a new task
        const vTask = new Task(id, projectName, taskName, desc, assignee, status, dueDate);
        //add to task list
        this._taskList.push(vTask);
    }

    //modify the status in a task
    modifyTaskStatus(pId,pStatus){
        //get the index of the task in the array with the same id
        const index = this._taskList.findIndex(ele=>ele.id===pId);
        if (index===-1) throw(new Error("not found error"));
        //check if status is not null
        if (pStatus.trim()==="") throw(new Error("invalid data error"));
        // get the right node
        const vTask=this._taskList[index];
        //modify status by calling setter;
        vTask.status=pStatus;
    }

    //delete a task from the list
    deleteTask(pId){
        //get the index of the task in the array with the same id
        const index = this._taskList.findIndex(ele=>ele.id===pId);
        if (index===-1) throw(new Error("not found error"));
        //remove the entry with the given id from the array
        delete this._taskList[index];
        this._taskList=this._taskList.flat();
    }

    //delete all stored tasks
    deleteAllTasks(){
        //reinitalise taskList array
        this._taskList=[];
        const taskListJSON=JSON.stringify(this._taskList);
        localStorage.setItem('tasks', taskListJSON);
    }
    
    //store to local storage
    persistData(){
        const taskListJSON=JSON.stringify(this._taskList);
        localStorage.setItem('tasks', taskListJSON);
    }

    //restore from local storage
    restoreData(type){
        try{ 
            if (type==="localStorage"){
                this._taskList=[];
                let tasks=localStorage.getItem('tasks');
                if(tasks!=null){
                    //load data into local list of tasks
                    const taskList=JSON.parse(tasks);
                    taskList.forEach(ele=>{
                            if (ele!=null) this.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                        }
                    );
                }
            }
            else if (type==="testData"){
                // use the following test data to test the form
                const data = [
                    {"ID": 1,
                    "Project":"Final Project",
                    "Task":"Make a wireframe",
                    "Desc":"Start the project by making a wireframe",
                    "Assignee":"Renu",
                    "Status":"done",
                    "Due":"2021-07-12"
                    },
                    {"ID": 2,
                    "Project":"Final Project",
                    "Task":"Make index.html",
                    "Desc":"Start implementing the project by coding html files",
                    "Assignee":"Renu",
                    "Status":"done",
                    "Due":"2021-07-18"
                    },
                    {"ID": 3,
                    "Project":"Final Project",
                    "Task":"Make index.js",
                    "Desc":"write javascript to validate form",
                    "Assignee":"Dominic",
                    "Status":"done",
                    "Due":"2021-07-16"
                    },
                    {"ID": 4,
                    "Project":"Final Project",
                    "Task":"Make taskManager class",
                    "Desc":"Make task objects that can be manipulated by Task class",
                    "Assignee":"Bobby",
                    "Status":"in progress",
                    "Due":"2021-07-20"
                    }, 
                    {"ID": 5,
                    "Project":"Final Project",
                    "Task":"Manage tasks",
                    "Desc":"Make changes to the tasks be reflected in the stored data",
                    "Assignee":"Emily",
                    "Status":"to do",
                    "Due":"2021-07-25"
                    }
                ];
                data.forEach(ele=>this.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]));
                this.persistData();
            }
            else {
                throw("Unrecognised option used in calling restoreData function");
            }
        }
        catch(error){
            console.log(error);
            throw("error in setting test or restoring data");
        }
    }
}

module.exports = TaskManager;




const TaskManager = require('./task');
assert = require('assert');

const data = [
    {"ID": 1,
    "Project":"Final Project",
    "Task":"Make a wireframe",
    "Desc":"Start the project by making a wireframe",
    "Assignee":"Renu",
    "Status":"done",
    "Due":"06-25-2021"
    },
    {"ID": 2,
    "Project":"Final Project",
    "Task":"Make index.html",
    "Desc":"Start implementing the project by coding html files",
    "Assignee":"Renu",
    "Status":"done",
    "Due":"06-25-2021"
    },
    {"ID": 3,
    "Project":"Final Project",
    "Task":"Make index.js",
    "Desc":"write javascript to validate form",
    "Assignee":"Renu",
    "Status":"done",
    "Due":"06-26-2021"
    },
    {"ID": 4,
    "Project":"Final Project",
    "Task":"Make taskManager class",
    "Desc":"Make task objects that can be manipulated by Task class",
    "Assignee":"Bobby",
    "Status":"in progress",
    "Due":"06-27-2021"
    }, 
    {"ID": 5,
    "Project":"Final Project",
    "Task":"Manage tasks",
    "Desc":"Make changes to the tasks be reflected in the stored data",
    "Assignee":"Renu",
    "Status":"to do",
    "Due":"2020-12-18"
    }
];
//data.forEach(ele=>this.addTask(ele["ID"],ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"]));

describe("TaskManager",()=>{
    //global teardown
    afterEach(()=>localStorage.clear());
    describe("Adding Tasks",()=>{
        describe("adds a task",()=>{
            it('when correct parameters are supplied',()=>{
                //setup 
                const tm=new TaskManager();
                let ele=data[1];
                const expectedB = 0;
                const expectedA = 2;
                //exercise
                const actualB=tm._taskList.length;
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"]);
                ele=data[2];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                const actualA = tm._taskList.length;
                //verify
                assert.strictEqual(actualB,expectedB);
                assert.strictEqual(actualA,expectedA);
            });
            it('throws an error when incorrect data is supplied',()=>{
                //setup 
                const tm=new TaskManager();
                const ele = data[1];
                //exercise & verify
                assert.throws(()=>{tm.addTask("","","","","","","");},{name:'Error', message:'invalid data error'});
                assert.throws(()=>{tm.addTask("", ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);}
                                ,{name:'Error', message:'invalid data error'});
            });    
        });
        
    });
    describe("Getting Information about tasks",()=>{
        it('gets number of tasks',()=>{
            //setup 
            const tm=new TaskManager();
            let ele=data[1];
            const expectedB = 0;
            const expectedA = 2;
            //exercise
            const actualB=tm.getNoOfTasks();
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            ele=data[2];
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            const actualA = tm.getNoOfTasks();
            //verify
            assert.strictEqual(actualB,expectedB);
            assert.strictEqual(actualA,expectedA);
        });
        it('gets the latest ID',()=>{
            //setup 
            const tm=new TaskManager();
            let ele=data[1];
            const expectedB = 10;
            const expectedA = 13;
            //exercise
            const actualB=tm.getLatestId(); //10
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"]); //11
            ele=data[2];
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"]);//12
            const actualA = tm.getLatestId();//13
            //verify
            assert.strictEqual(actualB,expectedB);
            assert.strictEqual(actualA,expectedA);
        });
        describe("gets a task",()=>{
            it('by Id',()=>{
                //setup 
                const tm=new TaskManager();
                let ele=data[1];
                const expected = data[1];
                //exercise
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[2];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[4];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                const actual=tm.getTaskById(expected["ID"]); 
                assert.strictEqual(actual.taskName,expected["Task"]);
            });
            it('throws an error in case of index out of bounds',()=>{
                //setup 
                const tm=new TaskManager();
                let ele=data[1];
                const id=6;
                //exercise
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[2];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[4];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                assert.throws(id=>{tm.getTaskById(id)},{name:'Error', message:'not found error'});
            });    
        });
        it('gets the task field names',()=>{
            //setup 
            const tm=new TaskManager();
            const expected = ["ID","Project","Task","Desc","Assignee","Status","Due"]
            const actual=tm.getTaskHeaders(); 
            assert.deepStrictEqual(actual,expected);
        });

    });
    describe("Modifying Tasks",()=>{
        describe("Modifies task status",()=>{
            it('when correct parameters are supplied',()=>{
                //setup 
                const tm=new TaskManager();
                let ele=data[1];
                const id = ele["ID"];
                const expected = "TO DO";
                //exercise
                const actualB=tm.getNoOfTasks();
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                tm.modifyTaskStatus(id,expected);
                const mTask = tm.getTaskById(id);
                const actual = mTask.status;
                //verify
                assert.strictEqual(actual,expected);
            });
            it('throws an error in case of index out of bounds',()=>{
                //setup 
                const tm=new TaskManager();
                let ele=data[1];
                const id=6;
                //exercise
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[2];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[4];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                assert.throws(id=>{tm.modifyTaskStatus(id,"to do")},{name:'Error', message:'not found error'});
            });    
            it('throws an error when invalid parameter is supplied',()=>{
                //setup 
                const tm=new TaskManager();
                let ele = data[0];
                const id=data[0]["ID"];
                //exercise & verify
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[2];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[4];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                assert.throws(()=>{tm.modifyTaskStatus(id,"");},{name:'Error', message:'invalid data error'});
            });
        });
        
    });
    describe("Removing Tasks",()=>{
        describe('deletes a task',()=>{
            it('when a correct id is supplied',()=>{
                //setup 
                const tm=new TaskManager();
                let ele=data[1];
                const id = ele["ID"];
                const expectedA=2;
                const expectedB=1;
                const expectedC=data[4]["Task"];
                //exercise
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[4];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                const actualA=tm.getNoOfTasks();
                tm.deleteTask(id);
                const actualB=tm.getNoOfTasks();
                const actualC=tm.getTaskById(ele["ID"]).taskName;
                //verify
                assert.strictEqual(actualA,expectedA);
                assert.strictEqual(actualB,expectedB);
                assert.strictEqual(actualC,expectedC);
            });
            it('throws an error in case of index out of bounds',()=>{
                //setup 
                const tm=new TaskManager();
                let ele=data[1];
                const id=6;
                //exercise
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[2];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                ele=data[4];
                tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
                assert.throws(id=>{tm.deleteTask(id)},{name:'Error', message:'not found error'});
            });  
        });
        it('deletes all tasks',()=>{
            //setup 
            const tm=new TaskManager();
            let ele=data[0];
            const expectedA=3;
            const expectedB=0;
            //exercise
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            ele=data[2];
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            ele=data[4];
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            const actualA=tm.getNoOfTasks();
            tm.deleteAllTasks();
            const actualB=tm.getNoOfTasks();
            //verify
            assert.strictEqual(actualA,expectedA);
            assert.strictEqual(actualB,expectedB);
        });
    });
    describe("Data Operations", ()=>{
        it('can store data in localStorage',()=>{
            //setup 
            const tm=new TaskManager();
            let ele=data[0];
            const expectedA=3;
            //exercise
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            ele=data[2];
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            ele=data[4];
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            tm.persistData();
            let taskList=[];
            let tasks=localStorage.getItem('tasks');
            let actualA=0;
            if(tasks!=null){
                //load data into local list of tasks
                const taskList=JSON.parse(tasks);
                actualA=taskList.length;
            }
            //verify
            assert.strictEqual(actualA,expectedA);
        });
        it('can store & restore data from localStorage',()=>{
            //setup 
            const tm=new TaskManager();
            const ntm=new TaskManager();
            let ele=data[0];
            //exercise
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            ele=data[2];
            const id = ele["ID"];
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            ele=data[4];
            tm.addTask(ele["Project"], ele["Task"],ele["Desc"],ele["Assignee"],ele["Status"],ele["Due"],ele["ID"]);
            tm.persistData();
            ntm.restoreData("localStorage");
            const expectedA=tm.getNoOfTasks();
            const expectedB=tm.getTaskById(id).taskName;
            const actualA=ntm.getNoOfTasks();
            const actualB=ntm.getTaskById(id).taskName;
            //verify
            assert.strictEqual(actualA,expectedA);
            assert.strictEqual(actualB,expectedB);
        });
        it('can load test data',()=>{
            //setup 
            const tm=new TaskManager();
            const id=data[2]["ID"];
            const expectedA=data.length;
            const expectedB=data[2]["Task"];
            //exercise
            tm.restoreData("testData");
            const actualA=tm.getNoOfTasks();
            const actualB=tm.getTaskById(id).taskName;
            //verify
            assert.strictEqual(actualA,expectedA);
            assert.strictEqual(actualB,expectedB);
        });
    });
});

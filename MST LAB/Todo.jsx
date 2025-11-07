import React from 'react';
import {useState} from 'react';

function Todo(){
    const [task,setTask]=useState('');
    const [tasks,setTasks] = useState([]);

    const add=()=>{
        if(task){
            setTasks([...tasks,task]);
            setTask('');
        }
    };
    return (
        <div>
            <h2 style={{}}>To-Do app</h2>
            <input value={task} onChange={(e)=> setTask(e.target.value)} placeholder='Enter tasks' />
            <button onClick={add}>Add</button>

            <ul>
                {tasks.map((t,i)=>(
                    <li key={i}>
                        {t}<button onClick={()=>setTasks(tasks.filter((_,idx)=>idx !==i))}>delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Todo;
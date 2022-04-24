import TaskService from "../../API/TaskService";
import React, {useEffect, useRef, useState} from "react";
import columns from "../../data/task-columns";
import TableRow from "./TableRow";
import "./TaskTable.scss";

export default function TaskTable() {
    const [tasks, setTasks] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    if (!isLoaded) {
        setIsLoaded(true);
        TaskService.getAllTasks().then(tasks => setTasks(tasks));
    }
    const inputRefs = [];
    const localization = {
        'addButton': "Добавить",
        'deleteButton': "Удалить",
    }

    const deleteTask = (taskId) => {
        TaskService.deleteTask(taskId).then((success) => {
            if (success) {
                setTasks(tasks.filter((task) => task.id !== taskId));
            } else {
                alert('Не удалось удалить задачу');
            }
        });
    };
    const addTask = (task) => {
        TaskService.createTask(task).then(({isSuccess, message, task}) => {
            if (isSuccess) {
                setTasks([...tasks, task]);
            } else {
                alert('Не удалось добавить задачу:\n' + message);
            }
        }).catch(error => alert(error));
    };

    return (
        <section className='wrapper'>
        <main className='row title'>
            <TableRow
                key='header-row'
                items={columns}
                isHeader={true}/>
        </main>
            {tasks.map((row) => {
                return (
                    <TableRow
                        key={row.id}
                        items={columns.map(({id}) => {
                            if (id === 'manage') {
                                return {
                                    id: id,
                                    title: (
                                        <a
                                            href={'#'}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                deleteTask(row.id);
                                            }}
                                        >{localization.deleteButton}</a>
                                    )
                                };
                            }
                            return {id: id, title: row[id]};
                        })}
                    />
                );
            })}
            <TableRow
                key={'manage-row'}
                items={columns.map(({id, title, type}) => {
                    if (id === 'manage') {
                        title = (
                            <a
                                href={'#'}
                                onClick={(event) => {
                                    event.preventDefault();
                                    const task = {};
                                    for (const inp of inputRefs) {
                                        task[inp.current.name] = inp.current.value;
                                        if (inp.current.name === 'fromDate' || inp.current.name === 'dueDate')
                                        {
                                            task[inp.current.name] = inp.current.value;
                                        }
                                    }

                                    addTask(task);
                                }}
                            >{localization.addButton}</a>
                        );
                    } else if (id !== 'id' && id !== 'estimate'){
                        const fieldRef = useRef();
                        inputRefs.push(fieldRef);
                        title = <input ref={fieldRef} type={type ?? 'text'} name={id} placeholder={title}></input>
                    } else {
                        title = '';
                    }
                    return {id, title};
                })}
            />
        </section>
    );
}
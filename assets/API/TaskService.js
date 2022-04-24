import axios from 'axios';

export default class TaskService {
    static async getAllTasks() {
        return axios.get('/api/tasks/getAll')
            .then(response => {
                console.log('Response = ' + response.data);
                console.log('Type of response data = ' + typeof response.data);
                return Array.from(response.data);
            })
            .catch(error => console.log(error));
    }

    static async createTask(task)
    {
        return axios.post('/api/tasks/createTask', task)
            .then(response => response.data);
    }

    static async deleteTask(taskId)
    {
        return axios.post('/api/tasks/deleteTask', {taskId})
            .then(response => response.data.isSuccess === true);
    }
}
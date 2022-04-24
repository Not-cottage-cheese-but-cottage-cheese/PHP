import React from 'react';
import ReactDOM from 'react-dom';
import TaskTable from "./components/TaskTable/TaskTable";
import "./styles/app.css";

function App() {
    return (
        <TaskTable></TaskTable>
    );
}



ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
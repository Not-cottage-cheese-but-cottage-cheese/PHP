import React from "react";
import "./TaskTable.scss";

export default function TableRow(props) {
    const className = props.className ?? '';

    const list = (
        <ul className={className} onClick={props.onClick}>
            {props.items.map((item) => {
                return (
                    <li key={item.id}>{item.title}</li>
                )
            })}
        </ul>
    );
    return (
        props.isHeader
            ? list
            : <article className={'row nfl'}>{list}</article>
    );
}
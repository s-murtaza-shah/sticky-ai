import React, { useState } from "react";
import "../styles/CreateArea.css"

function CreateArea({ onAdd }) {
    const [note, setNote] = useState({
        noteTitle: "",
        noteContent: ""
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setNote(prevNote => {
            return {
                ...prevNote,
                [name]: value
            };
        });
    }

    function handleClick(event) {
        onAdd(note);
        setNote({
            noteTitle: "",
            noteContent: ""
        })
        event.preventDefault();
    }

    return (
        <div>
            <form className="create-note-form">
                <input className="note-info title" name="noteTitle" onChange={handleChange} value={note.noteTitle} placeholder="Title" />
                <textarea className="note-info content" name="noteContent" onChange={handleChange} value={note.noteContent} placeholder="Take a note..." />
                <button className="add-button" onClick={handleClick}>+</button>
            </form>
        </div>
    )
}

export default CreateArea;
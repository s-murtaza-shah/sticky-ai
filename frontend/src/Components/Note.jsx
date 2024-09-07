import React, { useState, useEffect } from "react";
import { Check, Pencil, Trash } from "react-bootstrap-icons";
import "../styles/Note.css";

function Note({ note, onDelete, onEdit }) {

    const [editNote, setEditNote] = useState(note);
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        setEditNote(note);
    }, [note]);

    function handleDeleteClick() {
        onDelete(note);
    }

    function handleSelectClick() {
        setSelected(true);
    }

    function handleUpdate() {
        onEdit(editNote);
        setSelected(false);
    }

    function handleChange(event) {
        const {name, value} = event.target;
        setEditNote(prevNote => {
            return ({
                ...prevNote,
                [name]: value
            });
        });
    }

    return (
        selected ? (
                <div className="note">
                    <input value={editNote.title} className="card-title title-change" name="title" onChange={handleChange} />
                    <textarea value={editNote.content} className="card-content content-change" name="content" onChange={handleChange} />
                    <button className="check-button" onClick={handleUpdate}><Check className="check" /></button>
                    <button className="delete-button" onClick={handleDeleteClick}><Trash className="trash" /></button>
                </div>
        )
            : (
                <div className="note">
                    <h1 className="card-title">{note.title}</h1>
                    <p className="card-content">{note.content}</p>
                    <button className="edit-button" onClick={handleSelectClick}><Pencil className="pencil" /></button>
                    <button className="delete-button" onClick={handleDeleteClick}><Trash className="trash" /></button>
                </div>
            )
    )


}

export default Note;
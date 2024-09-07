import React, { useEffect, useState } from "react";
import Note from "../Components/Note";
import CreateArea from "../Components/CreateArea";
import ChatAvatar from "../Components/ChatAvatar";
import "../styles/Home.css";
import axios from "axios";

function Home({ user }) {

    const [notes, setNotes] = useState([]);
    
    useEffect(() => {
        const getNotes = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/notes/user/${user.id}`);
                setNotes(res.data);
            } catch (err) {
                console.error("Error getting all notes: ", err);
            }
        }
        getNotes();
    }, []);

    function handleAdd(note) {
        axios.post(`http://localhost:4000/notes/user/${user.id}`, note)
             .then(() => {
                axios.get(`http://localhost:4000/notes/user/${user.id}`)
                     .then((response) => {
                        setNotes(response.data);
                     });
             })
             .catch((error) => {
                console.error("Error adding new note: ", error);
             })       
    }

    function handleEdit(note) {
        axios.put(`http://localhost:4000/notes/${note.id}`, note)
             .then(() => {
                axios.get(`http://localhost:4000/notes/user/${user.id}`)
                     .then((response) => {
                        setNotes(response.data);
                     });
             })
             .catch((error) => {
                console.error("Error editing a note: ", error);
             });
    }

    function handleDelete(note) {
        axios.delete(`http://localhost:4000/notes/${note.id}`)
             .then(() => {
                axios.get(`http://localhost:4000/notes/user/${user.id}`).then((response) => {
                        setNotes(response.data);
                     });
             })
             .catch((error) => {
                console.error("Error deleting a note: ", error);
             });
    }

    return (
        <div className="home">
            <CreateArea onAdd={handleAdd}/>
            {notes.map((noteItem, index) => {
                return (
                    <Note 
                        key={index}
                        note={noteItem}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                );
            })}
            <ChatAvatar user={user} />
        </div>
    );
}

export default Home;
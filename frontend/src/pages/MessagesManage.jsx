import { useState, useEffect } from "react";
import "./MessagesManage.css";

const API_URL = "http://localhost:5000/api/messages";

function MessagesManage() {

    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("adminToken");


    // Load messages from database
    useEffect(() => {

        async function fetchMessages() {

            try {

                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.status === 401) {

                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("admin");

                    window.location.href = "/admin/login";
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load messages");
                }

                setMessages(data.messages || []);

            } catch (err) {

                console.error("Messages Error:", err);
                setError("Unable to load messages. Please try again.");

            } finally {

                setLoading(false);

            }

        }

        fetchMessages();

    }, [token]);


    // Format date
    function formatDate(date) {

        if (!date) return "Unknown date";

        return new Date(date).toLocaleDateString();

    }


    // View message and mark as read
    async function handleView(message) {

        setSelectedMessage({
            ...message,
            is_read: 1
        });

        if (message.is_read) return;

        try {

            const response = await fetch(`${API_URL}/${message.id}/read`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update message");
            }

            setMessages((previousMessages) =>
                previousMessages.map((item) =>
                    item.id === message.id
                        ? { ...item, is_read: 1 }
                        : item
                )
            );

        } catch (err) {

            console.error("Mark Read Error:", err);

            setSelectedMessage(message);

        }

    }


    // Delete message
    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete message");
            }

            setMessages((previousMessages) =>
                previousMessages.filter((item) => item.id !== id)
            );

            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }

            alert("Message deleted successfully!");

        } catch (err) {

            console.error("Delete Message Error:", err);

            alert(err.message || "Unable to delete message.");

        }

    }


    const unreadCount = messages.filter(
        (item) => !item.is_read
    ).length;


    return (

        <div className="messages-manage">

            <div className="manage-header">

                <h1>Messages Management</h1>

                <p>View and manage messages from your visitors.</p>

            </div>


            {/* Message Statistics */}

            <div className="message-stats">

                <div className="message-stat-card">

                    <h3>Total Messages</h3>

                    <h1>{messages.length}</h1>

                </div>


                <div className="message-stat-card">

                    <h3>Unread Messages</h3>

                    <h1>{unreadCount}</h1>

                </div>

            </div>


            {/* Inbox */}

            <div className="messages-list">

                <h2>Inbox</h2>


                {loading ? (

                    <p className="empty-message">
                        Loading messages...
                    </p>

                ) : error ? (

                    <p className="empty-message">
                        {error}
                    </p>

                ) : messages.length === 0 ? (

                    <p className="empty-message">
                        No messages available.
                    </p>

                ) : (

                    messages.map((message) => (

                        <div
                            className={`message-card ${!message.is_read ? "unread" : ""}`}
                            key={message.id}
                        >

                            <div className="message-details">

                                <h3>

                                    {message.name}

                                    {!message.is_read && (
                                        <span className="new-badge">
                                            NEW
                                        </span>
                                    )}

                                </h3>


                                <p>{message.email}</p>


                                {message.subject && (
                                    <p>
                                        <strong>Subject:</strong> {message.subject}
                                    </p>
                                )}


                                <p className="message-preview">
                                    {message.message}
                                </p>


                                <small>
                                    {formatDate(message.created_at)}
                                </small>

                            </div>


                            <div className="message-actions">

                                <button
                                    className="view-btn"
                                    onClick={() => handleView(message)}
                                >
                                    View
                                </button>


                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(message.id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>


            {/* Message Details Modal */}

            {selectedMessage && (

                <div className="message-modal">

                    <div className="message-modal-content">

                        <button
                            className="close-modal"
                            onClick={() => setSelectedMessage(null)}
                        >
                            ✕
                        </button>


                        <h2>Message Details</h2>


                        <p>
                            <strong>Name:</strong> {selectedMessage.name}
                        </p>


                        <p>
                            <strong>Email:</strong> {selectedMessage.email}
                        </p>


                        {selectedMessage.subject && (
                            <p>
                                <strong>Subject:</strong> {selectedMessage.subject}
                            </p>
                        )}


                        <p>
                            <strong>Date:</strong>{" "}
                            {formatDate(selectedMessage.created_at)}
                        </p>


                        <div className="full-message">

                            <strong>Message:</strong>

                            <p>{selectedMessage.message}</p>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default MessagesManage;
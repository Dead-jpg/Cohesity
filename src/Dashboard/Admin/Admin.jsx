import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
    FaUserCheck,
    FaUserTimes,
    FaHourglassHalf,
    FaSearch,
    FaArrowLeft,
    FaTrashAlt,
    FaCalendarAlt,
    FaBuilding,
    FaEnvelope,
    FaPhoneAlt,
    FaGlobe
} from "react-icons/fa";
import {
    getRegistrations,
    updateRegistrationStatus,
    deleteRegistration
} from "../../utils/db";
import "./Admin.css";
import Banner1 from "../../assets/banner1.png";

const Admin = () => {
    const [registrations, setRegistrations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [notification, setNotification] = useState(null);
    const [emailSentInfo, setEmailSentInfo] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const data = await getRegistrations();

                setRegistrations(data.reverse());
            } catch (error) {
                console.error("Failed to load registrations:", error);
                triggerNotification("Failed to fetch registrations from API server.", "error");
            }
        };
        fetchRegistrations();
    }, []);

    const triggerNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    const sendApprovalEmail = async (reg) => {
        if (!reg || !reg.email) return;
        try {
            const emailBody = `Dear ${reg.firstName} ${reg.lastName},

Your registration for Catalyst Tour: Mumbai has been approved! 

We are thrilled to invite you to join us. Please find the venue details below:

Venue Details:
Sofitel Mumbai BKC
C 57, Bandra Kurla Complex,
Mumbai, Maharashtra 400051

See you at the event!

Best regards,
Cohesity Catalyst Team`;

            setEmailSentInfo({
                recipient: reg.email,
                subject: "Registration Approved - Catalyst Tour: Mumbai",
                body: emailBody,
                previewUrl: null
            });

            fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    service_id: 'service_7hc5stu',
                    template_id: 'template_p44ch7q',
                    user_id: 'dZOxFJZEqZRwwmVi3',
                    template_params: {
                        to_name: `${reg.firstName} ${reg.lastName}`,
                        to_email: reg.email,
                        subject: "Registration Approved - Catalyst Tour: Mumbai",
                        message: emailBody
                    }
                })
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const text = await response.text();
                        console.error("EmailJS failed with error:", text);
                    } else {
                        console.log("EmailJS sent successfully!");
                    }
                })
                .catch(e => console.error("EmailJS error:", e));
        } catch (error) {
            console.error("Failed to send approval email:", error);
        }
    };

    const sendDisapprovalEmail = async (reg) => {
        if (!reg || !reg.email) return;
        try {
            const emailBody = `Dear ${reg.firstName} ${reg.lastName},

We regret to inform you that your registration status for Catalyst Tour: Mumbai has been updated to Disapproved.

We sincerely apologize for the inconvenience from our side, but your registration was disapproved due to Capacity constraints or other valid logistical factors.

Thank you for your interest and understanding.

Best regards,
Cohesity Catalyst Team`;

            setEmailSentInfo({
                recipient: reg.email,
                subject: "Registration Update: Catalyst Tour Mumbai",
                body: emailBody,
                previewUrl: null
            });

            fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    service_id: 'service_7hc5stu',
                    template_id: 'template_p44ch7q',
                    user_id: 'dZOxFJZEqZRwwmVi3',
                    template_params: {
                        to_name: `${reg.firstName} ${reg.lastName}`,
                        to_email: reg.email,
                        subject: "Registration Disapproved - Catalyst Tour: Mumbai",
                        message: emailBody
                    }
                })
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const text = await response.text();
                        console.error("EmailJS failed with error:", text);
                    } else {
                        console.log("EmailJS sent successfully!");
                    }
                })
                .catch(e => console.error("EmailJS error:", e));
        } catch (error) {
            console.error("Failed to send disapproval email:", error);
        }
    };

    const handleApprove = async (id, name) => {
        try {
            await updateRegistrationStatus(id, "Approved");
            setRegistrations((prev) =>
                prev.map((reg) => (reg.id === id ? { ...reg, status: "Approved" } : reg))
            );
            triggerNotification(`${name} has been approved.`, "success");

            const reg = registrations.find((r) => r.id === id);
            if (reg) {
                sendApprovalEmail(reg);
            }
        } catch (error) {
            console.error("Failed to approve:", error);
            triggerNotification(`Failed to approve ${name}.`, "error");
        }
    };
    const handleDisapprove = async (id, name) => {
        try {
            await updateRegistrationStatus(id, "Disapproved");
            setRegistrations((prev) =>
                prev.map((reg) => (reg.id === id ? { ...reg, status: "Disapproved" } : reg))
            );
            triggerNotification(`${name} has been disapproved.`, "warning");

            const reg = registrations.find((r) => r.id === id);
            if (reg) {
                sendDisapprovalEmail(reg);
            }
        } catch (error) {
            console.error("Failed to disapprove:", error);
            triggerNotification(`Failed to disapprove ${name}.`, "error");
        }
    };
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the registration for ${name}?`)) {
            try {
                await deleteRegistration(id);
                setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
                triggerNotification(`Deleted registration for ${name}.`, "error");
            } catch (error) {
                console.error("Failed to delete registration:", error);
                triggerNotification(`Failed to delete ${name}.`, "error");
            }
        }

    };

    const totalCount = registrations.length;
    const approvedCount = registrations.filter((r) => r.status === "Approved").length;
    const pendingCount = registrations.filter((r) => r.status === "Pending").length;
    const disapprovedCount = registrations.filter((r) => r.status === "Disapproved").length;

    const filteredRegistrations = registrations.filter((reg) => {
        const fullName = `${reg.firstName} ${reg.lastName}`.toLowerCase();
        const matchesSearch =
            fullName.includes(searchTerm.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.invitedBy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || reg.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="admin-dashboard">

            {notification && (
                <div className={`admin-toast ${notification.type}`}>
                    <div className="toast-content">
                        <span className="toast-icon">
                            {notification.type === "success" && <FaUserCheck />}
                            {notification.type === "warning" && <FaUserTimes />}
                            {notification.type === "error" && <FaTrashAlt />}
                        </span>
                        <p className="toast-message">{notification.message}</p>
                    </div>
                    <div className="toast-progress"></div>
                </div>
            )}


            <header className="admin-header">
                <div className="admin-header-container">
                    <div className="admin-logo-section">
                        <img src={Banner1} alt="Cohesity Logo" className="admin-logo-img" />
                        <div className="admin-title-badge">
                            <h1>CATALYST TOUR</h1>
                            <span className="badge-tag">ADMIN CONTROL</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="admin-main">
                <section className="dashboard-intro">
                    <div>
                        <h2>Mumbai Event Approval Panel</h2>
                        <p className="intro-subtitle">Review incoming applications and approve or disapprove guest access.</p>
                    </div>
                </section>


                <section className="control-panel">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, company, email, or inviter..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={() => setSearchTerm("")}>
                                &times;
                            </button>
                        )}
                    </div>

                    <div className="filter-group">
                        {["All", "Pending", "Approved", "Disapproved"].map((status) => (
                            <button
                                key={status}
                                className={`filter-tab ${statusFilter === status ? "active" : ""}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                                <span className="filter-badge">
                                    {status === "All" && totalCount}
                                    {status === "Pending" && pendingCount}
                                    {status === "Approved" && approvedCount}
                                    {status === "Disapproved" && disapprovedCount}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>


                <section className="table-container">
                    {filteredRegistrations.length === 0 ? (
                        <div className="no-records">
                            <div className="no-records-icon">🔍</div>
                            <h4>No registrations found</h4>
                            <p>Try adjusting your search criteria or filter options.</p>
                        </div>
                    ) : (
                        <>

                            <div className="table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Attendee</th>
                                            <th>Company & Role</th>
                                            <th>Country</th>
                                            <th>Invited By</th>
                                            <th>Registered On</th>
                                            <th>Status</th>
                                            <th className="actions-header">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRegistrations.map((reg) => (
                                            <tr key={reg.id} className={`table-row row-${reg.status.toLowerCase()}`}>

                                                <td>
                                                    <div className="attendee-cell">
                                                        <span className="avatar">
                                                            {reg.firstName[0]}
                                                            {reg.lastName[0]}
                                                        </span>
                                                        <div className="attendee-details">
                                                            <div className="attendee-name">
                                                                {reg.firstName} {reg.lastName}
                                                            </div>
                                                            <div className="attendee-contact">
                                                                <span title="Email"><FaEnvelope /> {reg.email}</span>
                                                                <span title="Phone"><FaPhoneAlt /> {reg.phoneNumber}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>


                                                <td>
                                                    <div className="company-cell">
                                                        <div className="job-title">{reg.jobTitle}</div>
                                                        <div className="company-name">
                                                            <FaBuilding /> {reg.company}
                                                        </div>
                                                    </div>
                                                </td>


                                                <td>
                                                    <span className="country-tag">
                                                        <FaGlobe /> {reg.country || "N/A"}
                                                    </span>
                                                </td>


                                                <td>
                                                    <span className="inviter-text">{reg.invitedBy || "None"}</span>
                                                </td>


                                                <td>
                                                    <span className="date-text">
                                                        <FaCalendarAlt /> {formatDate(reg.registeredAt)}
                                                    </span>
                                                </td>


                                                <td>
                                                    <span className={`status-badge badge-${reg.status.toLowerCase()}`}>
                                                        {reg.status === "Pending" && <FaHourglassHalf className="spin-slow" />}
                                                        {reg.status === "Approved" && <FaUserCheck />}
                                                        {reg.status === "Disapproved" && <FaUserTimes />}
                                                        {reg.status}
                                                    </span>
                                                </td>


                                                <td className="actions-cell">
                                                    <div className="action-buttons">
                                                        {reg.status !== "Approved" && (
                                                            <button
                                                                className="action-btn approve"
                                                                onClick={() => handleApprove(reg.id, `${reg.firstName} ${reg.lastName}`)}
                                                                title="Approve Registration"
                                                            >
                                                                <FaUserCheck /> Approve
                                                            </button>
                                                        )}
                                                        {reg.status !== "Disapproved" && (
                                                            <button
                                                                className="action-btn disapprove"
                                                                onClick={() => handleDisapprove(reg.id, `${reg.firstName} ${reg.lastName}`)}
                                                                title="Disapprove Registration"
                                                            >
                                                                <FaUserTimes /> Disapprove
                                                            </button>
                                                        )}
                                                        {reg.status === "Disapproved" && (
                                                            < button
                                                                className="action-btn delete"
                                                                onClick={() => handleDelete(reg.id, `${reg.firstName} ${reg.lastName}`)}
                                                                title="Delete Registration Record"
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        )
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                            <div className="mobile-cards-grid">
                                {filteredRegistrations.map((reg) => (
                                    <div key={reg.id} className={`mobile-card card-${reg.status.toLowerCase()}`}>
                                        <div className="mobile-card-header">
                                            <div className="mobile-card-avatar-row">
                                                <span className="avatar">
                                                    {reg.firstName[0]}
                                                    {reg.lastName[0]}
                                                </span>
                                                <div>
                                                    <h4 className="card-name">{reg.firstName} {reg.lastName}</h4>
                                                    <span className={`status-badge badge-${reg.status.toLowerCase()}`}>
                                                        {reg.status}
                                                    </span>
                                                </div>
                                            </div>
                                            {reg.status === "Disapproved" && (
                                                <button
                                                    className="mobile-delete-btn"
                                                    onClick={() => handleDelete(reg.id, `${reg.firstName} ${reg.lastName}`)}
                                                    title="Delete Record"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            )}
                                        </div>

                                        <div className="mobile-card-body">
                                            <div className="card-info-item">
                                                <span className="card-info-label">Role & Company:</span>
                                                <span className="card-info-value">{reg.jobTitle} at <strong>{reg.company}</strong></span>
                                            </div>
                                            <div className="card-info-item">
                                                <span className="card-info-label">Email:</span>
                                                <span className="card-info-value">{reg.email}</span>
                                            </div>
                                            <div className="card-info-item">
                                                <span className="card-info-label">Phone:</span>
                                                <span className="card-info-value">{reg.phoneNumber}</span>
                                            </div>
                                            <div className="card-info-item">
                                                <span className="card-info-label">Country:</span>
                                                <span className="card-info-value">{reg.country}</span>
                                            </div>
                                            <div className="card-info-item">
                                                <span className="card-info-label">Invited By:</span>
                                                <span className="card-info-value">{reg.invitedBy}</span>
                                            </div>
                                            <div className="card-info-item">
                                                <span className="card-info-label">Registered On:</span>
                                                <span className="card-info-value">{formatDate(reg.registeredAt)}</span>
                                            </div>
                                        </div>

                                        <div className="mobile-card-actions">
                                            {reg.status !== "Approved" && (
                                                <button
                                                    className="action-btn approve"
                                                    onClick={() => handleApprove(reg.id, `${reg.firstName} ${reg.lastName}`)}
                                                >
                                                    <FaUserCheck /> Approve
                                                </button>
                                            )}
                                            {reg.status !== "Disapproved" && (
                                                <button
                                                    className="action-btn disapprove"
                                                    onClick={() => handleDisapprove(reg.id, `${reg.firstName} ${reg.lastName}`)}
                                                >
                                                    <FaUserTimes /> Disapprove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>

            <footer className="admin-footer">
                <p className="copyright">© 2026 Cohesity Catalyst Tour Admin Desk. Built for high-reliability event orchestration.</p>
            </footer>

            {emailSentInfo && (
                <div className="email-modal-overlay" onClick={() => setEmailSentInfo(null)}>
                    <div className="email-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="email-modal-header">
                            <div className="email-modal-title">
                                <span className="email-icon">📧</span>
                                <h3>Email Sent Automatically</h3>
                            </div>
                            <button className="email-close-btn" onClick={() => setEmailSentInfo(null)}>
                                &times;
                            </button>
                        </div>
                        <div className="email-modal-body">
                            <div className="email-meta-row">
                                <span className="meta-label">To:</span>
                                <span className="meta-value">{emailSentInfo.recipient}</span>
                            </div>
                            <div className="email-meta-row">
                                <span className="meta-label">Subject:</span>
                                <span className="meta-value">{emailSentInfo.subject}</span>
                            </div>
                            <hr className="email-divider" />
                            <div className="email-body-content">
                                {emailSentInfo.body.split('\n').map((line, idx) => (
                                    <p key={idx}>{line || '\u00A0'}</p>
                                ))}
                            </div>
                        </div>
                        <div className="email-modal-footer" style={{ gap: '12px' }}>
                            {emailSentInfo.previewUrl && (
                                <a
                                    href={emailSentInfo.previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-preview-link"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        background: '#ff33cc',
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        padding: '10px 24px',
                                        fontWeight: '700',
                                        fontSize: '13px',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    Open Web Inbox
                                </a>
                            )}
                            <button className="btn-ok" onClick={() => setEmailSentInfo(null)}>
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
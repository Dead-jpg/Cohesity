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

    const handleApprove = async (id, name) => {
        try {
            await updateRegistrationStatus(id, "Approved"); // this 
            setRegistrations((prev) =>
                prev.map((reg) => (reg.id === id ? { ...reg, status: "Approved" } : reg))
            );
            triggerNotification(`${name} has been approved.`, "success");
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
                    <div className="admin-header-actions">
                        <Link to="/" className="btn-back">
                            <FaArrowLeft /> BACK TO SITE
                        </Link>
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

                {/* Filters and Controls */}
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

                {/* Table & Content Area */}
                <section className="table-container">
                    {filteredRegistrations.length === 0 ? (
                        <div className="no-records">
                            <div className="no-records-icon">🔍</div>
                            <h4>No registrations found</h4>
                            <p>Try adjusting your search criteria or filter options.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
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
                                                {/* Attendee Details */}
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

                                                {/* Company & Role */}
                                                <td>
                                                    <div className="company-cell">
                                                        <div className="job-title">{reg.jobTitle}</div>
                                                        <div className="company-name">
                                                            <FaBuilding /> {reg.company}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Country */}
                                                <td>
                                                    <span className="country-tag">
                                                        <FaGlobe /> {reg.country || "N/A"}
                                                    </span>
                                                </td>

                                                {/* Invited By */}
                                                <td>
                                                    <span className="inviter-text">{reg.invitedBy || "None"}</span>
                                                </td>

                                                {/* Registered At */}
                                                <td>
                                                    <span className="date-text">
                                                        <FaCalendarAlt /> {formatDate(reg.registeredAt)}
                                                    </span>
                                                </td>

                                                {/* Status */}
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

                            {/* Mobile Card View (renders on small screens automatically via CSS) */}
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
                                            <button
                                                className="mobile-delete-btn"
                                                onClick={() => deleteRegistration(reg.id)}
                                                title="Delete Record"
                                            >
                                                <FaTrashAlt />
                                            </button>
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
        </div>
    );
};

export default Admin;
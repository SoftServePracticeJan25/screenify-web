import React from 'react';
import { IoMdClose } from "react-icons/io";
import styles from './TicketsInfoModal.module.css';

const TicketsInfoModal = ({ isOpen, onClose, ticket }) => {
    if (!isOpen || !ticket) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <IoMdClose />
                </button>

                <div className={styles.modalBody}>
                    <div className={styles.imageSection}>
                        <div className={styles.imageContainer}>
                            {ticket.imageUrl ? (
                                <img 
                                    src={ticket.imageUrl} 
                                    alt={ticket.movie} 
                                    className={styles.ticketImage}
                                />
                            ) : (
                                <div className={styles.imagePlaceholder}>
                                    <span>No image available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.detailsSection}>
                        <h2 className={styles.ticketTitle}>{ticket.movie}</h2>
                        
                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>Date & Time</span>
                            <span className={styles.infoValue}>{ticket.startTime}</span>
                        </div>

                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>Room</span>
                            <span className={styles.infoValue}>{ticket.room}</span>
                        </div>

                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>Price</span>
                            <span className={styles.infoValue}>{ticket.price}</span>
                        </div>

                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>Seat Number</span>
                            <span className={styles.infoValue}>A1</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TicketsInfoModal;
import React from 'react';
import { IoMdClose } from "react-icons/io";
import styles from './UsersInfoModal.module.css';

const UsersInfoModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <IoMdClose />
                </button>

                <div className={styles.userImageContainer}>
                    {user.image ? (
                        <img src={user.image} alt={user.username} className={styles.userImage} />
                    ) : (
                        <div className={styles.userPlaceholder}>No Image</div>
                    )}
                </div>

                <div className={styles.detailsSection}>
                    <div className={styles.infoGroup}>
                        <span className={styles.username}>{user.username}</span>
                    </div>

                    <div className={styles.infoGroup}>
                        <span className={styles.infoLabel}>User ID</span>
                        <span className={styles.infoValue}><br/>{user.id}</span>
                    </div>

                    <div className={styles.infoGroup}>
                        <span className={styles.infoLabel}>Reviews</span>
                        <span className={styles.infoValue}><br/>{user.reviewCount}</span>
                    </div>

                    <div className={styles.infoGroup}>
                        <span className={styles.infoLabel}>Transactions</span>
                        <span className={styles.infoValue}><br/>{user.transactionCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersInfoModal;
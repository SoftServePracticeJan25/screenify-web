import React from 'react';

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const UserAvatar = ({ src, username, className }) => {
  if (src && !src.includes('/api/placeholder')) {
    return <img src={src} alt={username} className={className} />;
  }

  return (
    <div 
      className={`flex items-center justify-center bg-purple-600 ${className}`}
      style={{ aspectRatio: '1' }}
    >
      <span className="text-white text-sm font-medium">
        {getInitials(username)}
      </span>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <UserAvatar 
          src={review.userImage} 
          username={review.username} 
          className="user-image"
        />
        <div className="header-info">
          <span className="username">{review.username}</span>
          <span className="id">ID: {review.userId}</span>
          <span className="separator">•</span>
          <span className="movie-title">{review.movieTitle}</span>
          <span className="id">ID: {review.movieId}</span>
        </div>
      </div>
      <div className="review-content">
        <p>{review.reviewText}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
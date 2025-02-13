// src/utils/genreUtils.js
export const getGenreIdByName = (name) => {
    const genreMap = {
        "Comedy": 1,
        "Action": 2,
        "Fantasy": 3,
        "Science-Fiction": 4,
        "Drama": 5,
        "Adventure": 6,
        "Documentary": 7
    };
    return genreMap[name] || null;
};

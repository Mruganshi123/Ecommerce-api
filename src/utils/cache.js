const cache = new Map();

const setCache = (key, value, ttl = 300000) => {
    cache.set(key, value);
    setTimeout(() => {
        cache.delete(key);
    }, ttl);
};

const getCache = (key) => {
    return cache.get(key);
};

const deleteCache = (key) => {
    cache.delete(key);
};

module.exports = { setCache, getCache, deleteCache };

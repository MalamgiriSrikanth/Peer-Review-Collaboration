import initialUsers from '../data/users.json'

const USERS_KEY = 'peer_collaboration_users'

/**
 * Persists and manages user data in localStorage
 */
export const userStorage = {
    /**
     * Get all users. Initializes from users.json if localStorage is empty.
     */
    getUsers: () => {
        const stored = localStorage.getItem(USERS_KEY)
        if (!stored) {
            localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers))
            return initialUsers
        }
        return JSON.parse(stored)
    },

    /**
     * Save updated users array to localStorage
     */
    saveUsers: (users) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    },

    /**
     * Add a new user
     */
    addUser: (user) => {
        const users = userStorage.getUsers()
        const newUser = {
            ...user,
            id: Date.now(),
            avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        }
        users.push(newUser)
        userStorage.saveUsers(users)
        return newUser
    },

    /**
     * Remove a user by ID
     */
    removeUser: (id) => {
        const users = userStorage.getUsers()
        const updated = users.filter(u => u.id !== id)
        userStorage.saveUsers(updated)
        return updated
    }
}

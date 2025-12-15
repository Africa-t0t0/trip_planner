export interface User {
    _id?: string; // MongoDB ID
    id: string;   // App logic ID
    username: string;
    name: string;
    email: string; // Keeping email for potential future use or compatibility
    password: string;
}
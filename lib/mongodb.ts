import { MongoClient } from 'mongodb';

if (!process.env.DB_USERNAME) {
    throw new Error('Please define DB_USERNAME in your .env file');
}

if (!process.env.DB_PASSWORD) {
    throw new Error('Please define DB_PASSWORD in your .env file');
}

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Connection string usando las variables del .env
const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@mongodb.fp1zlj8.mongodb.net/?appName=MongoDB`;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongoDBCache {
    client: MongoClient | null;
    promise: Promise<MongoClient> | null;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
    var mongodb: MongoDBCache;
}

let cached: MongoDBCache = global.mongodb;

if (!cached) {
    cached = global.mongodb = { client: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.client) {
        return cached.client;
    }

    if (!cached.promise) {
        cached.promise = MongoClient.connect(MONGODB_URI);
    }

    try {
        cached.client = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.client;
}

export async function getDatabase(dbName: string = 'santiago-trip') {
    const client = await connectToDatabase();
    return client.db(dbName);
}

import { PLACES } from '../data/places';

async function migratePlaces() {
    console.log('🚀 Starting places migration to MongoDB...');

    try {
        // First, delete all existing places
        console.log('🗑️  Clearing existing places...');
        const deleteResponse = await fetch('http://localhost:3000/api/places', {
            method: 'DELETE',
        });

        if (deleteResponse.ok) {
            const deleteResult = await deleteResponse.json();
            console.log(`✅ Deleted ${deleteResult.deletedCount} existing places`);
        }

        // Now insert all places
        console.log('📥 Inserting places...');
        const response = await fetch('http://localhost:3000/api/places', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(PLACES),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`✅ Successfully migrated ${result.insertedCount} places to MongoDB!`);
        console.log('📍 Places migrated:');
        PLACES.forEach(place => {
            console.log(`   - ${place.nombre} (ID: ${place.id})`);
        });
    } catch (error) {
        console.error('❌ Error migrating places:', error);
        process.exit(1);
    }
}

// Run the migration
migratePlaces();

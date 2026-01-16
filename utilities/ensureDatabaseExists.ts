
import pouchDBConnect from "@/utilities/pouchDbConnect";

// Add this function to ensure databases exist
const ensureDatabaseExists = async (databaseName: string, isRemote = false): Promise<void> => {
  try {
    const config = useRuntimeConfig();
    
    if (isRemote) {
      const baseUrl = config.public.couchDBUrl;
      const couchDBUsername = config.public.couchDBUsername;
      const couchDBPassword = config.public.couchDBPassword;
      
      // Check if remote DB exists, create if not
      try {
        const db = pouchDBConnect(
          `${baseUrl}/${databaseName}`,
          { skip_setup: false }
        );
        await db.info();
      } catch (error) {
        console.log(`Creating remote database: ${databaseName}`);
        // Create via CouchDB API with Authorization header
        const credentials = btoa(`${couchDBUsername}:${couchDBPassword}`);
        await fetch(`${baseUrl}/${databaseName}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
          }
        });
      }
    } else {
      // Local DB will be created automatically by PouchDB
      const db = pouchDBConnect(databaseName);
      await db.info();
    }
  } catch (error) {
    console.error(`Database setup error for ${databaseName}:`, error);
    throw error;
  }
};

export default ensureDatabaseExists;
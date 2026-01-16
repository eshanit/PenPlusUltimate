// Add a simple test connection function
const testCouchDBConnection = async (databaseName: string): Promise<boolean> => {
  try {
    const config = useRuntimeConfig();
    const couchDBUsername = config.public.couchDBUsername;
    const couchDBPassword = config.public.couchDBPassword;
    const baseUrl = config.public.couchDBUrl;
    
    // Create Basic Auth header
    const credentials = btoa(`${couchDBUsername}:${couchDBPassword}`);
    
    // Test connection to CouchDB root using Authorization header
    const response = await fetch(`${baseUrl}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      }
    });
    
    if (!response.ok) {
      console.error('CouchDB connection failed:', response.status);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('CouchDB test connection error:', error);
    return false;
  }
};

export default testCouchDBConnection;
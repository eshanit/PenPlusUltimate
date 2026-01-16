/**
 * Server middleware to proxy CouchDB requests
 * This avoids CORS issues by proxying requests through the Nuxt server
 */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Only proxy /couchdb/* paths
  if (!url.pathname.startsWith('/couchdb/')) {
    return;
  }

  let targetUrl = '';
  try {
    const config = useRuntimeConfig();
    console.log('[CouchDB Proxy] Config:', { couchDBUrl: config.public.couchDBUrl, username: config.public.couchDBUsername });
    const targetPath = url.pathname.replace('/couchdb/', '');
    targetUrl = `${config.public.couchDBUrl}/${targetPath}${url.search}`;

    const username = config.public.couchDBUsername;
    const password = config.public.couchDBPassword;
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    console.log(`[CouchDB Proxy] ${event.node.req.method} ${targetUrl}`);

    // Build headers
    const headers: Record<string, string> = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };

    // Copy relevant headers from client request
    const clientHeaders = event.node.req.headers;
    const headersToForward = ['accept', 'content-type', 'x-couch-id-only'];
    
    for (const header of headersToForward) {
      if (clientHeaders[header]) {
        headers[header] = String(clientHeaders[header]);
      }
    }

    // Get request body if present
    let body: string | undefined;
    if (event.node.req.method !== 'GET' && event.node.req.method !== 'HEAD') {
      const rawBody = await readRawBody(event);
      if (rawBody) {
        body = rawBody.toString();
      }
    }

    // Forward the request to CouchDB
    const response = await fetch(targetUrl, {
      method: event.node.req.method,
      headers,
      body
    });

    console.log(`[CouchDB Proxy] Response status: ${response.status}`);

    // Set response status
    setResponseStatus(event, response.status);

    // Copy response headers
    const responseHeaders = response.headers;
    responseHeaders.forEach((value, key) => {
      // Don't copy headers that can cause issues
      if (!['content-encoding', 'transfer-encoding', 'content-length'].includes(key.toLowerCase())) {
        setHeader(event, key, value);
      }
    });

    // Return response body
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      // For JSON responses, parse and return as JSON
      const data = await response.json();
      return data;
    } else {
      // For other content types, return as buffer
      return await response.arrayBuffer();
    }
  } catch (error) {
    console.error('[CouchDB Proxy] Error:', error);
    console.error('[CouchDB Proxy] Target URL:', targetUrl);
    console.error('[CouchDB Proxy] Full error details:', error instanceof Error ? error.stack : error);
    setResponseStatus(event, 503);
    return { error: 'Failed to connect to CouchDB server', details: String(error) };
  }
});

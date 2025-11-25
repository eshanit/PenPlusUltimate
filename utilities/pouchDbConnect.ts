import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import PouchAuth from "pouchdb-authentication";
import PouchHTTP from "pouchdb-adapter-http";

PouchDB.plugin(PouchAuth);
PouchDB.plugin(PouchHTTP);
PouchDB.plugin(PouchDBFind);

// Ensure global Promise is available for pouchdb-authentication
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Promise = Promise;
} else if (typeof window !== 'undefined') {
  (window as any).Promise = Promise;
}

const pouchDBConnect = (dbName: string, options?: any) => {

  return new PouchDB<any>(dbName, options);

};

export default pouchDBConnect;
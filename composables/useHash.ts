import { bcrypt } from 'hash-wasm';;

const useHash = async (data: string): Promise<string> => {
    try {
        const salt = new Uint8Array(16);
        window.crypto.getRandomValues(salt);

        const hash = await bcrypt({
            password: data,
            salt, // salt is a buffer containing random bytes
            costFactor: 11, // cost factor
            outputType: 'encoded', // return standard encoded string containing parameters needed to verify the key
        });

        return hash;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

export default  useHash;


import { defineStore } from "pinia";
import pouchDBConnect from "@/utilities/pouchDbConnect";
import type IMasterUser from "@/interfaces/IMasterUser";
import DatabaseNames from "@/constants/DatabaseNames";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import generateID from "@/utilities/generateID";
import useHash from "@/composables/useHash";
import { bcryptVerify } from "hash-wasm";
import Routes from "@/constants/Routes";



export const useAuthStore = defineStore("auth", () => {

    const user: Ref<IMasterUser | null> = ref(null)
    const isLoggedIn: Ref<boolean> = ref(false)
    const isRegistered: Ref<boolean> = ref(false)
    const isAuthenticated: Ref<boolean> = ref(false)
    const config = useRuntimeConfig();

    type CreateUser = Omit<IMasterUser, "_rev" | "searchIndex" | "updatedAt" | "updatedBy">

    const db = pouchDBConnect(DatabaseNames.USERS);
    const remoteDB = pouchDBConnect(`${config.public.couchDBUrl}/${DatabaseNames.USERS}`);
 
    /**
     * register a user
     */

    const registerUser = async (userRegData: CreateUser) => {
        try {
            const CreateUserData = {
                _id: generateID(),
                firstname: userRegData.firstname,
                lastname: userRegData.lastname,
                username: userRegData.username,
                password: await useHash(userRegData.password),
                terms: userRegData.terms,
            };

            console.log('CreateUser:', CreateUserData);

            await db.put(CreateUserData);
            await navigateTo(Routes.INDEX);

            db.sync(remoteDB, {
                live: true,
                retry: true,
            }).on("change", (change: any) => {
                console.log("something changed", change);
            });

            isRegistered.value = true;
        } catch (error) {
            console.error("register failed", error);
        }
    }

    /**
     *  Sign in a user
     */
    const signIn = async (userData: Pick<IMasterUser, "username" | "password">): Promise<boolean | void> => {
        try {
            db.createIndex({ index: { fields: ["username"] } });

            const response = await db.find({
                selector: {
                    username: userData.username,
                },
            });

            const isValid = await bcryptVerify({
                password: userData.password,
                hash: response.docs[0].password,
            });

            if (isValid) {
                localStorage.clear();

                const profileData = {
                    id: response.docs[0]._id,
                    firstname: response.docs[0].firstname,
                    lastname: response.docs[0].lastname,
                    username: response.docs[0].username,
                    searchIndex: (response.docs[0].firstname.concat(response.docs[0].lastname)).toLowerCase()
                };

                useProcessLocalStorage().store(LocalStorageKeys.PROFILE, profileData);
            }

            if (isValid) {
                const token = useCookie('token');
                token.value = generateID();
                isLoggedIn.value = isValid;
                isAuthenticated.value = isValid;

                await navigateTo(Routes.DASHBOARD);
            } else {
                await navigateTo(Routes.INDEX);
                alert('Wrong Credentials. Please try again');
            }

            return isValid;
        } catch (err) {
            console.log(err);
            await navigateTo(Routes.INDEX);
            alert('Wrong Credentials. Please try again');
            return false;
        }
    };

      /**
       * Signout a user
       */
      const signOut = async () => {
        localStorage.clear()
        isAuthenticated.value = false;
        isLoggedIn.value = false;
    
        const token = useCookie('token');
        token.value = null;
        await navigateTo(Routes.INDEX);
      }

    return { user, registerUser, signIn, signOut, isRegistered, isLoggedIn, isAuthenticated };

})
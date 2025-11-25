import LocalStorageKeys from "@/constants/LocalStorageKeys";
import type IMasterUser from "@/interfaces/IMasterUser";

//const useAuth = useAuthStore()
const user: IMasterUser | null = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE)

export default user
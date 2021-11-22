import router from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

const useIsAuth = () => {
    const [{ data }, fetching] = useMeQuery();
    useEffect(() => {
        if (!data?.me) {
            router.push("/login?next=" + router.pathname)
        }
    }, [data, router]);
}

export default useIsAuth;
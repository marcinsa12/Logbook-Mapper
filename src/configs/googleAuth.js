import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const authUser = async function() {
    const provider = new GoogleAuthProvider()
    const auth = getAuth();
    const savedToken = localStorage.getItem('googleAuthToken')
    const savedUser = localStorage.getItem('googleAuthUser')
    if(savedToken && savedUser) {
        const tokenInfo = await validateToken(savedToken);
        if(tokenInfo?.access_type === 'online')
        return {
            token: savedToken,
            user: JSON.parse(savedUser)
        }

    }
    const authResults = await signInWithPopup(auth, provider)
    const creds = GoogleAuthProvider.credentialFromResult(authResults);
    const token = creds.accessToken;
    const user = authResults.user
    localStorage.setItem('googleAuthToken', token)
    localStorage.setItem('googleAuthUser', JSON.stringify(user))

    return {token, user}
}

const validateToken = async function(token) {
    const validateTokenURL = import.meta.env.VITE_GOOGLE_TOKEN_VALIDATION
    const response = await fetch(validateTokenURL.concat(token))
    const tokenInfo = await response.json()
    return tokenInfo
}

export default authUser
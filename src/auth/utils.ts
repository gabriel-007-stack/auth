import axios from "axios";

export function createGoogleLoginUrl(params_: Record<string, string>, clientId: string, redirectUri: string, scope: string[] = ['profile', 'email'], state?: string): string {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const params = new URLSearchParams({
        ...params_,
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scope.join(' '),
        access_type: 'offline',
        include_granted_scopes: 'true',
    });

    if (state) {
        params.append('state', state);
    }

    return `${baseUrl}?${params.toString()}`;
}
interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token?: string;
}
export async function exchangeCodeForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
): Promise<TokenResponse> {
    const response = await axios.post<TokenResponse>('https://oauth2.googleapis.com/token', null, {
        params: {
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        },
    });

    return response.data;
}

interface UserProfile {
    id: string;
    email: string;
    name: string;
    picture: string;
}

export async function getUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await axios.get<UserProfile>('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
}

export async function handleLogin(code: string, redirectUri: string) {
    // Trocar o código de autorização por um token de acesso
    const tokenResponse = await exchangeCodeForToken(code, process.env.CLIENT_ID as any, process.env.SECRET_KEY as any, redirectUri + "/v3/login/confirm");
    const accessToken = tokenResponse.access_token;

    // Obter os dados do perfil do usuário
    return await getUserProfile(accessToken);
}

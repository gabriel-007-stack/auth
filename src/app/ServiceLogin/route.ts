import { createGoogleLoginUrl } from "@/auth/utils";
import { _GOOGLE_KEY, _KEY_TEMNP, _KEYS } from "@/config";

const authorizedOrigins = [
    "http://localhost:3000",
    "https://app-yoth.vercel.app"
];

export function GET(request: Request) {
    const dw = new URL(request.url)
    let url = new URL(dw.origin)

    const social_id = dw.searchParams.get("si");
    const type = dw.searchParams.get("source") ?? "auth";

    const hl = dw.searchParams.get("hl") || "en"
    const continue_ = dw.searchParams.get("continue") || dw.origin + "/account"
    url.searchParams.set("continue", continue_);
    url.searchParams.set("hl", hl);

    let _;
    try {
        _ = new URL(continue_);
    } catch (e) {
        return new Response(null, { status: 400 });
    }

    if (!authorizedOrigins.includes(_.origin) && _.origin !== dw.origin) {
        console.log(_);
        
        return new Response(null, { status: 403 })
    }

    if (social_id && _KEYS.includes(social_id)) {

        switch (social_id) {
            case _GOOGLE_KEY:
                process.env.CLIENT_ID && (url = new URL(createGoogleLoginUrl({ hl }, process.env.CLIENT_ID, (new URL("/v3/login/confirm", dw.origin)).href)))
                break;
        }
    } else {
        url.pathname = "/v3/login/select";
        return Response.redirect(url)
    }
    const redirectResponse = Response.redirect(url, 302);
    const headers = new Headers(redirectResponse.headers);
    headers.set('Set-Cookie', `${_KEY_TEMNP}=${btoa(`${btoa(encodeURIComponent(continue_))}|${hl}|${type}`)}; Path=/; HttpOnly; Max-Age=86400`);

    const newResponse = new Response(redirectResponse.body, {
        status: redirectResponse.status,
        statusText: redirectResponse.statusText,
        headers: headers
    });

    return newResponse;
}
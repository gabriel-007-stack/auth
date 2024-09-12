import { handleLogin } from "@/auth/utils";
import { _Cookie_Auth_key, _KEY_TEMNP } from "@/config";
import pool from "@/database";
import { createHash, randomBytes } from "crypto";
import { cookies } from 'next/headers'

interface User {
    sub: string;
    name: string;
    email: string;
    picture: string;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const [] = [];
    let cont;
    let hl_ = "en";
    let type = undefined;
    try {
        const [url, hl, m] = atob(cookies().get(_KEY_TEMNP)?.value ?? "").split("|");
        cont = new URL(atob(url))
        hl_ = hl ?? "en"
        type = m
    } catch (error) { }
    cont ??= new URL("/account", url.origin)
    cont.searchParams.set("hl", hl_);
    if (!code) {
        return new Response("Code is required", { status: 400 });
    }

    const user = await handleLogin(code, url.origin) as unknown as User | undefined;

    if (!user) {
        return new Response("Invalid or expired code", { status: 403 });
    }

    const { sub, name, email } = user;
    try {
        const data = (await pool.query("SELECT sid, auth FROM auth_.user WHERE sid = $1", [sub])).rows[0]

        if (data) {
            return redirect(cont)
        }

        // User does not exist, create a new record
        const auth = generateHashFromRandomBytes(32);
        const newUser = {
            name,
            email,
            sid: sub,
            auth
        };

        const { rows: [newUser_] } = await pool.query(`INSERT INTO auth_.user (name, email, sid, auth) VALUES ($1, $2, $3, $4);`, [name, email, sub, auth])


        return redirect(cont, auth, type)
    } catch (error) {
        return new Response(`Internal Server Error`, { status: 500 });
    }
}

function generateHashFromRandomBytes(byteSize: number, hashAlgorithm: string = 'sha256'): string {
    const randomData = randomBytes(byteSize);
    const hash = createHash(hashAlgorithm);
    hash.update(randomData);
    return hash.digest('base64');
}

function redirect(url: URL, auth?: string, type?: string) {
    
    if (type) {
        if (!(type === "streaming" || type === "auth")) {
            return new Response("service: "+type+"\n no is authrized", { status: 403 })
        }
        if(type !== "auth" && auth){
            url.searchParams.set("token", auth)
            url.searchParams.set("t", String(Date.now()))
        }
    }
    const redirectResponse = Response.redirect(url, 302);
    const headers = new Headers(redirectResponse.headers);
    headers.set('Set-Cookie', `${_Cookie_Auth_key}=${auth} Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=86400`);

    const newResponse = new Response(redirectResponse.body, {
        status: redirectResponse.status,
        statusText: redirectResponse.statusText,
        headers: headers
    });
    return newResponse;
}
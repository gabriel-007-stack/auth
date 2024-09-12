"use client"
import Box from "@/components/modal/confirmation"
import "./index.css"
import Image from "next/image";
import { geti18n } from "@/components/i18n";
import { useRouter } from 'next/router';
import { _GOOGLE_KEY } from "@/config";
interface Item {
    color: string;
    KEY: string;
    S_ID: string;
    image: any;
    name: string;
}

const google: Item = {
    color: "#fff",
    KEY: "LOGIN_WITH_GOOGLE",
    S_ID: _GOOGLE_KEY,
    name: "Google",
    image: require("../../../../../public/social/google.png")
}
const services: Item[] = [google]

export default function ({
    searchParams,
}: {
    searchParams?: Record<string, string>
}) {

    const { hl: lang = "en" } = searchParams ?? {}
    let url_continue = "/ServiceLogin?";
    for (const [key, value] of Object.entries(searchParams ?? {})) {
        url_continue += `${key}=${encodeURIComponent(value)}&`
    }
    return (
        <Box descripton={geti18n("SOCIAL_DESCRIPTION", { lang })} title={geti18n("SOCIAL_TITLE", { lang })}>
            {services.map(({ image, KEY, S_ID, name }) => {
                return (
                    <a
                        key={KEY}
                        title={name}
                        href={url_continue + "si=" + S_ID}
                        className="item-social-login"
                    >
                        <div
                            className="social-login-details">
                            <Image
                                src={image}
                                alt={name}
                                width={32}
                                className="social-login-image"
                            />
                        </div>
                        <div>{name}</div>
                    </a>
                )
            })}
        </Box>
    )
}
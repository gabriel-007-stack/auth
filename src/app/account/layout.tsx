"use client";
import Image from "next/image";
import { ContentItem, Header, ImageProfile, SubHeader, TextMain } from "./styles";
import BottomBar from "@/components/bottomBar";
import { geti18n } from "@/components/i18n";


export default function LayoutAccount({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            <Header>
                <SubHeader>
                    <div>
                        <ImageProfile>
                            <Image
                                alt="Profile"
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                                width={32}
                                height={32}
                                src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                            ></Image>
                        </ImageProfile>
                    </div>
                    <TextMain>{geti18n("ACCOUNT_HELLO_USER", { lang: "en", context: { name: "test" } })}</TextMain>
                </SubHeader>
                <BottomBar></BottomBar>
            </Header>
            <ContentItem>{children}</ContentItem>
        </div>
    );
}


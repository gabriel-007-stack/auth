"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function BottomBar({ children }: Readonly<{
    children?: React.ReactNode;
}>) {
    const router = useRouter();
    const btns = useRef(null);
    const [index, setIndex] = useState(0)
    const [left, setLeft] = useState(0)
    const buttons: [string, string, boolean?][] = [["Home", "/account"], ["User info", "/account/info"]]
    const handleClick = (href: string, router: AppRouterInstance, index_: number) => {
        return (e: Event) => {
            (e.target as any).blur()
            e.preventDefault()
            router.push(href)
            setIndex(index_)
        }
    }
    useEffect(() => {
        const el = (btns.current as unknown as HTMLElement);
        if (el) {
            const w = el.childNodes[index] as HTMLElement;
            if (w) {
                const width = w.clientWidth;
                const left = w.offsetLeft;
                setLeft(left + (width - 24) / 2)
            }
        }
    }, [index])
    const a = () => {
        const f = buttons.findIndex(([a, b]) => b === location.pathname);
        f > -1 && (setIndex(f))
    }
    useEffect(() => {
        a()
        addEventListener("resize", a)
        addEventListener("popstate", a)
        return () => (addEventListener("resize", a), removeEventListener("popstate", a))
    }, [])
    return (
        <HeaderBottom>
            <HeaderButtoms ref={btns}>
                {buttons.map(([name, href], index) => (<FLINK
                    href={href}
                    key={index}
                    onClick={handleClick(href, router, index) as Function}
                >
                    {name}
                </FLINK>))}
                <HeaderLine style={{ transform: `translateX(${left}px)` }} />
            </HeaderButtoms>
        </HeaderBottom>
    )
}

const HeaderBottom = styled.div`
height: 36px;
position: relative;
align-items: center;
width: 100%;
display: flex;
justify-content:center;
`
const HeaderButtoms = styled.div`
height: 36px;
display: flex;
align-items: center;
flex-direction: row;
width: 100%;
max-width: 560px;
margin: 0 max(auto, 16px);
`
const HeaderLine = styled.div`
height: 4px;
width: 24px;
position: absolute;
border-radius: 2px;
background: red;
left: 0;
bottom: 2px;
transition: .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`
const FLINK = styled.a`
height: 46px;
display:flex;
align-items: center;
outline: 4px #213;
min-width: 20px;
padding: 0 16px;
position:relative;          
justify-content: center;
margin:0 2px;
&::after{
    border-radius: 2px;
    height:4px;
    width: 4px;
    transition: .6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    bottom: 2px;
    background: #8888;
    content: "";
    opacity:0;
    position:absolute;
    bottom: 7px;
}
&:hover::after {
    width: 20px;
    opacity:.7;
}
&:focus::after {
    width: 20px;
    opacity:1;
}
&:active, 
&:focus,
&:hover
{
    background:#82828375;
    border-radius:8px
}
`

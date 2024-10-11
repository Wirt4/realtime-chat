'use client'
import {FC} from "react";
import Link from "next/link";
import {Icon, Icons} from "@/components/Icons";

export interface navbarListItemProps {
    href: string;
    Icon: Icon;
    name: string;
    id?: number
}

const NavbarListItem: FC<navbarListItemProps> =  (props) =>{
    const Icon = Icons[props.Icon]
    return <li>
        <Link href={props.href}><span><Icon aria-label={props.Icon as string}/></span></Link>
        <span>{props.name}</span>
    </li>
}

export default NavbarListItem

'use client'
import {FC} from "react";
import Link from "next/link";
import {Icon, Icons} from "@/components/Icons";
import navBarListItemClassNames from "@/app/(dashboard)/navBarListItemClassNames";

export interface navbarListItemProps {
    href: string;
    Icon: Icon;
    name: string;
    id?: number
}

const NavbarListItem: FC<navbarListItemProps> =  (props) =>{
    const Icon = Icons[props.Icon]
    return <li>
        <Link href={props.href} className={navBarListItemClassNames.Link.className}>
            <span className={navBarListItemClassNames.Link.span.className}>
                <Icon className={navBarListItemClassNames.Link.span.Icon.className} aria-label={props.Icon as string}/>
            </span>
        </Link>
        <span className={navBarListItemClassNames.span.className}>{props.name}</span>
    </li>
}

export default NavbarListItem;

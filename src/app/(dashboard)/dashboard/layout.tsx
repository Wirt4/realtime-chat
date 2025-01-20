import React, { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Session } from "next-auth";
import { dashboardDataFactory } from "@/services/dashboard/factory";
import { aDashboardData } from "@/services/dashboard/abstract";
import { SidebarProps } from "@/components/Sidebar/interface";
import Sidebar from "@/components/Sidebar/component";


interface LayoutProps {
    children: ReactNode
}

const Layout = async ({ children }: LayoutProps = { children: null }) => {
    const dashboardData: aDashboardData = dashboardDataFactory();
    let session: Session | null = null;

    try {
        session = await dashboardData.getSession();
    } catch {
        notFound();
    }

    const sidebarProps: SidebarProps = await dashboardData.getSidebarProps(session as Session);
    return <div className='dashboard-window'>
        <Sidebar{...sidebarProps} />
        {children}
    </div>
}



export default Layout;

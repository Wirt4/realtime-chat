import { SidebarProps } from "@/components/Sidebar/interface";
import { Session } from "next-auth";

export abstract class aDashboardData {
    abstract getSession(): Promise<Session>
    abstract getSidebarProps(session: Session): Promise<SidebarProps>
}
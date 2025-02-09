import { DashboardData } from "./dashboardData";
import { aDashboardData } from "./abstract";
import { db } from "@/lib/db";
import { DashboardFacade } from "@/repositories/dashboardFacade/implementation"

export function dashboardDataFactory(): aDashboardData {
    const facade = new DashboardFacade(db)
    return new DashboardData(facade);
}

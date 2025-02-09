import {NextResponse} from "next/server";

export class NextResponseWrapper {
    static next():  NextResponse<unknown> {
        return NextResponse.next();
    }

    static redirect( url: URL): NextResponse<unknown> {
        return NextResponse.redirect(url);
    }
}

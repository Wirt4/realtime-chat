import myGetServerSession from "@/lib/myGetServerSession";

export async function POST(req:string) {
    if ( await myGetServerSession()){
        return new Response('Invalid Request payload', { status: 421 })
    }
    return new Response('Unauthorized', { status: 401 })
}

import myGetServerSession from "@/lib/myGetServerSession";

export abstract class AbstractController{
    async getUserId(): Promise<string | boolean> {
        const session = await myGetServerSession();
        return session?.user.id || false
    }

    respond(message: string, status: number): Response {
        return new Response(message, {status}) as Response
    }

    unauthorized(): Response {
        return this.respond('Unauthorized', 401)
    }

    ok(): Response {
        return this.respond('OK', 200)
    }
}

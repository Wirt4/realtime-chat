import { db } from "@/lib/db";
import myGetServerSession from "@/lib/myGetServerSession";
import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";
import { UserRepository } from "@/repositories/user/implementation";
import { chatProfileParticpantSchema } from "@/schemas/chatProfileParticipantSchema";
import { ChatProfileService } from "@/services/chatProfile/implementation";

export class ChatProfileController {
    //TODO: live test 
    async getChatIdFromUsers(request: Request): Promise<Response> {
        const session = await myGetServerSession();
        if (!session) {
            return new Response("", { status: 401 });
        }
        let participantsSet: Set<string>;
        try {
            participantsSet = await this.parseSet(request);
        } catch {
            return new Response("", { status: 400 });
        }
        const service = this.createService();
        await service.loadProfileFromUsers(participantsSet);
        const chatId = service.getChatId();
        return new Response(JSON.stringify({ chatId }));
    }

    async getProfile(request: Request): Promise<Response> {
        if (request.method === "GET") {
            return new Response(JSON.stringify({}), { status: 400 });
        }
        return new Response(JSON.stringify({}), { status: 405 });
    }

    private createService(): ChatProfileService {
        const chatRepo = new ChatProfileRepository(db);
        const userRepo = new UserRepository(db);
        const service = new ChatProfileService(chatRepo, userRepo);
        return service;
    }

    private async parseSet(request: Request): Promise<Set<string>> {
        const body = await request.json();
        const participants = chatProfileParticpantSchema.parse(body).participants;
        return new Set(participants);
    }
}

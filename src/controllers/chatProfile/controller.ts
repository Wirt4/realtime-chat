import { db } from "@/lib/db";
import myGetServerSession from "@/lib/myGetServerSession";
import { Utils } from "@/lib/utils";
import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";
import { UserRepository } from "@/repositories/user/implementation";
import { chatProfileParticpantSchema } from "@/schemas/chatProfileParticipantSchema";
import { ChatProfileService } from "@/services/chatProfile/implementation";

export class ChatProfileController {
    //TODO: live test 
    async getChatIdFromUsers(request: Request): Promise<Response> {
        const session = await myGetServerSession();
        if (!session) {
            return this.respond("", 401);
        }
        let participantsSet: Set<string>;
        try {
            participantsSet = await this.parseSet(request);
        } catch {
            return this.respond("", 400);
        }
        const service = this.createService();
        await service.loadProfileFromUsers(participantsSet);
        const chatId = service.getChatId();
        return this.respond({ chatId });
    }

    async getProfile(request: Request): Promise<Response> {
        if (request.method !== "GET") {
            return this.respond("", 405);
        }

        const url = new URL(request.url);
        const chatId = url.searchParams.get("id");
        if (!chatId || !Utils.isValidChatId(chatId)) {
            return this.respond("", 400);
        }

        const session = await myGetServerSession();
        if (!session) {
            return this.respond("", 401);
        }

        const service = this.createService();
        const fetchedData = await service.getProfile(chatId);
        if (!fetchedData) {
            return this.respond({ data: null });
        }
        const members: string[] = Array.from(fetchedData.members);
        const data = { members, id: fetchedData.id };
        return this.respond({ data });
    }

    private async respond(content: any, status: number = 200): Promise<Response> {
        return new Response(JSON.stringify(content), { status });
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

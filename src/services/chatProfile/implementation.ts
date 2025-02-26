import { aIdGeneratorService } from "../idGenerator/abstract";
import { aChatProfileService } from "./abstract";
import { IdGeneratorService } from "../idGenerator/implementation";
import repositoryFacadeFactory from "./repositoryFacadeFactory";
import chatProfileRepositoryFacade from "./repositoryFacade";

export class ChatProfileService implements aChatProfileService {
    private static readonly CHAT_NOT_CREATED_ERROR = "Chat not yet created";
    private idGenerator: aIdGeneratorService;
    private chatId: string | null;
    private repositoryFacade: chatProfileRepositoryFacade;

    constructor(idGenerator: aIdGeneratorService = new IdGeneratorService()) {
        this.idGenerator = idGenerator;
        this.chatId = null;
        this.repositoryFacade = repositoryFacadeFactory();
    }

    async getProfile(chatId: string): Promise<ChatProfile> {
        return this.repositoryFacade.getChatProfile(chatId);
    }

    async loadProfileFromUsers(users: Set<string>): Promise<void> {
        let intersection: Set<string> | null = null;

        for (const userId of users) {
            const userChats = await this.repositoryFacade.getUserChats(userId);
            intersection = intersection ? this.setIntersection(intersection, userChats) : userChats;
        }

        this.chatId = "";

        if (intersection) {
            for (const chatId of intersection) {
                const profile = await this.repositoryFacade.getChatProfile(chatId);
                if (profile.members.size === users.size) {
                    this.chatId = chatId;
                    break;
                }
            }
        }
    }

    async getUsers(chatId: string): Promise<Set<User>> {
        try {
            const profile = await this.repositoryFacade.getChatProfile(chatId);
            return this.fetchUsers(profile);
        } catch {
            return new Set();
        }
    }

    private async fetchUsers(profile: ChatProfile): Promise<Set<User>> {
        const userSet: Set<User> = new Set();
        const nullMembers: Set<string> = new Set();

        for (const userId of profile?.members || []) {
            try {
                const user = await this.repositoryFacade.getUser(userId);
                if (!user) throw new Error();
                userSet.add(user);
            } catch {
                nullMembers.add(userId);
            }
        }

        if (nullMembers.size > 0) {
            await this.UpdateRepository(profile, nullMembers);
        }

        return userSet;
    }

    async createChat(members: Set<string>): Promise<void> {
        this.chatId = this.idGenerator.newId();
        await this.repositoryFacade.createChatProfile(this.chatId, members);
    }

    async addUserToChat(userId: string): Promise<void> {
        if (this.chatId === null) throw new Error(ChatProfileService.CHAT_NOT_CREATED_ERROR);
        await this.repositoryFacade.addChatMember(this.chatId, userId);
    }

    getChatId(): string {
        if (this.chatId === null) throw new Error(ChatProfileService.CHAT_NOT_CREATED_ERROR);
        return this.chatId;
    }

    private setIntersection(set1: Set<string>, set2: Set<string>): Set<string> {
        if (!set1?.size || !set2?.size) return new Set();
        return new Set([...set1].filter(x => set2.has(x)));
    }

    private async UpdateRepository(profile: ChatProfile, nullMembers: Set<string>): Promise<void> {
        profile.members = new Set([...profile.members].filter(x => !nullMembers.has(x)));
        return this.repositoryFacade.overwriteProfile(profile);
    }
}

import { aIdGeneratorService } from "../idGenerator/abstract";
import { aChatProfileService } from "./abstract";
import { IdGeneratorService } from "../idGenerator/implementation";
import repositoryFacadeFactory from "./repositoryFacadeFactory";
import chatProfileRepositoryFacade from "./repositoryFacade";

export class ChatProfileService implements aChatProfileService {
    private idGenerator: aIdGeneratorService
    private chatId: string | null;
    private err = "Chat not yet created";
    private repositoryFacade: chatProfileRepositoryFacade;

    constructor(idGenerator: aIdGeneratorService = new IdGeneratorService()
    ) {
        this.idGenerator = idGenerator;
        this.chatId = null;
        this.repositoryFacade = repositoryFacadeFactory();
    }

    async getProfile(chatId: string): Promise<ChatProfile> {
        return this.repositoryFacade.getChatProfile(chatId);
    }

    async loadProfileFromUsers(users: Set<string>): Promise<void> {
        let intersection: Set<string> = new Set();
        let firstIteration = true;

        await users.forEach(async (userId) => {
            const userChats = await this.repositoryFacade.getUserChats(userId);
            if (firstIteration) {
                intersection = userChats;
                firstIteration = false;
            } else {
                intersection = this.setIntersection(intersection, userChats);
            }
        });

        this.chatId = "";

        await intersection.forEach(async (chatId) => {
            const profile = await this.repositoryFacade.getChatProfile(chatId);
            if (profile.members.size == users.size) {
                this.chatId = chatId;
            }
        });
    }

    async getUsers(chatId: string): Promise<Set<User>> {
        const userSet: Set<User> = new Set();
        let profile: ChatProfile;

        try {
            profile = await this.repositoryFacade.getChatProfile(chatId);
        } catch {
            return userSet;
        }

        const nullMembers: Set<string> = new Set();
        let currentUser: User;
        if (profile?.members) {
            for (const userId of profile.members) {
                try {
                    currentUser = await this.repositoryFacade.getUser(userId);
                    if (currentUser === null) {
                        throw new Error("User not found");
                    }
                    userSet.add(currentUser);
                }
                catch {
                    nullMembers.add(userId);
                }
            }
        }

        if (nullMembers.size > 0) {
            await this.UpdateRepository(profile, nullMembers);
        }

        return userSet;

    }

    async createChat(): Promise<void> {
        this.chatId = this.idGenerator.newId();
        await this.repositoryFacade.createChatProfile(this.chatId);
    }

    async addUserToChat(userId: string): Promise<void> {
        if (this.chatId !== null) {
            await this.repositoryFacade.addChatMember(this.chatId, userId);
            return
        }
        throw this.err
    }

    getChatId(): string {
        if (this.chatId === null) {
            throw this.err;
        }
        return this.chatId;
    }

    private setIntersection(set1: Set<string>, set2: Set<string>): Set<string> {
        if (!set1 || !set2) {
            return new Set();
        }
        const i: Set<string> = new Set();
        for (const x of set1) {
            if (set2.has(x)) {
                i.add(x);
            }
        }
        return i;
    }

    private async UpdateRepository(profile: ChatProfile, nullMembers: Set<string>): Promise<void> {
        profile.members = new Set([...profile.members].filter(x => ![...nullMembers].includes(x)));
        return this.repositoryFacade.overwriteProfile(profile);
    }
}

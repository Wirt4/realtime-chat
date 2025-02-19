import { aChatProfileRepository } from "@/repositories/chatProfile/abstract";
import { aIdGeneratorService } from "../idGenerator/abstract";
import { aChatProfileService } from "./abstract";
import { IdGeneratorService } from "../idGenerator/implementation";
import { aUserRepository } from "@/repositories/user/abstract";

export class ChatProfileService implements aChatProfileService {
    private idGenerator: aIdGeneratorService
    private chatId: string | null;
    private profileRepository: aChatProfileRepository;
    private userRepository: aUserRepository;
    private err = "Chat not yet created";

    constructor(
        chatProfileRepository: aChatProfileRepository,
        userRepository: aUserRepository,
        idGenerator: aIdGeneratorService = new IdGeneratorService()
    ) {
        this.idGenerator = idGenerator;
        this.profileRepository = chatProfileRepository;
        this.chatId = null;
        this.userRepository = userRepository;
    }

    async getProfile(chatId: string): Promise<ChatProfile> {
        return this.profileRepository.getChatProfile(chatId);
    }

    async loadProfileFromUsers(users: Set<string>): Promise<void> {
        let intersection: Set<string> = new Set();
        let firstIteration = true;

        await users.forEach(async (userId) => {
            const userChats = await this.userRepository.getUserChats(userId);
            if (firstIteration) {
                intersection = userChats;
                firstIteration = false;
            } else {
                intersection = intersection.intersection(userChats);
            }
        });

        this.chatId = "";

        await intersection.forEach(async (chatId) => {
            const profile = await this.profileRepository.getChatProfile(chatId);
            if (profile.members.size == users.size) {
                this.chatId = chatId;
            }
        });
    }

    async getUsers(chatId: string): Promise<Set<User>> {
        const userSet: Set<User> = new Set();
        let profile: ChatProfile;

        try {
            profile = await this.profileRepository.getChatProfile(chatId);
        } catch {
            return userSet;
        }

        const nullMembers: Set<string> = new Set();
        let currentUser: User;
        for (const userId of profile.members) {
            try {
                currentUser = await this.userRepository.getUser(userId);
                if (currentUser === null) {
                    throw new Error("User not found");
                }
                userSet.add(currentUser);
            }
            catch {
                nullMembers.add(userId);
            }
        }

        if (nullMembers.size > 0) {
            await this.UpdateRepository(profile, nullMembers);
        }

        return userSet;

    }

    async createChat(): Promise<void> {
        this.chatId = this.idGenerator.newId();
        await this.profileRepository.createChatProfile(this.chatId);
    }

    async addUserToChat(userId: string): Promise<void> {
        if (this.chatId !== null) {
            await this.profileRepository.addChatMember(this.chatId, userId);
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

    private async UpdateRepository(profile: ChatProfile, nullMembers: Set<string>): Promise<void> {
        console.log("chatProile", profile);
        console.log("nullMembers", nullMembers);
        profile.members = new Set([...profile.members].filter(x => ![...nullMembers].includes(x)));
        return this.profileRepository.overWriteChatProfile(profile);
    }
}

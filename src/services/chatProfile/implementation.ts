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

    async loadProfileFromUsers(users: Set<string>): Promise<void> {
        if (users.size == 0) {
            throw new Error('parameter "users" may not be an empty set');
        }
        /**
         * 1 if users.size >0 0 go to step 3
         * 2. Throw error 
         * 3. create an iterator for users
         * 4. commonChats = await this.userRepo.getUserChats(<first user from iterator>)
         * 5. if the iterator does not have next value, go to step 11
         * 6. iteartor.next()
         * 7. temp = await this.userRepo.getUserChats(<first user from iterator>)
         * 8. commonChats = union of commonChats and temp
         * 9. if commonChats size is 0 , go to step10, else go to step 5
         * 10. return null
         * 11. if commonChats.size is 1 go to step 13, else go to step 12  
         * 12. throw error "more than one common chat, this should not happen"
         * 13. set this.chatId to the only member of commonChats
         * 
         */



        let stub: Set<string> = new Set();
        let flag = true;

        await users.forEach(async (userId) => {
            const userChats = await this.userRepository.getUserChats(userId);

            if (flag) {
                stub = userChats;
                flag = false;
            } else {
                stub = stub.intersection(userChats);
            }
        });

        if (stub.size === 0) {
            this.chatId = "";
            return;
        }

        this.chatId = stub.values().next().value as string;
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
}

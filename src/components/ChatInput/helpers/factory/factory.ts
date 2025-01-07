import {IHelpersFactory} from "@/components/ChatInput/helpers/factory/interface";
import {IHelpers} from "@/components/ChatInput/helpers/class/interface";
import Helpers, {StateSetters} from "@/components/ChatInput/helpers/class/helpers";

export class HelpersFactory implements IHelpersFactory {
    createHelpers(setterParams: StateSetters, chatId: string): IHelpers {
        return new Helpers(setterParams, chatId);
    }
}
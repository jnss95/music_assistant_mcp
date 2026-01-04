import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MusicAssistantClient } from "../client.js";
export declare const playerTools: Tool[];
export declare function handlePlayerTool(client: MusicAssistantClient, name: string, args: Record<string, unknown> | undefined): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError?: boolean;
}>;
//# sourceMappingURL=player.d.ts.map
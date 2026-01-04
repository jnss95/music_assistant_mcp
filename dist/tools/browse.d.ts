import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MusicAssistantClient } from "../client.js";
export declare const browseTools: Tool[];
export declare function handleBrowseTool(client: MusicAssistantClient, name: string, args: Record<string, unknown> | undefined): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError?: boolean;
}>;
//# sourceMappingURL=browse.d.ts.map
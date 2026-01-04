import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MusicAssistantClient } from "../client.js";
export declare const searchTools: Tool[];
export declare function handleSearchTool(client: MusicAssistantClient, name: string, args: Record<string, unknown> | undefined): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError?: boolean;
}>;
//# sourceMappingURL=search.d.ts.map
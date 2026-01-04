/**
 * Music Assistant API Client
 */
export class MusicAssistantClient {
    baseUrl;
    token;
    constructor(baseUrl, token) {
        this.baseUrl = baseUrl.replace(/\/$/, "");
        this.token = token;
    }
    /**
     * Execute a Music Assistant API command
     */
    async executeCommand(command, args = {}) {
        const response = await fetch(`${this.baseUrl}/api`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({ command, args }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
        }
        return response.json();
    }
}
//# sourceMappingURL=client.js.map
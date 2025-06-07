import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "ai-meet",
    apiKey: process.env.INNGEST_API_KEY!,
})
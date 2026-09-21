import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages'

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
})


export async function generateMessage(message) {
    const response = await geminiModel.invoke(message.map(msg => {
        if(msg.role == "User"){
            return new HumanMessage(msg.content)
        }
        else if(msg.role == 'AI'){
            return new AIMessage(msg.content)
        }
    }))

    return response.text
}

export async function generateChatTitle(message) {

    const response = await geminiModel.invoke([
        new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversation
            
        User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant and engaging, giving users a quick understanding of chat's topic`),

        new HumanMessage(`
            Generate a title for a chat conversation based on following first message:
            "${message}"`)
    ])

    return response.text

}
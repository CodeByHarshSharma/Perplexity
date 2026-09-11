import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import readline from 'readline/promises';
import { HumanMessage, tool, createAgent } from 'langchain';
import { sendEmail } from './mail.service.js';
import * as z from 'zod';


const emailTool = tool(
    sendEmail,{
        name: "emailTool",
        description: "Use this tool to send an email",
        schema: z.object({
            to: z.string().describe("Recipient's email address"),
            subject: z.string().describe("Subject of the email"),
            html: z.string().describe("HTML content of the email"),
        })
    }
)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.7-flash",
    apiKey: process.env.GEMINI_API_KEY
})

const agent = createAgent({
    model,
    tools: [emailTool]
})

let message = []

export async function testAI(){
    while(true) {
        const userInput = await rl.question("\x1b[32mYou:\x1b[0m")
    
        message.push(new HumanMessage(userInput))
    
        const response = await agent.invoke({ message })
    
        message.push(response)
        
        console.log(response)

    }

}
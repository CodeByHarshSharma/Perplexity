import { initializeSocketConnection } from "../service/chat.socket.js"
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api.js"
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages } from '../chat.slice.js'
import { useDispatch } from 'react-redux'

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, AImessage } = data

        if (!chatId)
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }))

        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: message,
            role: "User"
        }))

        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: AImessage.content,
            role: AImessage.role
        }))
        dispatch(setCurrentChatId(chat._id))
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data

        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt
            }
            return acc
        }, {})))
    }

    async function handleOpenChats(chatId, chats) {

        if (chats[chatId]?.messages.length === 0) {

            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role
            }))
            
            dispatch(addMessages({
                chatId,
                messages: formattedMessages
            }))
        }

        dispatch(setCurrentChatId(chatId))
    }
    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChats
    }
}
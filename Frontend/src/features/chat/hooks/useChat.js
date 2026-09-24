import { initializeSocketConnection } from "../service/chat.socket.js"
import { sendMessage, getChats, getMessages, deleteChat, renameChat as renameChatApi } from "../service/chat.api.js"
import { createLocalId } from "../service/id.js"
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, removeChat, renameChat, addPendingMessage, replaceChatId, resolvePendingMessage, failPendingMessage } from '../chat.slice.js'
import { useDispatch } from 'react-redux'
import { store } from '../../../app/app.store.js'

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {

        const isNew = !chatId
        const activeId = chatId || createLocalId()
        const pendingId = createLocalId()

        if(isNew){
            dispatch(createNewChat({
                chatId: activeId, 
                title: 'New Chat' }))

            dispatch(setCurrentChatId(activeId))
        }

        dispatch(addNewMessage({
            chatId: activeId, 
            content: message, 
            role: 'User' }))

        dispatch(addPendingMessage({ chatId: activeId, id: pendingId }))

        try{

            const data = await sendMessage({ message, chatId })
            const { chat, AImessage } = data
            const realId = isNew ? chat._id : chatId
            
            if(isNew){
                dispatch(replaceChatId({ 
                    tempId: activeId, realId,
                    title: chat.title
                }))
            }
            dispatch(resolvePendingMessage({
                chatId: realId,
                id: pendingId,
                content: AImessage.content
            }))
        }
        catch(err){
            dispatch(failPendingMessage({ chatId: activeId, id: pendingId }))
            dispatch(setError(err.response?.data?.message || "Failed to send message"))
        }
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
                id: msg._id,
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

    async function handleDeleteChat(chatId) {
        try{
            dispatch(setLoading(true))
            await deleteChat(chatId)
            dispatch(removeChat({ chatId }))
        }
        catch(err){
            dispatch(setError(err.response?.data?.message || "Failed to delete chat"))
        }
        finally{
            dispatch(setLoading(false))
        }
    }

    async function handleRenameChat(chatId, title) {
        const previousTitle = store.getState().chat.chats[chatId]?.title
        dispatch(renameChat({ chatId, title }))
        try{
            await renameChatApi(chatId, title)
        }
        catch(err){
            if(previousTitle){
                dispatch(renameChat({ chatId, title: previousTitle }))
                dispatch(setError(err.response?.data?.message || "Failed to rename chat"))
            }
        }
    }

    function handleNewChat() {
        dispatch(setCurrentChatId(null))
    }
    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChats,
        handleDeleteChat,
        handleRenameChat,
        handleNewChat
    }
}
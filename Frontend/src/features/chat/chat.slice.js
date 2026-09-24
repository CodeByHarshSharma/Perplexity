import { createSlice } from '@reduxjs/toolkit';


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
                isTemp: true
            }
        },
        addPendingMessage: (state, action) => {
            const { chatId, id } = action.payload
            state.chats[chatId].messages.push({
                id,
                content: '',
                role: 'AI',
                isPending: true
            })
        },
        resolvePendingMessage: (state, action) => {
            const { chatId, id, content } = action.payload
            const message = state.chats[chatId]?.messages.find(m => m.id === id)
            if (message) {
                message.content = content
                message.isPending = false
            }
        },
        failPendingMessage: (state, action) => {
            const { chatId, id } = action.payload
            const messages = state.chats[chatId]?.messages
            if (!messages) return
            const index = messages.findIndex(m => m.id === id)
            if (index !== -1) messages.splice(index, 1)
        },
        replaceChatId: (state, action) => {
            const { tempId, realId, title } = action.payload
            const chat = state.chats[tempId]
            if (!chat) return
            delete state.chats[tempId]
            state.chats[realId] = {
                ...chat,
                id: realId,
                title: title ?? chat.title,
                isTemp: false
            }
            if (state.currentChatId === tempId) {
                state.currentChatId = realId
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            state.chats[chatId].messages.push({ id: crypto.randomUUID(), content, role })
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[chatId].messages.push(...messages)
        },
        removeChat: (state, action) => {
            const { chatId } = action.payload
            delete state.chats[chatId]
            if (state.currentChatId === chatId) {
                state.currentChatId = null
            }
        },
        renameChat: (state, action) => {
            const { chatId, title } = action.payload
            if (state.chats[chatId]) {
                state.chats[chatId].title = title
            }
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})


export const {
    createNewChat,
    addPendingMessage,
    resolvePendingMessage,
    failPendingMessage,
    replaceChatId,
    addNewMessage,
    addMessages,
    removeChat,
    renameChat,
    setChats,
    setCurrentChatId,
    setLoading,
    setError } = chatSlice.actions
export default chatSlice.reducer
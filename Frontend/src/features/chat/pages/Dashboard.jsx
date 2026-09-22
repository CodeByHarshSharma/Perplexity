import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat.js'
import '../styles/chat.css'

const Dashboard = () => {

  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const [useMessage, setUserMessage] = useState('')

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)

  useEffect(() => {
    chat.initializeSocketConnection(),
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (e) => {
    e.preventDefault()

    const trimmedMessage = chatInput.trim()
    if(!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId})
    setUserMessage(trimmedMessage)
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChats(chatId, chats)
  }

  return (
    <main className='chat-app'>
      <section className='chat-container'>
        <aside className='chat-sidebar'>
          <h1 className='chat-logo'>Quantix</h1>
          <div className="chat-list">
            {Object.values(chats).map((chat, index) => (
              <button
                className='chat-list-button'
                onClick={() => openChat(chat.id)}
                key={index}
                type='button'>
                {chat.title}
              </button>
            ))}
          </div>
        </aside>

        <section className='chat-main'>
          <div className="messages">
            {chats[currentChatId]?.messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.role === "User" ? "message-user" : "message-assistant"}`}>
                {message.role === 'User' ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className='markdown-para'>{children}</p>,
                      ul: ({ children }) => <ul className='markdown-ul'>{children}</ul>,
                      ol: ({ children }) => <ol className='markdown-ol'>{children}</ol>,
                      code: ({ children }) => <code className='markdown-code'>{children}</code>,
                      pre: ({ children }) => <pre className='markdown-pre'>{children}</pre>
                    }}>
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          <footer className='chat-footer'>
            <form onSubmit={handleSubmitMessage} className='chat-form'>
              <input
                type='text'
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder='Type Your Message...'
                className='chat-input' />

              <button type='submit' disabled={!chatInput.trim()} className='chat-send-button'>
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard

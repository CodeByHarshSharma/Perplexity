import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat.js'
import '../styles/chat.css'

const Dashboard = () => {

  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const [useMessage, setUserMessage] = useState('')
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const currentChat = chats[currentChatId]

  useEffect(() => {
    chat.initializeSocketConnection(),
      chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (e) => {
    e.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setUserMessage(trimmedMessage)
    setChatInput('')
  }

  const handleRemoveChat = (chatId) => {
    if (!window.confirm('Delete this conversation?')) return
    chat.handleDeleteChat(chatId)
  }

  const startRename = (chatId, currentTitle) => {
    setRenameValue(currentTitle)
    setRenamingId(chatId)
  }

  const commitRename = (chatId) => {
    const title = renameValue.trim()
    setRenamingId(null)
    if (!title || title === chats[chatId]?.title) return
    chat.handleRenameChat(chatId, title)
  }

  const startNewChat = () => {
    setRenamingId(null)
    setChatInput('')
    setIsSidebarOpen(false)
    chat.handleNewChat()
  }

  const openChat = (chatId) => {
    setIsSidebarOpen(false)
    chat.handleOpenChats(chatId, chats)
  }

  return (
    <main className='chat-app'>
      <section className='chat-container'>
        <aside className={`chat-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true"> Q </span>
            <h1 className='chat-logo'>Quantix</h1>
            <button
              className='new-chat-button'
              onClick={startNewChat}
              type='button'
              aria-label='Start a new chat'>
              +
            </button>
          </div>
          <div className="sidebar-heading">
            <span>
              Conversations
            </span>
            <span className="chat-count">{Object.keys(chats).length}</span>
          </div>
          <div className="chat-list">
            {Object.values(chats).map((c, index) => (
              <div
                className={`chat-list-item ${currentChatId === c.id ? 'is-active' : ''}`}
                key={c.id}>
                {renamingId === c.id ? (
                  <input
                    className='chat-rename-input'
                    value={renameValue}
                    autoFocus
                    maxLength={100}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => commitRename(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(c.id)
                      if (e.key === 'Escape') setRenamingId(null)
                    }} />
                ) : (
                  <>
                    <button
                      className={`chat-list-button`}
                      onClick={() => openChat(c.id)}
                      type='button'>
                      {c.title}
                    </button>
                    {!c.isTemp && (
                      <>

                        <button
                          className='chat-rename-button'
                          onClick={(e) => { e.stopPropagation(); startRename(c.id, c.title) }}
                          type='button'
                          aria-label={`Rename ${c.title}`}>
                          ✎
                        </button>
                        <button
                          className='chat-delete-button'
                          onClick={(e) => { e.stopPropagation(); handleRemoveChat(c.id) }}
                          type='button'
                          aria-label={`Delete ${c.title}`}>
                          x
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
            {!Object.keys(chats).length && <p className="empty-chats">Your conversations will appear here.</p>}
          </div>
          <p className="sidebar-note">Answers powered by your AI workspace.</p>
        </aside>

        {isSidebarOpen && (
          <button
            className='sidebar-backdrop'
            onClick={() => setIsSidebarOpen(false)}
            type='button'
            aria-label='Close conversations' />
        )}

        <section className='chat-main'>
          <header className="chat-header">
            <button
              className='sidebar-toggle'
              onClick={() => setIsSidebarOpen(true)}
              type='button'
              aria-label='Open conversations'>
              ☰
            </button>
            <div className="chat-header-title">
              <p className="eyebrow">AI WORKSPACE</p>
              <h2>{currentChat?.title || 'Start a new conversation'}</h2>
            </div>
          </header>
          <div className="messages">
            {!currentChat?.messages.length && <div className="welcome-state">
              <span className="welcome-orb" aria-hidden="true">✦</span>
              <p className="eyebrow">QUANTIX ASSISTANT</p>
              <h3>What would you like to explore?</h3>
              <p>Ask a question, untangle an idea, or turn a rough thought into a plan.</p>
            </div>}
            {currentChat?.messages.map((message, index) => (
              <div
                key={message.id}
                className={`message ${message.role === "User" ? "message-user" : "message-assistant"}`}>
                {message.isPending ? (
                  <span className='typing-dots'><i /><i /><i /></span>
                ) : message.role === 'User' ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className='markdown-para'>{children}</p>,
                      ul: ({ children }) => <ul className='markdown-ul'>{children}</ul>,
                      ol: ({ children }) => <ol className='markdown-ol'>{children}</ol>,
                      code: ({ children }) => <code className='markdown-code'>{children}</code>,
                      pre: ({ children }) => <pre className='markdown-pre'>{children}</pre>
                    }}
                    remarkPlugins={[remarkGfm]}>
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
                placeholder='Message Quantix...'
                className='chat-input' />

              <button type='submit' disabled={!chatInput.trim()} className='chat-send-button'>
                <span>Send</span><span aria-hidden="true"></span>
              </button>
            </form>
            <p className="input-hint">Press Enter to send</p>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard

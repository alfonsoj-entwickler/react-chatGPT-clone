import { useState, useEffect } from "react";

const App = () => {
  const [ value, setValue ] = useState(null)
  const [ message, setMessage ] = useState(null)
  const [ previousChats, setPreviousChat ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)

  const getMessages = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: value
      })
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  }

  const resetChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  useEffect(() => {
      console.log(currentTitle, value, message);
      if( !currentTitle && value && message ) {
        setCurrentTitle(value)
      }
      if( currentTitle && value && message ) {
        setPreviousChat(previousChats => (
          [...previousChats, 
            {
              title: currentTitle,
              role: "user",
              content: value
            },
            {
              title: currentTitle,
              role: message.role,
              content: message.content
            }
        ]
        ))
      }
  }, [message, currentTitle])

  const currectChat =  previousChats.filter( previousChat => previousChat.title === currentTitle )
  const uniqueTitles = Array.from( new Set(previousChats.map( previousChat => previousChat.title )))
  
  console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="side-bar">
        <button 
          className="reset" 
          type="button"
          onClick={resetChat}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
          </svg>

          <span>New Chat</span>
        </button>
        <ul className="history">
          {uniqueTitles?.map( (uniqueTitle, index ) => <li key={index} onClick={ () => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Alfonsoj-Entwickler</p>
        </nav>
      </section>
      <section className="main">
        <h1>{currentTitle ? "" : "ReactAppChatGPT"}</h1>
        <ul className="feed">
          {currectChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <form className="input-container">
            <input 
              type="text" 
              value={value}
              onChange={ e => setValue(e.target.value)}
            />
            <button type="submit" id="submit" onClick={e=> getMessages(e)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </button>
          </form>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview. 
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App
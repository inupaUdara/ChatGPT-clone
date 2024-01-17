import { useState, useEffect } from "react"

function App() {

  const [ value, setValue] = useState(null);
  const [ message, setMessage ] = useState(null);
  const [ previousChat, setPreviousChat] = useState([]);
  const [ currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }


  const getMessages = async () => {

    const options = {
      method: "POST",
      body : JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }

      
    };

    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data =await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    console.log(currentTitle, value, message)
    if(!currentTitle && value && message){
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChat(prevChats => (
        [...prevChats, 
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
      ));
    }
  }, [message, currentTitle]);

  

  const currentChat =previousChat.filter(previousChat => previousChat.title === currentTitle);
  const uniqueTitle = Array.from(new Set(previousChat.map(previousChat => previousChat.title)));
 
  return (
    <div className="app">
        <section className="side-bar">
          <button onClick={createNewChat}>+ New chat</button>
          <ul className="history">
            {uniqueTitle?.map((uniqueTitle, index) => <li key={index} onClick={() =>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
          </ul>
          <nav>
            <p>Made by Inupa</p>
          </nav>
        </section>
        <section className="main">
          {!currentTitle && <h1>InupaGPT</h1>}
          <ul className="feed">
              {currentChat?.map((chatMessage, index) => <li key={index}>
                  <p className="role">{chatMessage.role}:</p><br/>
                  <p>{ chatMessage.content}</p>
                </li>)}
          </ul>
          <div className="bottom-section">
            <div className="input-container">
              <input value={value} onChange={(e) => setValue(e.target.value)}/>
              <div id="submit" onClick={getMessages}>send</div>
            </div>
            <p className="info">
              Chat GPT Jan 23 Version.
            </p>
          </div>
        </section>
    </div>
  );
}

export default App;

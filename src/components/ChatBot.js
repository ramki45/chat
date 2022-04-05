import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import '../css/ChatBot.css'

export default function ChatBot() {

    const [userInput, setUserInput] = useState('')
    const [userHistory, setUserHistory] = useState([])
    const [botHistory, setBotHistory] = useState([])

    const onKeyUp = (e) => {
        if(e.key === "Enter"){
            setUserHistory([e.target.value, ...userHistory])
            setUserInput('')
            matchReply(e.target.value)
        }
    }

    const handleChange = (e) => setUserInput(e.target.value)

const matchReply = (userInput) => {
    const trigger = [
        ["hi", "hey", "hello"],
        ["how are you", "how are things", "how you doing"],
        ["what is going on", "what is up"],
        ["happy", "good", "amazing", "fantastic", "cool"],
        ["bad", "bored", "tired", "sad"],
        ["thanks", "thank you"],
        ["bye", "good bye", "goodbye"]
    ];
        
    const reply = [
        ["Hello", "Hi", "It's nice seeing you!"],
        ["I'm doing good... how are you?", "I feel kind of lonely, how are you?", "I feel happy, how are you?"],
        ["Nothing much", "Exciting things!", "I'm happy to see you!"],
        ["Glad to hear it", "Yayyy!! That's the spirit!"],
        ["There is always a rainbow after the rain!"],
        ["You're welcome", "No problem", "It's my pleasure!"],
        ["Goodbye, it was a nice talk"]
    ];
    
    const alternative = ["Same","Go on...","Try again please?", "I'm listening..."];

    let botMsg = generateReply(trigger, reply, userInput)

    if(!botMsg){
        botMsg = alternative[Math.floor(Math.random()*alternative.length)]
    }

    setBotHistory([botMsg, ...botHistory])
    speak(botMsg)
}

    const generateReply = (trigger, reply, text) => {
        let item;
        let items;
        for (let x = 0; x < trigger.length; x++) {
            for (let y = 0; y < reply.length; y++) {
                if (text.includes(trigger[x][y])) {
                    items = reply[x];
                    item = items[Math.floor(Math.random() * items.length)];
                }
            }
        }
        return item;
    }

    // initialize Web Speech API recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    // add chatbot's voice
    const speak = (string) => {
        const u = new SpeechSynthesisUtterance();
        const allVoices = speechSynthesis.getVoices();
        u.voice = allVoices.filter(voice => voice.name === "Alex")[0];
        u.text = string;
        u.lang = "en-US";
        u.volume = 1;
        u.rate = 1;
        u.pitch = 1;
        speechSynthesis.speak(u);
    }

    // translate voice to text
    const handleVoice = (recognition) => {
        recognition.start()

        recognition.onresult = function (event) {
            const resultIndx = event.resultIndex
            const transcript = event.results[resultIndx][0].transcript
            setUserHistory([transcript, ...userHistory])
            matchReply(transcript)
        }
    }

    return (
        <div className='chatbot-card'>
            <div>
                <img 
                    className='bot-cover-photo'
                    src='https://www.userlike.com/api/proxy/resize/do-i-need-a-chatbot/header-chat-box.png?height=720' 
                    alt='chatbot-pic'
                />  
            </div>
                
            <div className='human-input'>
                <InputGroup className="mb-3">

                    <Form.Control
                        className="mb-2"
                        type="text" 
                        placeholder="Ask me something"
                        value={userInput}
                        onChange={handleChange}
                        onKeyPress={onKeyUp}
                    />

                    {/* adding micro phone icon for voice recognition */}
                                             
                            <img 
                                src='https://img.icons8.com/dusk/64/000000/microphone.png'
                                alt='microphone-icon'
                                variant='info' 
                                type="submit" 
                                className="mb-2 voice-chat-btn" 
                                onClick={() => handleVoice(recognition)}
                            />
                   

                </InputGroup>
            </div>
            <div className='chatbox'>
                {userHistory.map((userReply, indx) => 
                    <div className='conversation-box'>
                        <div id='bot-reply'>
                            <h3>Bot: {botHistory[indx]}</h3>
                        </div>

                        <div id='user-input'>
                            <h3>You: {userReply}</h3>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    )
}
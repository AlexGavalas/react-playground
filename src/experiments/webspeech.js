var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';

const listenButton = document.querySelector('#demo .listen');
const speechLog = document.querySelector('#demo .chat');

const activateChat = () => {
    recognition.start();
    listenButton.dataset.state = 'listening';
    listenButton.textContent = 'Stop listening';
};

const deactivateChat = () => {
    recognition.stop();
    speechLog.classList.remove('active');
    listenButton.dataset.state = 'inactive';
    listenButton.textContent = 'Start listening';
};

recognition.onstart = () => {
    speechLog.classList.add('active');
};

recognition.onspeechend = () => {
    deactivateChat();
};

recognition.onend = () => {
    deactivateChat();
};

listenButton.addEventListener('click', () => {
    const state = listenButton.dataset.state;

    if (state === 'inactive') {
        activateChat();
    } else {
        deactivateChat();
    }
});

recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;

    const newMessage = document.createElement('li');
    const newMessageTranscript = document.createTextNode(transcript);

    newMessage.classList.add('message', 'message--user');

    newMessage.appendChild(newMessageTranscript);
    speechLog.append(newMessage);

    handleResponse(transcript);
};

const handleResponse = (transcript) => {
    const newResponse = document.createElement('li');
    const typing = document.createTextNode('...');

    newResponse.classList.add('message', 'message--other');

    newResponse.appendChild(typing);
    speechLog.append(newResponse);

    transcript = transcript
        .toLowerCase()
        .replace(/[.?,!]/gm, '')
        .trim();

    let response = 'Happy Holidays!';

    if (transcript.includes('hello') || transcript.includes('hi')) {
        response = 'Hello there';

        setTimeout(() => {
            activateChat();
        }, 100);
    }

    if (transcript.includes('bye')) {
        response = 'General Kenobi';

        setTimeout(() => {
            deactivateChat();
        }, 100);
    }

    newResponse.textContent = response;
};

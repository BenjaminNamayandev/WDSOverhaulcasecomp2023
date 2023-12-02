document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", checkPage);

// Initialize current file name
let currentFileName = '';

function attachListeners() {
    document.querySelector('.login_form')?.addEventListener('submit', login);
    let logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    let addButton = document.querySelector('.add_file');
    if (addButton) {
        addButton.addEventListener('click', addFile);
    }

    // Load existing files from localStorage
    loadFiles();
}

function addFile() {
    let filebar = document.querySelector('.files');
    let newFileButton = document.createElement('button');
    let fileName = window.prompt("Name the file:", "Enter name here");
    
    // Check if the file name is not empty
    if (fileName) {
        newFileButton.textContent = fileName;
        newFileButton.addEventListener('click', () => {
            // Set current file name when switching files
            currentFileName = fileName;
            loadNotes();
        });
        filebar.appendChild(newFileButton);

        // Save files to localStorage
        saveFiles();
    }
}

function loadFiles() {
    let files = JSON.parse(localStorage.getItem('files')) || [];
    let filebar = document.querySelector('.files');

    // Clear existing file buttons
    filebar.innerHTML = '';

    // Load files from localStorage
    files.forEach(fileName => {
        let newFileButton = document.createElement('button');
        newFileButton.textContent = fileName;
        newFileButton.addEventListener('click', () => {
            // Set current file name when switching files
            currentFileName = fileName;
            loadNotes();
        });
        filebar.appendChild(newFileButton);
    });
}

function saveFiles() {
    let files = Array.from(document.querySelectorAll('.files button')).map(button => button.textContent);
    localStorage.setItem('files', JSON.stringify(files));
}

function loadNotes() {
    let notes = JSON.parse(localStorage.getItem(currentFileName)) || '';
    document.getElementById('writing').value = notes;
}

function saveNotes() {
    let notes = document.getElementById('writing').value;
    localStorage.setItem(currentFileName, JSON.stringify(notes));
}

function checkPage() {
    let username = localStorage.getItem('username');
    if (window.location.href.includes('login.html') && username)
        window.location = 'notes.html';
    if (window.location.href.includes('notes.html') && !username)
        window.location = 'login.html';
}

function login(event) {
    event.preventDefault();

    let username = document.querySelector('.login_form input[type="username"]').value;
    let password = document.querySelector('.login_form input[type="password"]').value;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    window.location = 'notes.html';
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = 'login.html';
} 

function translateText() {
    const inputTextarea = document.getElementById('writing');
    const selectLanguage = document.getElementById('selectLanguage');
    const outputText = document.getElementById('outputText');

    const apiKey = 'AIzaSyDJ5ou-M_JhYJi0HMkLOzq4v9Kfje-Frio'; 
    const targetLanguage = selectLanguage.value;
    const textToTranslate = inputTextarea.value;

    fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: textToTranslate,
        target: targetLanguage,
      }),
    })
    .then(response => response.json())
    .then(data => {
      const translatedText = data.data.translations[0].translatedText;
      inputTextarea.value = translatedText;
    })
    .catch(error => {
      console.error('Error translating text:', error);
    });
  }

function convertToSpeech() {
    const writing = document.getElementById('writing').value;

    if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(writing);
        synthesis.speak(utterance);
    
    } else {
        alert('Text-to-speech is not supported in your browser. Please use a modern browser.');
    }
  }

// Event listener for writing text area changes
document.getElementById('writing').addEventListener('input', saveNotes);

// Save current file function
function saveCurrentFile() {
    saveNotes();
    alert('File saved successfully!');
}
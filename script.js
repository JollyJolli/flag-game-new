// script.js
const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,flags';
let flags = [];
let currentFlagIndex = 0;
let score = 0;

async function fetchFlags() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        flags = data.map(item => ({
            country: item.name.common,
            image: item.flags.png
        }));
        showFlag();
    } catch (error) {
        console.error('Error fetching flags:', error);
        document.getElementById('result').textContent = 'Error cargando las banderas.';
    }
}

function showFlag() {
    if (flags.length === 0) return;

    currentFlagIndex = Math.floor(Math.random() * flags.length);
    const flag = document.getElementById('flag');
    flag.src = flags[currentFlagIndex].image;
    document.getElementById('result').textContent = '';
    document.getElementById('hint').textContent = ''; // Limpiar pista
    document.getElementById('guess').value = '';
}

function checkAnswer() {
    const guess = document.getElementById('guess').value.trim().toLowerCase();
    const result = document.getElementById('result');
    const correctAnswer = flags[currentFlagIndex].country.toLowerCase();

    if (guess === correctAnswer) {
        score++;
        result.textContent = '¡Correcto!';
        result.style.color = 'green';
        updateScore();
        setTimeout(nextFlag, 1000); // Mostrar la siguiente bandera después de 1 segundo
    } else {
        result.textContent = `Incorrecto. La respuesta correcta es ${flags[currentFlagIndex].country}.`;
        result.style.color = 'red';
        score = 0; // Reiniciar la puntuación en caso de respuesta incorrecta
        updateScore();
    }
}

function giveHint() {
    const hint = document.getElementById('hint');
    const countryName = flags[currentFlagIndex].country;
    const hintString = getHintString(countryName);
    hint.textContent = `Pista: ${hintString}`;
}

function getHintString(name) {
    const totalLength = name.length;
    const numVisible = Math.ceil(totalLength * 0.4); // 40% visibles
    const numHidden = totalLength - numVisible; // Resto ocultos

    let hintString = '';
    let visibleCount = 0;

    for (let i = 0; i < totalLength; i++) {
        if (visibleCount < numVisible && (Math.random() < (numVisible - visibleCount) / (totalLength - i))) {
            hintString += name[i];
            visibleCount++;
        } else {
            hintString += '*';
        }
    }

    return hintString;
}

function nextFlag() {
    showFlag();
}

function updateScore() {
    document.getElementById('score').textContent = `Puntuación: ${score}`;
}

// Mostrar la primera bandera al cargar la página
window.onload = fetchFlags;

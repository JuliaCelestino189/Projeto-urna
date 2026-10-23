
const candidates = {
    "12": {
        name: "Ana Martins",
        party: "Partido Verde (PV)",
        initials: "AM"
    },

    "23": {
        name: "Bruno Costa",
        party: "Partido da Comunidade (PC)",
        initials: "BC"
    },

    "45": {
        name: "Carla Souza",
        party: "Partido do Futuro (PF)",
        initials: "CS"
    }
};


let votes = {
    "12": 0,
    "23": 0,
    "45": 0,
    branco: 0,
    nulo: 0
};

let enteredNumber = "";
let finished = false;


const screenContent = document.getElementById("screen-content");

const candidateName = document.getElementById("candidate-name");
const candidateParty = document.getElementById("candidate-party");
const candidateAvatar = document.getElementById("candidate-avatar");

const notice = document.getElementById("notice");
const totalVotes = document.getElementById("total-votes");
const resultsList = document.getElementById("results-list");


function showNotice(message) {
    notice.querySelector("p").textContent = message;
}


function renderScreen() {
    if (finished) {
        screenContent.innerHTML = `
            <p class="screen-instruction">VOTAÇÃO</p>
            <h3>FIM</h3>
            <p class="screen-help">
                Obrigado por participar!
            </p>
        `;

        candidateName.textContent = "Voto finalizado";
        candidateParty.textContent =
            "Sua escolha foi registrada nesta simulação.";

        candidateAvatar.textContent = "✓";

        return;
    }

    const candidate = candidates[enteredNumber];

    let help = "Digite o número do candidato";

    if (enteredNumber === "") {
        candidateName.textContent = "Aguardando número";
        candidateParty.textContent = "Digite 2 números no teclado";
        candidateAvatar.textContent = "?";
    } else if (enteredNumber.length === 1) {
        candidateName.textContent = "Continue digitando";
        candidateParty.textContent = "Insira o segundo dígito";
        candidateAvatar.textContent = enteredNumber;
    } else if (candidate) {
        candidateName.textContent = candidate.name;
        candidateParty.textContent = candidate.party;
        candidateAvatar.textContent = candidate.initials;

        help = "Confira os dados e confirme seu voto";
    } else {
        candidateName.textContent = "Candidato não encontrado";
        candidateParty.textContent = "Número inexistente";
        candidateAvatar.textContent = "!";

        help = "Número inexistente: voto será nulo";
    }

    const digits = (enteredNumber + "  ").slice(0, 2);

    screenContent.innerHTML = `
        <p class="screen-instruction">SEU VOTO PARA</p>

        <h3>PREFEITO(A)</h3>

        <div class="number-entry">
            <span class="digit">
                ${digits[0] === " " ? "" : digits[0]}
            </span>

            <span class="digit">
                ${digits[1] === " " ? "" : digits[1]}
            </span>
        </div>

        <p class="screen-help">${help}</p>
    `;
}


function addDigit(digit) {
    if (finished) {
        return;
    }

    if (enteredNumber.length >= 2) {
        showNotice("Pressione CORRIGE para digitar outro número.");
        return;
    }

    enteredNumber += digit;

    renderScreen();
}


function correctVote() {
    if (finished) {
        return;
    }

    enteredNumber = "";

    renderScreen();

    showNotice("Número apagado. Digite novamente sua escolha.");
}


function confirmVote() {
    if (finished) {
        return;
    }

    if (enteredNumber.length !== 2) {
        showNotice(
            "Digite os dois números antes de confirmar, ou escolha BRANCO."
        );

        return;
    }

    if (candidates[enteredNumber]) {
        votes[enteredNumber]++;

        showNotice(
            `Voto simulado para ${candidates[enteredNumber].name} registrado com sucesso.`
        );
    } else {
        votes.nulo++;

        showNotice("Voto nulo registrado nesta simulação.");
    }

    finished = true;

    renderScreen();
    renderResults();
}


function blankVote() {
    if (finished) {
        return;
    }

    votes.branco++;

    finished = true;

    renderScreen();
    renderResults();

    showNotice("Voto em branco registrado nesta simulação.");
}


function renderResults() {
    const total = Object.values(votes).reduce(
        (sum, count) => sum + count,
        0
    );

    totalVotes.textContent = total;

    const labels = [
        ...Object.entries(candidates).map(([number, candidate]) => ({
            number,
            name: candidate.name,
            count: votes[number]
        })),

        {
            number: "BRANCO",
            name: "Votos em branco",
            count: votes.branco
        },

        {
            number: "NULO",
            name: "Votos nulos",
            count: votes.nulo
        }
    ];

    if (total === 0) {
        resultsList.innerHTML = `
            <p class="empty-results">
                Os votos aparecerão aqui após a confirmação.
            </p>
        `;

        return;
    }

    resultsList.innerHTML = labels
        .filter(item => item.count > 0)
        .map(item => {
            const percentage = Math.round(
                (item.count / total) * 100
            );

            return `
                <div class="result-row">

                    <span class="result-name">
                        ${item.name}
                    </span>

                    <span class="result-number">
                        ${item.count} (${percentage}%)
                    </span>

                    <div class="result-bar">
                        <span style="width: ${percentage}%"></span>
                    </div>

                </div>
            `;
        })
        .join("");
}


document.querySelectorAll("[data-digit]").forEach(button => {
    button.addEventListener("click", () => {
        addDigit(button.dataset.digit);
    });
});


document
    .getElementById("correct-btn")
    .addEventListener("click", correctVote);

document
    .getElementById("confirm-btn")
    .addEventListener("click", confirmVote);

document
    .getElementById("blank-btn")
    .addEventListener("click", blankVote);


const dialog = document.getElementById("results-dialog");

document
    .getElementById("show-results-btn")
    .addEventListener("click", () => {

        const total = Object.values(votes).reduce(
            (sum, count) => sum + count,
            0
        );

        const items = [
            ...Object.entries(candidates).map(([number, candidate]) => ({
                name: ${candidate.name} (${number}),
                count: votes[number]
            })),

            {
                name: "Votos em branco",
                count: votes.branco
            },

            {
                name: "Votos nulos",
                count: votes.nulo
            }
        ];

        document.getElementById("dialog-results").innerHTML = `
            <div class="dialog-result">
                <strong>Total de votos</strong>
                <strong>${total}</strong>
            </div>

            ${items.map(item => `
                <div class="dialog-result">
                    <span>${item.name}</span>
                    <strong>${item.count}</strong>
                </div>
            `).join("")}
        `;

        dialog.showModal();
    });


document
    .getElementById("close-dialog")
    .addEventListener("click", () => {
        dialog.close();
    });


document.addEventListener("keydown", event => {
    if (/^[0-9]$/.test(event.key)) {
        addDigit(event.key);
    }

    if (event.key === "Backspace") {
        correctVote();
    }

    if (event.key === "Enter") {
        confirmVote();
    }
});


renderScreen();
renderResults();
```

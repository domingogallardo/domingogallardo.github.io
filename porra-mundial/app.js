"use strict";

const STORAGE_KEY = "porraMundial2026State";

const groups = {
  A: ["México", "Corea del Sur", "Sudáfrica", "Chequia"],
  B: ["Canadá", "Suiza", "Catar", "Bosnia-Herzegovina"],
  C: ["Brasil", "Marruecos", "Escocia", "Haití"],
  D: ["Estados Unidos", "Paraguay", "Australia", "Turquía"],
  E: ["Alemania", "Ecuador", "Costa de Marfil", "Curazao"],
  F: ["Países Bajos", "Japón", "Túnez", "Suecia"],
  G: ["Bélgica", "Irán", "Egipto", "Nueva Zelanda"],
  H: ["España", "Uruguay", "Arabia Saudí", "Cabo Verde"],
  I: ["Francia", "Senegal", "Noruega", "Irak"],
  J: ["Argentina", "Austria", "Argelia", "Jordania"],
  K: ["Portugal", "Colombia", "Uzbekistán", "RD Congo"],
  L: ["Inglaterra", "Croacia", "Panamá", "Ghana"]
};

const groupLetters = Object.keys(groups);

const steps = [
  { key: "groups", title: "Fase de grupos" },
  { key: "thirds", title: "Mejores terceros" },
  { key: "round32", title: "Dieciseisavos" },
  { key: "round16", title: "Octavos" },
  { key: "quarterfinals", title: "Cuartos" },
  { key: "semifinals", title: "Semifinales" },
  { key: "thirdPlace", title: "Tercer puesto" },
  { key: "final", title: "Final" },
  { key: "summary", title: "Resumen final" }
];

const roundNames = {
  round32: "Dieciseisavos",
  round16: "Octavos",
  quarterfinals: "Cuartos",
  semifinals: "Semifinales",
  thirdPlace: "Tercer puesto",
  final: "Final"
};

const thirdSlots = [
  { matchId: 74, compatible: ["A", "B", "C", "D", "F"] },
  { matchId: 77, compatible: ["C", "D", "F", "G", "H"] },
  { matchId: 79, compatible: ["C", "E", "F", "H", "I"] },
  { matchId: 80, compatible: ["E", "H", "I", "J", "K"] },
  { matchId: 81, compatible: ["B", "E", "F", "I", "J"] },
  { matchId: 82, compatible: ["A", "E", "H", "I", "J"] },
  { matchId: 85, compatible: ["E", "F", "G", "I", "J"] },
  { matchId: 87, compatible: ["D", "E", "I", "J", "L"] }
];

const round32Schema = [
  { id: 73, a: "2A", b: "2B" },
  { id: 74, a: "1E", b: "3*" },
  { id: 75, a: "1F", b: "2C" },
  { id: 76, a: "1C", b: "2F" },
  { id: 77, a: "1I", b: "3*" },
  { id: 78, a: "2E", b: "2I" },
  { id: 79, a: "1A", b: "3*" },
  { id: 80, a: "1L", b: "3*" },
  { id: 81, a: "1D", b: "3*" },
  { id: 82, a: "1G", b: "3*" },
  { id: 83, a: "2K", b: "2L" },
  { id: 84, a: "1H", b: "2J" },
  { id: 85, a: "1B", b: "3*" },
  { id: 86, a: "1J", b: "2H" },
  { id: 87, a: "1K", b: "3*" },
  { id: 88, a: "2D", b: "2G" }
];

const nextRoundSchemas = {
  round16: [
    { id: 89, from: [74, 77] },
    { id: 90, from: [73, 75] },
    { id: 91, from: [76, 78] },
    { id: 92, from: [79, 80] },
    { id: 93, from: [83, 84] },
    { id: 94, from: [81, 82] },
    { id: 95, from: [86, 88] },
    { id: 96, from: [85, 87] }
  ],
  quarterfinals: [
    { id: 97, from: [89, 90] },
    { id: 98, from: [93, 94] },
    { id: 99, from: [91, 92] },
    { id: 100, from: [95, 96] }
  ],
  semifinals: [
    { id: 101, from: [97, 98] },
    { id: 102, from: [99, 100] }
  ],
  final: [{ id: 104, from: [101, 102] }],
  thirdPlace: [{ id: 103, loserFrom: [101, 102] }]
};

let state = createInitialState();

function createInitialState() {
  const groupPredictions = {};
  groupLetters.forEach((letter) => {
    groupPredictions[letter] = [...groups[letter]];
  });

  return {
    currentStep: 0,
    groupPredictions,
    bestThirds: [],
    matches: {},
    winners: {},
    assignmentNote: ""
  };
}

function renderCurrentStep() {
  clearMessage();
  buildAvailableMatches();
  renderProgress();

  const step = steps[state.currentStep];
  const app = document.getElementById("app");

  if (step.key === "groups") renderGroupStep(app);
  if (step.key === "thirds") renderBestThirdsStep(app);
  if (["round32", "round16", "quarterfinals", "semifinals", "thirdPlace", "final"].includes(step.key)) {
    renderKnockoutStep(app, step.key);
  }
  if (step.key === "summary") renderSummaryStep(app);

  updateNavButtons();
  saveState();
}

function renderProgress() {
  const current = state.currentStep + 1;
  const total = steps.length;
  document.getElementById("stepLabel").innerHTML = `<span>${steps[state.currentStep].title}</span><span>${current} de ${total}</span>`;
  document.getElementById("progressBar").style.width = `${(current / total) * 100}%`;
}

function renderGroupStep(container) {
  container.innerHTML = `
    <div class="phase-head">
      <div>
        <h2>Ordena cada grupo</h2>
        <p class="intro-text">Elige del 1.º al 4.º. No se puede repetir equipo dentro de un grupo.</p>
      </div>
    </div>
    <div class="group-grid">
      ${groupLetters.map(renderGroupCard).join("")}
    </div>
  `;
}

function renderGroupCard(letter) {
  const prediction = state.groupPredictions[letter];
  const isComplete = isGroupValid(letter);

  return `
    <article class="card">
      <div class="group-title">
        <h3>Grupo ${letter}</h3>
        <span class="complete-badge ${isComplete ? "ok" : ""}">${isComplete ? "Completo" : "Revisar"}</span>
      </div>
      ${[0, 1, 2, 3].map((index) => renderRankRow(letter, index, prediction[index])).join("")}
    </article>
  `;
}

function renderRankRow(letter, index, selectedTeam) {
  const options = groups[letter]
    .map((team) => `<option value="${escapeHtml(team)}" ${team === selectedTeam ? "selected" : ""}>${escapeHtml(team)}</option>`)
    .join("");

  return `
    <label class="rank-row">
      <span class="rank-number">${index + 1}.º</span>
      <select data-group="${letter}" data-index="${index}">
        ${options}
      </select>
      <span class="mini-actions" aria-label="Mover equipo">
        <button class="icon-button" type="button" data-move="${letter}:${index}:-1" ${index === 0 ? "disabled" : ""} title="Subir">↑</button>
        <button class="icon-button" type="button" data-move="${letter}:${index}:1" ${index === 3 ? "disabled" : ""} title="Bajar">↓</button>
      </span>
    </label>
  `;
}

function renderBestThirdsStep(container) {
  const thirds = getThirds();
  const selectedCount = state.bestThirds.length;
  const eliminated = thirds.filter((third) => !state.bestThirds.includes(third.group));

  container.innerHTML = `
    <div class="phase-head">
      <div>
        <h2>Elige los 8 mejores terceros</h2>
        <p class="intro-text">Selecciona exactamente 8 de los 12 terceros.</p>
      </div>
      <span class="counter">${selectedCount}/8</span>
    </div>
    <div class="thirds-grid">
      ${thirds.map(renderThirdOption).join("")}
    </div>
    ${eliminated.length === 4 ? `<p class="hint">Eliminados ahora mismo: ${eliminated.map(formatThird).join(", ")}.</p>` : ""}
  `;
}

function renderThirdOption(third) {
  const checked = state.bestThirds.includes(third.group);
  return `
    <label class="third-option ${checked ? "selected" : ""}">
      <input type="checkbox" value="${third.group}" ${checked ? "checked" : ""}>
      <span><strong>3.º Grupo ${third.group}</strong><br>${escapeHtml(third.team)}</span>
    </label>
  `;
}

function buildRoundOf32() {
  const assignment = assignBestThirds(state.bestThirds);
  state.assignmentNote = assignment.note;

  const thirdByMatch = assignment.slots.reduce((map, slot) => {
    map[slot.matchId] = slot.group;
    return map;
  }, {});

  state.matches.round32 = round32Schema.map((match) => {
    const thirdGroup = thirdByMatch[match.id] || null;
    return {
      id: match.id,
      round: "round32",
      teamA: resolveSeed(match.a),
      teamB: match.b === "3*" ? resolveSeed(`3${thirdGroup}`) : resolveSeed(match.b),
      seedA: match.a,
      seedB: match.b === "3*" ? `3${thirdGroup}` : match.b
    };
  });

  pruneWinnersForExistingMatches();
}

function assignBestThirds(selectedGroups) {
  const remaining = [...selectedGroups];
  const slots = [];
  let approximate = false;

  thirdSlots.forEach((slot) => {
    let index = remaining.findIndex((group) => slot.compatible.includes(group));
    if (index === -1) {
      index = 0;
      approximate = true;
    }

    const group = remaining.splice(index, 1)[0];
    slots.push({ matchId: slot.matchId, group, compatible: slot.compatible.includes(group) });
  });

  return {
    slots,
    note: approximate
      ? "La asignación de algunos terceros es aproximada para uso de porra porque no había una combinación totalmente compatible con esta selección."
      : ""
  };
}

function buildNextRounds() {
  state.matches.round16 = buildRoundFromWinners("round16");
  state.matches.quarterfinals = buildRoundFromWinners("quarterfinals");
  state.matches.semifinals = buildRoundFromWinners("semifinals");
  state.matches.final = buildRoundFromWinners("final");
  state.matches.thirdPlace = buildThirdPlaceMatch();
  pruneWinnersForExistingMatches();
}

function buildRoundFromWinners(roundKey) {
  return nextRoundSchemas[roundKey].map((schema) => ({
    id: schema.id,
    round: roundKey,
    teamA: state.winners[schema.from[0]] || "",
    teamB: state.winners[schema.from[1]] || "",
    from: schema.from
  }));
}

function buildThirdPlaceMatch() {
  return nextRoundSchemas.thirdPlace.map((schema) => ({
    id: schema.id,
    round: "thirdPlace",
    teamA: getLoser(schema.loserFrom[0]),
    teamB: getLoser(schema.loserFrom[1]),
    loserFrom: schema.loserFrom
  }));
}

function buildAvailableMatches() {
  if (validateAllGroups().ok && state.bestThirds.length === 8) {
    buildRoundOf32();
    buildNextRounds();
  }
}

function renderKnockoutStep(container, roundKey) {
  const matches = state.matches[roundKey] || [];
  const note = roundKey === "round32" && state.assignmentNote
    ? `<p class="assignment-note">${escapeHtml(state.assignmentNote)}</p>`
    : "";

  container.innerHTML = `
    <div class="phase-head">
      <div>
        <h2>${roundNames[roundKey]}</h2>
        <p class="intro-text">Toca el equipo que gana cada partido.</p>
      </div>
    </div>
    ${note}
    <div class="match-grid">
      ${matches.map(renderMatchCard).join("")}
    </div>
  `;
}

function renderMatchCard(match) {
  const winner = state.winners[match.id] || "";
  const disabled = !match.teamA || !match.teamB;

  return `
    <article class="match-card">
      <div class="match-meta">Partido ${match.id}</div>
      ${renderTeamChoice(match.id, match.teamA, winner, disabled)}
      ${renderTeamChoice(match.id, match.teamB, winner, disabled)}
    </article>
  `;
}

function renderTeamChoice(matchId, team, winner, disabled) {
  const selected = team && team === winner;
  return `
    <button class="team-choice ${selected ? "selected" : ""}" type="button" data-winner="${matchId}:${escapeAttr(team)}" ${disabled ? "disabled" : ""}>
      ${team ? escapeHtml(team) : "Pendiente"}
    </button>
  `;
}

function renderSummaryStep(container) {
  const summary = generateSummaryText();
  container.innerHTML = `
    <div class="phase-head">
      <div>
        <h2>Resumen final</h2>
        <p class="intro-text">Usa los botones y revisa el texto antes de enviarlo.</p>
      </div>
    </div>
    <div class="summary-actions">
      <button id="copySummaryButton" class="button button-primary" type="button">Copiar resumen</button>
      <button id="downloadSummaryButton" class="button button-secondary" type="button">Descargar resumen .txt</button>
    </div>
    <textarea id="summaryText" class="summary-box" readonly>${escapeHtml(summary)}</textarea>
  `;
}

function selectWinner(matchId, team) {
  const match = findMatchById(matchId);
  if (!match || !team) return;

  state.winners[matchId] = team;
  clearDependentWinners(matchId);
  buildNextRounds();
  renderCurrentStep();
}

function clearDependentWinners(matchId) {
  const dependents = {
    73: [90], 74: [89], 75: [90], 76: [91], 77: [89], 78: [91], 79: [92], 80: [92],
    81: [94], 82: [94], 83: [93], 84: [93], 85: [96], 86: [95], 87: [96], 88: [95],
    89: [97], 90: [97], 91: [99], 92: [99], 93: [98], 94: [98], 95: [100], 96: [100],
    97: [101], 98: [101], 99: [102], 100: [102],
    101: [103, 104], 102: [103, 104]
  };
  const queue = [...(dependents[matchId] || [])];

  while (queue.length) {
    const id = queue.shift();
    delete state.winners[id];
    queue.push(...(dependents[id] || []));
  }
}

function generateSummaryText() {
  const lines = [];
  const podium = getPodium();

  lines.push("PORRA MUNDIAL 2026", "");
  lines.push("FASE DE GRUPOS");
  groupLetters.forEach((letter) => {
    const prediction = state.groupPredictions[letter];
    lines.push(`Grupo ${letter}: 1.º ${prediction[0]}, 2.º ${prediction[1]}, 3.º ${prediction[2]}, 4.º ${prediction[3]}`);
  });

  const thirds = getThirds();
  const passed = thirds.filter((third) => state.bestThirds.includes(third.group));
  const eliminated = thirds.filter((third) => !state.bestThirds.includes(third.group));

  lines.push("", "MEJORES TERCEROS");
  lines.push(`Pasan: ${passed.map(formatThird).join(", ")}`);
  lines.push(`Eliminados: ${eliminated.map(formatThird).join(", ")}`);
  if (state.assignmentNote) lines.push(`Nota: ${state.assignmentNote}`);

  appendRoundSummary(lines, "DIECISEISAVOS", "round32");
  appendRoundSummary(lines, "OCTAVOS", "round16");
  appendRoundSummary(lines, "CUARTOS", "quarterfinals");
  appendRoundSummary(lines, "SEMIFINALES", "semifinals");
  appendRoundSummary(lines, "TERCER PUESTO", "thirdPlace");
  appendRoundSummary(lines, "FINAL", "final");

  lines.push("", "PODIO");
  lines.push(`Campeón: ${podium.champion}`);
  lines.push(`Subcampeón: ${podium.runnerUp}`);
  lines.push(`Tercer puesto: ${podium.third}`);
  lines.push(`Cuarto puesto: ${podium.fourth}`);

  return lines.join("\n");
}

function appendRoundSummary(lines, title, roundKey) {
  lines.push("", title);
  (state.matches[roundKey] || []).forEach((match) => {
    lines.push(`Partido ${match.id}: ${match.teamA} vs ${match.teamB} -> gana ${state.winners[match.id] || "Pendiente"}`);
  });
}

function getPodium() {
  const finalMatch = findMatchById(104);
  const thirdPlaceMatch = findMatchById(103);
  const champion = state.winners[104] || "Pendiente";
  const runnerUp = finalMatch ? getOtherTeam(finalMatch, champion) : "Pendiente";
  const third = state.winners[103] || "Pendiente";
  const fourth = thirdPlaceMatch ? getOtherTeam(thirdPlaceMatch, third) : "Pendiente";

  return { champion, runnerUp, third, fourth };
}

function copySummaryToClipboard() {
  const text = generateSummaryText();
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(
      () => showMessage("Resumen copiado al portapapeles.", "success"),
      () => fallbackCopy(text)
    );
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.getElementById("summaryText");
  if (!textarea) return;
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.setSelectionRange(0, 0);
  showMessage("Resumen copiado al portapapeles.", "success");
}

function downloadSummaryTxt() {
  const blob = new Blob([generateSummaryText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "porra-mundial-2026.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function validateBeforeNext() {
  const stepKey = steps[state.currentStep].key;

  if (stepKey === "groups") return validateAllGroups();
  if (stepKey === "thirds") {
    if (state.bestThirds.length !== 8) {
      return { ok: false, message: `Selecciona exactamente 8 mejores terceros. Ahora hay ${state.bestThirds.length}.` };
    }
    return { ok: true };
  }
  if (["round32", "round16", "quarterfinals", "semifinals", "thirdPlace", "final"].includes(stepKey)) {
    return validateRound(stepKey);
  }

  return { ok: true };
}

function validateAllGroups() {
  const invalid = groupLetters.filter((letter) => !isGroupValid(letter));
  if (invalid.length) {
    return { ok: false, message: `Revisa estos grupos: ${invalid.map((letter) => `Grupo ${letter}`).join(", ")}. Deben tener cuatro equipos distintos.` };
  }
  return { ok: true };
}

function validateRound(roundKey) {
  const missing = (state.matches[roundKey] || []).filter((match) => !state.winners[match.id]);
  if (missing.length) {
    return { ok: false, message: `Falta elegir ganador en: ${missing.map((match) => `Partido ${match.id}`).join(", ")}.` };
  }
  return { ok: true };
}

function isGroupValid(letter) {
  const prediction = state.groupPredictions[letter] || [];
  return prediction.length === 4 && new Set(prediction).size === 4 && prediction.every((team) => groups[letter].includes(team));
}

function getThirds() {
  return groupLetters.map((group) => ({ group, team: state.groupPredictions[group][2] }));
}

function formatThird(third) {
  return `3.º ${third.team} (Grupo ${third.group})`;
}

function resolveSeed(seed) {
  if (!seed || seed === "3null" || seed === "3undefined") return "";
  const position = Number(seed[0]) - 1;
  const group = seed.slice(1);
  return state.groupPredictions[group]?.[position] || "";
}

function findMatchById(matchId) {
  const id = Number(matchId);
  return Object.values(state.matches).flat().find((match) => match.id === id);
}

function getLoser(matchId) {
  const match = findMatchById(matchId);
  const winner = state.winners[matchId];
  if (!match || !winner) return "";
  return getOtherTeam(match, winner);
}

function getOtherTeam(match, team) {
  if (!team || team === "Pendiente") return "Pendiente";
  if (match.teamA === team) return match.teamB || "Pendiente";
  if (match.teamB === team) return match.teamA || "Pendiente";
  return "Pendiente";
}

function pruneWinnersForExistingMatches() {
  Object.values(state.matches).flat().forEach((match) => {
    const winner = state.winners[match.id];
    if (winner && winner !== match.teamA && winner !== match.teamB) {
      delete state.winners[match.id];
    }
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state = {
      ...createInitialState(),
      ...parsed,
      groupPredictions: {
        ...createInitialState().groupPredictions,
        ...(parsed.groupPredictions || {})
      },
      matches: parsed.matches || {},
      winners: parsed.winners || {}
    };
  } catch {
    state = createInitialState();
  }
}

function resetState({ clearStorage = false } = {}) {
  state = createInitialState();
  if (clearStorage) localStorage.removeItem(STORAGE_KEY);
  renderCurrentStep();
}

function updateNavButtons() {
  document.getElementById("prevButton").disabled = state.currentStep === 0;
  document.getElementById("nextButton").textContent = state.currentStep === steps.length - 1 ? "Terminado" : "Siguiente";
  document.getElementById("nextButton").disabled = state.currentStep === steps.length - 1;
}

function showMessage(text, type = "warning") {
  const message = document.getElementById("message");
  message.textContent = text;
  message.className = `message ${type === "success" ? "success" : ""}`;
  message.hidden = false;
}

function clearMessage() {
  const message = document.getElementById("message");
  message.textContent = "";
  message.hidden = true;
  message.className = "message";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return encodeURIComponent(String(value ?? ""));
}

document.addEventListener("change", (event) => {
  if (event.target.matches("select[data-group]")) {
    const group = event.target.dataset.group;
    const index = Number(event.target.dataset.index);
    state.groupPredictions[group][index] = event.target.value;
    state.bestThirds = state.bestThirds.filter((letter) => groupLetters.includes(letter));
    state.winners = {};
    state.matches = {};
    renderCurrentStep();
  }

  if (event.target.matches(".third-option input")) {
    const group = event.target.value;
    if (event.target.checked) {
      if (!state.bestThirds.includes(group)) state.bestThirds.push(group);
    } else {
      state.bestThirds = state.bestThirds.filter((letter) => letter !== group);
    }
    state.winners = {};
    state.matches = {};
    renderCurrentStep();
  }
});

document.addEventListener("click", (event) => {
  const moveButton = event.target.closest("[data-move]");
  if (moveButton) {
    const [group, indexText, directionText] = moveButton.dataset.move.split(":");
    const index = Number(indexText);
    const direction = Number(directionText);
    const nextIndex = index + direction;
    const prediction = state.groupPredictions[group];
    [prediction[index], prediction[nextIndex]] = [prediction[nextIndex], prediction[index]];
    state.winners = {};
    state.matches = {};
    renderCurrentStep();
    return;
  }

  const winnerButton = event.target.closest("[data-winner]");
  if (winnerButton) {
    const [matchIdText, encodedTeam] = winnerButton.dataset.winner.split(":");
    selectWinner(Number(matchIdText), decodeURIComponent(encodedTeam));
    return;
  }

  if (event.target.id === "copySummaryButton") copySummaryToClipboard();
  if (event.target.id === "downloadSummaryButton") downloadSummaryTxt();
});

document.getElementById("prevButton").addEventListener("click", () => {
  if (state.currentStep > 0) {
    state.currentStep -= 1;
    renderCurrentStep();
  }
});

document.getElementById("nextButton").addEventListener("click", () => {
  const validation = validateBeforeNext();
  if (!validation.ok) {
    showMessage(validation.message);
    return;
  }

  if (state.currentStep < steps.length - 1) {
    state.currentStep += 1;
    renderCurrentStep();
  }
});

document.getElementById("resetButton").addEventListener("click", () => {
  if (confirm("¿Quieres reiniciar la porra actual?")) resetState();
});

document.getElementById("clearStorageButton").addEventListener("click", () => {
  if (confirm("¿Quieres borrar los datos guardados y empezar de cero?")) {
    resetState({ clearStorage: true });
    showMessage("Datos guardados borrados.", "success");
  }
});

loadState();
renderCurrentStep();

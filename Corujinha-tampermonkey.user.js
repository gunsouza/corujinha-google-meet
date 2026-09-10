// ==UserScript==
// @name         Corujinha para Google Meet
// @namespace    https://meet.google.com/
// @version      0.16.0
// @description  Registra participantes e chat do Google Meet para uso em bitácoras.
// @author       Gustavo Souza
// @homepageURL  https://github.com/gunsouza/corujinha-google-meet
// @supportURL   https://github.com/gunsouza/corujinha-google-meet/issues
// @updateURL    https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js
// @downloadURL  https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js
// @match        https://meet.google.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  'use strict';

  const VERSION = '0.16.0';
  const STORE_PREFIX = 'corujinha:meeting:';
  const ACTIVE_PREFIX = 'corujinha:active:';
  const SESSION_GAP_MS = 12 * 60 * 60 * 1000;
  const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
  const LANGUAGE = (navigator.language || 'pt').toLowerCase().split('-')[0];
  const LOCALES = {
    pt: {
      capturing: 'Capturando automaticamente', finalized: 'Registro finalizado',
      participants: 'participantes', messages: 'mensagens', chat: 'Chat capturado',
      noMessages: 'Nenhuma mensagem capturada.', noParticipants: 'Nenhum participante detectado.',
      openPeople: 'Abra “Pessoas” para melhorar a identificação.',
      bitacora: 'Copiar bitácora', copyChat: 'Abrir e copiar chat', ata: 'Copiar Ata', sheets: 'Copiar Sheets',
      csv: 'Baixar CSV', history: 'Histórico', scan: 'Escanear agora',
      clear: 'Limpar dados desta Meet', finish: 'Finalizar registro', resume: 'Retomar registro',
      close: 'Fechar', minimize: 'Minimizar', currentMeeting: 'Reunião atual',
      historyTitle: 'Histórico da Corujinha', noHistory: 'Nenhuma reunião salva.',
      delete: 'Excluir', captured: 'capturados', participant: 'participante',
      copiedBitacora: 'Bitácora', copiedChat: 'Chat', copiedAta: 'Ata', copiedSheet: 'Planilha',
      copyDone: 'copiado', noData: 'Nenhum dado para copiar.',
      scanned: 'Participantes escaneados.', stopped: 'Registro finalizado; a captura foi interrompida.',
      resumed: 'Captura retomada.', finalizedScan: 'O registro está finalizado. Retome-o primeiro.',
      cleared: 'Reunião limpa.', deleted: 'Registro excluído.',
      confirmClear: 'Apagar todo o histórico salvo deste link do Meet?',
      confirmDelete: 'Excluir este registro?', entry: 'Entrada',
      incident: 'ID da warroom / incidente', incidentPlaceholder: 'Ex.: INC-12345 (opcional)',
      review: 'Revisar dados capturados', reviewTitle: 'Revisar antes de exportar',
      reviewHelp: 'Corrija nomes e mensagens ou remova itens capturados por engano.',
      save: 'Salvar alterações', cancel: 'Cancelar', remove: 'Remover',
      participantName: 'Nome do participante', sender: 'Remetente', message: 'Mensagem',
      saved: 'Alterações salvas.', incidentId: 'Incidente',
      chatOpen: 'chat aberto', chatClosed: 'chat fechado', updatedNow: 'atualizado agora',
      updatedAt: 'atualizado às', waitingCapture: 'aguardando captura',
      participantsCopied: 'participantes copiados', messagesCopied: 'mensagens copiadas',
      chatStale: 'chat sem novas capturas há {minutes} min',
      unidentifiedMessages: '{count} mensagem(ns) sem remetente identificado. Copiar mesmo assim?',
      suspiciousNames: '{count} nome(s) parecem controles do Meet. Copiar mesmo assim?',
      countMismatch: 'O Meet indica {visible} participante(s), mas a Corujinha capturou {captured}. Copiar mesmo assim?',
      diagnostics: 'Corujinha: diagnóstico', busy: 'Atualizando…',
      chatWrOnly: 'chat disponível somente no modo WR',
      activateWarroom: 'Ativar modo WR', enterMeeting: 'Entre na reunião para ativar o WR',
      waitingJoin: 'aguardando entrada na reunião',
      preflightTitle: 'Iniciar modo Warroom', preflightHelp: 'Confira os dados antes de iniciar a captura oficial.',
      meetingLabel: 'Reunião', chatDetected: 'Chat aberto', chatNotDetected: 'Chat fechado (opcional)',
      openChatNow: 'Abrir chat agora', chatUnavailable: 'Não foi possível abrir o chat do Meet.',
      startWarroom: 'Iniciar modo WR',
      confirmWarroom: 'Ativar o modo Warroom para esta reunião?\n\nA Corujinha começará a capturar o chat e abrirá um relatório quando você sair da chamada.',
      warroomActive: 'modo WR ativo', reportTitle: 'Relatório da warroom',
      reportParticipants: 'Participantes por ordem de entrada', reportChat: 'Chat capturado',
      reportReady: 'Relatório da warroom gerado.', copySection: 'Copiar seção',
    },
    es: {
      capturing: 'Capturando automáticamente', finalized: 'Registro finalizado',
      participants: 'participantes', messages: 'mensajes', chat: 'Chat capturado',
      noMessages: 'Ningún mensaje capturado.', noParticipants: 'Ningún participante detectado.',
      openPeople: 'Abre “Personas” para mejorar la identificación.',
      bitacora: 'Copiar bitácora', copyChat: 'Abrir y copiar chat', ata: 'Copiar acta', sheets: 'Copiar a Sheets',
      csv: 'Descargar CSV', history: 'Historial', scan: 'Escanear ahora',
      clear: 'Limpiar datos de este Meet', finish: 'Finalizar registro', resume: 'Reanudar registro',
      close: 'Cerrar', minimize: 'Minimizar', currentMeeting: 'Reunión actual',
      historyTitle: 'Historial de Corujinha', noHistory: 'No hay reuniones guardadas.',
      delete: 'Eliminar', captured: 'capturados', participant: 'participante',
      copiedBitacora: 'Bitácora', copiedChat: 'Chat', copiedAta: 'Acta', copiedSheet: 'Planilla',
      copyDone: 'copiado', noData: 'No hay datos para copiar.',
      scanned: 'Participantes escaneados.', stopped: 'Registro finalizado; la captura fue detenida.',
      resumed: 'Captura reanudada.', finalizedScan: 'El registro está finalizado. Reanúdalo primero.',
      cleared: 'Reunión limpiada.', deleted: 'Registro eliminado.',
      confirmClear: '¿Eliminar todo el historial guardado de este enlace de Meet?',
      confirmDelete: '¿Eliminar este registro?', entry: 'Entrada',
      incident: 'ID de warroom / incidente', incidentPlaceholder: 'Ej.: INC-12345 (opcional)',
      review: 'Revisar datos capturados', reviewTitle: 'Revisar antes de exportar',
      reviewHelp: 'Corrige nombres y mensajes o elimina elementos capturados por error.',
      save: 'Guardar cambios', cancel: 'Cancelar', remove: 'Eliminar',
      participantName: 'Nombre del participante', sender: 'Remitente', message: 'Mensaje',
      saved: 'Cambios guardados.', incidentId: 'Incidente',
      chatOpen: 'chat abierto', chatClosed: 'chat cerrado', updatedNow: 'actualizado ahora',
      updatedAt: 'actualizado a las', waitingCapture: 'esperando captura',
      participantsCopied: 'participantes copiados', messagesCopied: 'mensajes copiados',
      chatStale: 'chat sin nuevas capturas hace {minutes} min',
      unidentifiedMessages: '{count} mensaje(s) sin remitente identificado. ¿Copiar de todos modos?',
      suspiciousNames: '{count} nombre(s) parecen controles de Meet. ¿Copiar de todos modos?',
      countMismatch: 'Meet indica {visible} participante(s), pero Corujinha capturó {captured}. ¿Copiar de todos modos?',
      diagnostics: 'Corujinha: diagnóstico', busy: 'Actualizando…',
      chatWrOnly: 'chat disponible solo en modo WR',
      activateWarroom: 'Activar modo WR', enterMeeting: 'Entra en la reunión para activar el WR',
      waitingJoin: 'esperando para entrar en la reunión',
      preflightTitle: 'Iniciar modo Warroom', preflightHelp: 'Comprueba los datos antes de iniciar la captura oficial.',
      meetingLabel: 'Reunión', chatDetected: 'Chat abierto', chatNotDetected: 'Chat cerrado (opcional)',
      openChatNow: 'Abrir chat ahora', chatUnavailable: 'No se pudo abrir el chat de Meet.',
      startWarroom: 'Iniciar modo WR',
      confirmWarroom: '¿Activar el modo Warroom para esta reunión?\n\nCorujinha comenzará a capturar el chat y abrirá un informe cuando salgas de la llamada.',
      warroomActive: 'modo WR activo', reportTitle: 'Informe de warroom',
      reportParticipants: 'Participantes por orden de entrada', reportChat: 'Chat capturado',
      reportReady: 'Informe de warroom generado.', copySection: 'Copiar sección',
    },
    en: {
      capturing: 'Capturing automatically', finalized: 'Record finalized',
      participants: 'participants', messages: 'messages', chat: 'Captured chat',
      noMessages: 'No messages captured.', noParticipants: 'No participants detected.',
      openPeople: 'Open “People” to improve identification.',
      bitacora: 'Copy incident log', copyChat: 'Open and copy chat', ata: 'Copy minutes', sheets: 'Copy to Sheets',
      csv: 'Download CSV', history: 'History', scan: 'Scan now',
      clear: 'Clear this Meet data', finish: 'Finalize record', resume: 'Resume record',
      close: 'Close', minimize: 'Minimize', currentMeeting: 'Current meeting',
      historyTitle: 'Corujinha history', noHistory: 'No saved meetings.',
      delete: 'Delete', captured: 'captured', participant: 'participant',
      copiedBitacora: 'Incident log', copiedChat: 'Chat', copiedAta: 'Minutes', copiedSheet: 'Spreadsheet',
      copyDone: 'copied', noData: 'No data to copy.',
      scanned: 'Participants scanned.', stopped: 'Record finalized; capture has stopped.',
      resumed: 'Capture resumed.', finalizedScan: 'The record is finalized. Resume it first.',
      cleared: 'Meeting cleared.', deleted: 'Record deleted.',
      confirmClear: 'Delete all saved history for this Meet link?',
      confirmDelete: 'Delete this record?', entry: 'Entry',
      incident: 'Warroom / incident ID', incidentPlaceholder: 'E.g. INC-12345 (optional)',
      review: 'Review captured data', reviewTitle: 'Review before exporting',
      reviewHelp: 'Correct names and messages or remove items captured by mistake.',
      save: 'Save changes', cancel: 'Cancel', remove: 'Remove',
      participantName: 'Participant name', sender: 'Sender', message: 'Message',
      saved: 'Changes saved.', incidentId: 'Incident',
      chatOpen: 'chat open', chatClosed: 'chat closed', updatedNow: 'updated now',
      updatedAt: 'updated at', waitingCapture: 'waiting for capture',
      participantsCopied: 'participants copied', messagesCopied: 'messages copied',
      chatStale: 'no new chat captures for {minutes} min',
      unidentifiedMessages: '{count} message(s) have no identified sender. Copy anyway?',
      suspiciousNames: '{count} name(s) look like Meet controls. Copy anyway?',
      countMismatch: 'Meet shows {visible} participant(s), but Corujinha captured {captured}. Copy anyway?',
      diagnostics: 'Corujinha: diagnostics', busy: 'Updating…',
      chatWrOnly: 'chat available only in WR mode',
      activateWarroom: 'Enable WR mode', enterMeeting: 'Join the meeting to enable WR mode',
      waitingJoin: 'waiting to join the meeting',
      preflightTitle: 'Start Warroom mode', preflightHelp: 'Check the details before starting the official capture.',
      meetingLabel: 'Meeting', chatDetected: 'Chat open', chatNotDetected: 'Chat closed (optional)',
      openChatNow: 'Open chat now', chatUnavailable: 'Could not open the Meet chat.',
      startWarroom: 'Start WR mode',
      confirmWarroom: 'Enable Warroom mode for this meeting?\n\nCorujinha will start capturing the chat and open a report when you leave the call.',
      warroomActive: 'WR mode active', reportTitle: 'Warroom report',
      reportParticipants: 'Participants by entry order', reportChat: 'Captured chat',
      reportReady: 'Warroom report generated.', copySection: 'Copy section',
    },
  };
  const UI = LOCALES[LANGUAGE] || LOCALES.en;
  const normalize = (value) => (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const now = () => Date.now();
  const inCall = new Set();
  const seenChat = new Set();
  let state;
  let panel;
  let observer;
  let scanTimer;
  let periodicScanTimer;
  let periodicChatTimer;
  let chatScanTimer;
  let toastTimer;
  let launcherButton;
  let lastParticipantScanAt = null;
  let lastChatScanAt = null;
  let actionBusy = false;
  let warroomReportOpened = false;
  let trackingActive = true;
  let insideMeeting = false;

  const IGNORE_WORDS = new Set([
    'você', 'you', 'mute', 'unmute', 'more', 'pin', 'present', 'presenting',
    'raise hand', 'chat', 'people', 'everyone', 'options', 'menu', 'close',
    'participants', 'participantes', 'admit', 'admitir', 'deny', 'negar',
    'remove', 'remover', 'turn on', 'turn off', 'mic', 'camera', 'hand',
    'message', 'mensagem', 'activities', 'atividades', 'reactions', 'reações',
    'tab', 'frame_person', 'frame person', 'listitem', 'button', 'dialog',
    'enviar uma mensagem', 'send a message', 'enviar', 'send', 'mensagens',
  ]);

  const IGNORE_NAME_PATTERNS = [
    /^(?:guia do chrome|chrome guide|guía de chrome)$/i,
    /^(?:faça anotações|take notes|tomar notas)(?:\s*\(.+\))?$/i,
    /^(?:permita que outras pessoas façam anotações|allow others to take notes|permite que otras personas tomen notas)$/i,
    /^(?:janela do app|app window|ventana de la aplicación)$/i,
    /^(?:(?:ativar|desativar|silenciar|reativar)(?:\s+o)?\s+som|(?:mute|unmute)(?:\s+(?:audio|sound))?|(?:activar|desactivar|silenciar)(?:\s+el)?\s+(?:audio|sonido))$/i,
    /^keep(?:_on|_off)?(?:\s+(?:fixar|desafixar|pin|unpin)(?:\s+mensagem|\s+message)?)?$/i,
    /^(?:pedir para o gemini|ask gemini|preguntar a gemini)$/i,
    /^(?:detalhes da reunião|meeting details|detalles de la reunión)$/i,
    /^(?:controles do organizador|host controls|controles del organizador)$/i,
    /^(?:legendas|captions|subtítulos)(?:\s+.+)?$/i,
    /^(?:mensagens na chamada|in-call messages|messages in the call|mensajes de la llamada)$/i,
  ];

  const CHAT_HEADER_PATTERN = /^(?:mensagens na chamada|in-call messages|messages in the call|mensajes de la llamada)$/i;
  const CHAT_BUTTON_PATTERN = /(?:mensagens na chamada|in-call messages|messages in the call|mensajes de la llamada|chat com todos|chat with everyone|chat con todos|conversar com todos|abrir (?:o )?chat|open (?:the )?chat|abrir (?:el )?chat)/i;
  const CHAT_CONTROL_PATTERN = /^(?:(?:keep(?:_on|_off)?)(?:\s+(?:fixar mensagem|desafixar mensagem|pin message|unpin message))?|(?:fixar mensagem|desafixar mensagem|pin message|unpin message|responder|reply|mais opções|more options|enviar|send))$/i;
  const CHAT_CONTROL_SUFFIX_PATTERN = /\s*(?:keep(?:_on|_off)?\s*)?(?:fixar mensagem|desafixar mensagem|pin message|unpin message|responder|reply|mais opções|more options|keep(?:_on|_off)?)\s*$/gi;
  const LEAVE_CONTROL_PATTERN = /(?:sair da chamada|encerrar chamada|leave call|end call|salir de la llamada|abandonar la llamada)/i;
  const MEETING_ENDED_PATTERN = /(?:você saiu da reunião|você saiu da chamada|you left the meeting|you left the call|saliste de la reunión|saliste de la llamada|a reunião terminou|the meeting has ended|la reunión terminó)/i;

  function isName(text) {
    const value = (text || '').trim();
    if (value.length < 2 || value.length > 80) return false;
    if (!/[a-zA-ZÀ-ÿ]/.test(value)) return false;
    if (IGNORE_WORDS.has(value.toLowerCase())) return false;
    if (IGNORE_NAME_PATTERNS.some((pattern) => pattern.test(value))) return false;
    if (/^[a-z][a-z0-9_-]*$/.test(value)) return false;
    if (/[<>={}\[\]]/.test(value)) return false;
    if (/^(?:mais opções para|more options for|ver mais sobre|view more about)\b/i.test(value)) return false;
    if (/\b(?:microfone|microphone|câmera|camera|fixar|pin|ações|actions|opções|options|apresentando|presenting)\b/i.test(value)) return false;
    return value.split(/\s+/).length <= 7;
  }

  function detectInsideMeeting() {
    return [...document.querySelectorAll('button, [role="button"]')].some((control) => {
      const label = [
        control.getAttribute('aria-label'),
        control.getAttribute('data-tooltip'),
        control.getAttribute('title'),
        control.textContent,
      ].filter(Boolean).join(' ');
      return LEAVE_CONTROL_PATTERN.test(label);
    });
  }

  function refreshMeetingPresence() {
    insideMeeting = detectInsideMeeting();
    if (launcherButton) launcherButton.style.display = 'flex';
    return insideMeeting;
  }

  function isSuspiciousName(name) {
    const value = (name || '').trim();
    return !isName(value) ||
      /(?:https?:\/\/|www\.|@|\b(?:chrome|meet|gemini|mensagem|message|mensaje|anotaç|notes?|notas?)\b)/i.test(value) ||
      value.split(/\s+/).length > 7;
  }

  function visibleParticipantCount() {
    const candidates = [];
    document.querySelectorAll('button, [role="button"]').forEach((node) => {
      const label = `${node.getAttribute('aria-label') || ''} ${node.getAttribute('data-tooltip') || ''}`;
      if (!/(?:participantes?|participants?|personas?|people|pessoas)/i.test(label)) return;
      const values = `${label} ${node.textContent || ''}`.match(/\b\d{1,4}\b/g) || [];
      values.forEach((value) => candidates.push(Number(value)));
    });
    return candidates.filter((value) => value > 0 && value < 10000).sort((a, b) => b - a)[0] || null;
  }

  function meetingId() {
    const match = location.pathname.match(/^\/([a-z]{3}-[a-z]{4}-[a-z]{3})(?:\/|$)/i);
    return match ? match[1] : null;
  }

  function meetingName() {
    const title = document.title.replace(/\s*[–-]\s*Google Meet.*$/i, '').trim();
    if (title && !/^(Google )?Meet$/i.test(title)) return title;
    const el = document.querySelector('[data-meeting-title]');
    return el?.getAttribute('data-meeting-title')?.trim() || meetingId() || 'Reunião';
  }

  function storageKey(id, sessionId) {
    return sessionId ? `${STORE_PREFIX}${id}:${sessionId}` : `${STORE_PREFIX}${id}`;
  }

  function activePointerKey(id) {
    return `${ACTIVE_PREFIX}${id}`;
  }

  async function cleanupExpiredRecords() {
    const cutoff = now() - RETENTION_MS;
    const keys = await GM_listValues();
    const deleted = new Set();
    for (const key of keys.filter((item) => item.startsWith(STORE_PREFIX))) {
      const meeting = await GM_getValue(key, null);
      const referenceTime = meeting?.updatedAt || meeting?.startTime || 0;
      if (referenceTime && referenceTime < cutoff) {
        await GM_deleteValue(key);
        deleted.add(key);
      }
    }
    for (const key of keys.filter((item) => item.startsWith(ACTIVE_PREFIX))) {
      const target = await GM_getValue(key, null);
      if (target && deleted.has(target)) await GM_deleteValue(key);
    }
  }

  function createState(id) {
    const startedAt = now();
    const sessionId = String(startedAt);
    return {
      version: VERSION,
      meetingId: id,
      sessionId,
      _storageKey: storageKey(id, sessionId),
      meetingName: meetingName(),
      meetingUrl: location.href,
      selfName: null,
      incidentId: '',
      warroomMode: false,
      warroomArmedAt: null,
      startTime: startedAt,
      lastCaptureAt: null,
      lastChatCaptureAt: null,
      updatedAt: startedAt,
      endTime: null,
      participants: {},
      chat: [],
    };
  }

  async function loadState(id, forceNew = false) {
    if (!forceNew) {
      const activeKey = await GM_getValue(activePointerKey(id), null);
      if (activeKey) {
        const active = await GM_getValue(activeKey, null);
        if (active?.reportGeneratedAt && !active.finalized) {
          active.finalized = true;
          active.endTime ||= active.reportGeneratedAt;
          await GM_setValue(activeKey, active);
        }
        const lastUpdate = active?.updatedAt || active?.startTime || 0;
        if (active?.participants && !active.finalized && now() - lastUpdate < SESSION_GAP_MS) {
          active.sessionId ||= activeKey.split(':').at(-1);
          active._storageKey = activeKey;
          active.incidentId ||= '';
          return active;
        }
        if (active?.participants && !active.finalized) {
          active.finalized = true;
          active.endTime = lastUpdate || now();
          await GM_setValue(activeKey, active);
        }
      }

      const legacyKey = storageKey(id);
      const legacy = await GM_getValue(legacyKey, null);
      if (legacy?.participants) {
        legacy.sessionId ||= String(legacy.startTime || now());
        legacy._storageKey = storageKey(id, legacy.sessionId);
        legacy.incidentId ||= '';
        await GM_setValue(legacy._storageKey, legacy);
        await GM_deleteValue(legacyKey);
        if (!legacy.finalized && now() - (legacy.updatedAt || legacy.startTime || 0) < SESSION_GAP_MS) {
          await GM_setValue(activePointerKey(id), legacy._storageKey);
          return legacy;
        }
      }
    }

    const fresh = createState(id);
    await GM_setValue(activePointerKey(id), fresh._storageKey);
    return fresh;
  }

  async function persist() {
    if (!state?.meetingId) return;
    state.meetingName = meetingName() || state.meetingName;
    state.meetingUrl = location.href;
    state.updatedAt = now();
    state.version = VERSION;
    state.sessionId ||= String(state.startTime || now());
    state._storageKey ||= storageKey(state.meetingId, state.sessionId);
    await GM_setValue(state._storageKey, state);
    await GM_setValue(activePointerKey(state.meetingId), state._storageKey);
    render();
  }

  function restoreActiveParticipants() {
    Object.entries(state.participants || {}).forEach(([key, participant]) => {
      const last = participant.sessions?.at(-1);
      if (last && !last.leaveTime) inCall.add(key);
    });
    (state.chat || []).forEach((message) => seenChat.add(chatKey(message)));
  }

  function join(name, time = now()) {
    if (!trackingActive || !insideMeeting) return false;
    const key = normalize(name);
    if (!key || inCall.has(key)) return false;
    inCall.add(key);
    state.participants[key] ||= { name: name.trim(), sessions: [] };
    state.participants[key].sessions.push({ joinTime: time, leaveTime: null });
    state.lastCaptureAt = time;
    persist();
    return true;
  }

  function leave(name, time = now()) {
    if (!trackingActive) return false;
    const key = normalize(name);
    if (!inCall.has(key)) return false;
    inCall.delete(key);
    const last = state.participants[key]?.sessions?.at(-1);
    if (last && !last.leaveTime) last.leaveTime = time;
    persist();
    return true;
  }

  const TOAST_PATTERNS = [
    { type: 'join', regex: /^(.+?)\s+(?:entrou|joined|se juntou|has joined)(?:\s+(?:na chamada|the call))?\b/i },
    { type: 'leave', regex: /^(.+?)\s+(?:saiu|left|has left|foi removid[oa]|was removed)(?:\s+(?:da chamada|the call))?\b/i },
  ];

  function parseToast(text) {
    const value = (text || '').trim();
    if (!value || value.length > 180) return null;
    for (const pattern of TOAST_PATTERNS) {
      const match = value.match(pattern.regex);
      if (match && isName(match[1])) return { type: pattern.type, name: match[1].trim() };
    }
    return null;
  }

  function extractName(element) {
    if (!(element instanceof Element)) return null;
    const candidates = [];
    const add = (value, priority = 0) => {
      const text = (value || '').trim();
      if (isName(text)) candidates.push({ text, priority });
    };

    const addFromAria = (label) => {
      const value = (label || '').trim();
      const prefixed = value.match(/^(?:mais opções para|more options for|ver mais sobre|view more about)\s+(.+)$/i);
      if (prefixed) add(prefixed[1], 120);

      const suffixed = value.match(/^(.+?)(?:,|\s+-)\s*(?:microfone|microphone|câmera|camera|mais opções|more options|apresentando|presenting).*$/i);
      if (suffixed) add(suffixed[1], 110);

      add(value, 20);
    };

    add(element.getAttribute('data-self-name'), 100);
    addFromAria(element.getAttribute('aria-label'));
    element.querySelectorAll('[data-self-name]').forEach((node) => {
      add(node.getAttribute('data-self-name'), 100);
    });
    element.querySelectorAll('[aria-label]').forEach((node) => {
      addFromAria(node.getAttribute('aria-label'));
    });
    element.querySelectorAll('span, div').forEach((node) => {
      if (node.children.length > 0) return;
      add(node.textContent, 40);
    });

    candidates.forEach((candidate) => {
      const words = candidate.text.split(/\s+/).length;
      if (words >= 2) candidate.priority += 40;
      if (/\(.+\)/.test(candidate.text)) candidate.priority += 20;
      if (/^[A-ZÀ-Ý]/.test(candidate.text)) candidate.priority += 5;
    });
    candidates.sort((a, b) => b.priority - a.priority || b.text.length - a.text.length);
    return candidates[0]?.text || null;
  }

  function participantPanel() {
    return document.querySelector(
      '[aria-label="Pessoas"], [aria-label="People"], [aria-label="Participantes"], ' +
      '[aria-label="Participants"], [data-panel-id="2"]'
    );
  }

  function scanParticipants() {
    if (!trackingActive || !refreshMeetingPresence()) return;
    lastParticipantScanAt = now();
    const found = new Map();
    const peoplePanel = participantPanel();
    const add = (name) => {
      if (isName(name)) found.set(normalize(name), name.trim());
    };

    if (peoplePanel) {
      peoplePanel.querySelectorAll('[role="listitem"], li').forEach((item) => add(extractName(item)));
    }

    document.querySelectorAll(
      '[data-participant-id], [data-self-name], [data-requested-participant-id], [data-allocation-index]'
    ).forEach((item) => add(extractName(item)));

    const detectedSelfName = detectSelfName();
    if (detectedSelfName) state.selfName = detectedSelfName;
    else if (!state.selfName && found.size === 1) state.selfName = [...found.values()][0];

    found.forEach((name, key) => {
      if (!inCall.has(key)) join(name);
    });

    // Só um painel completo e visível é fonte segura para inferir saídas.
    if (peoplePanel && found.size) {
      [...inCall].forEach((key) => {
        if (!found.has(key)) leave(state.participants[key]?.name || key);
      });
    }
  }

  function detectSelfName() {
    for (const node of document.querySelectorAll('[data-self-name]')) {
      const name = (node.getAttribute('data-self-name') || '').trim();
      if (isName(name)) return name;
    }
    for (const node of document.querySelectorAll('[aria-label]')) {
      const label = (node.getAttribute('aria-label') || '').trim();
      const match = label.match(/^(.+?)(?:,|\s*\()\s*(?:você|you|tú|tu)\)?(?:,.*)?$/i);
      if (match && isName(match[1])) return match[1].trim();
    }
    return isName(state?.selfName) ? state.selfName.trim() : null;
  }

  function resolveChatSender(sender) {
    const value = (sender || '').trim();
    if (!/^(?:você|you|tú|tu)$/i.test(value)) return value;
    return detectSelfName() || value;
  }

  function chatKey(message) {
    const normalizedText = (message.text || '').trim().replace(/\s+/g, ' ').toLowerCase();
    return `${normalize(message.sender)}|${normalizedText}|${Math.floor((message.time || 0) / 60000)}|${message.occurrence || 0}`;
  }

  function addChat(sender, text, time = now(), occurrence = 0) {
    if (!trackingActive || !insideMeeting || !state?.warroomMode) return;
    const cleanSender = resolveChatSender(sender);
    const cleanText = (text || '')
      .replace(CHAT_CONTROL_SUFFIX_PATTERN, '')
      .trim();
    if (!cleanSender || CHAT_CONTROL_PATTERN.test(cleanSender) || !cleanText || cleanText.length > 5000) return;
    if (/^(?:enviar uma mensagem|send a message|chat|mensagens?|messages?)$/i.test(cleanText)) return;
    const message = { sender: cleanSender, text: cleanText, time, occurrence };
    const key = chatKey(message);
    if (seenChat.has(key)) return;
    seenChat.add(key);
    state.chat.push(message);
    state.lastCaptureAt = time;
    state.lastChatCaptureAt = time;
    persist();
  }

  function timeFromLabel(label) {
    const match = (label || '').match(/\b(\d{1,2}):(\d{2})\b/);
    if (!match) return now();
    const date = new Date();
    date.setHours(Number(match[1]), Number(match[2]), 0, 0);
    return date.getTime();
  }

  function sanitizeState() {
    if (!isName(state.selfName)) state.selfName = detectSelfName();
    Object.entries(state.participants || {}).forEach(([key, participant]) => {
      if (!isName(participant?.name)) {
        delete state.participants[key];
        inCall.delete(key);
      }
    });
    const sanitizedChat = (state.chat || []).map((message) => ({
      ...message,
      occurrence: Number(message?.occurrence) || 0,
      sender: CHAT_HEADER_PATTERN.test((message?.sender || '').trim())
        ? 'Participante'
        : resolveChatSender(message?.sender),
      text: (message?.text || '')
        .replace(CHAT_CONTROL_SUFFIX_PATTERN, '')
        .trim(),
    })).filter((message) => {
      return Boolean(message?.sender && message?.text) &&
        !CHAT_CONTROL_PATTERN.test(message.sender.trim()) &&
        !( /^ip\s*\d+$/i.test(message.sender.trim()) && /^keep$/i.test(message.text.trim()) ) &&
        !/^(?:enviar uma mensagem|send a message|chat|mensagens?|messages?)$/i.test(message.text);
    });
    const uniqueChat = new Map();
    sanitizedChat.forEach((message) => uniqueChat.set(chatKey(message), message));
    state.chat = [...uniqueChat.values()].sort((a, b) => (a.time || 0) - (b.time || 0));
    if (!state.lastCaptureAt) {
      const participantTimes = Object.values(state.participants || {}).flatMap((participant) =>
        (participant.sessions || []).map((session) => session.joinTime || 0)
      );
      const chatTimes = state.chat.map((message) => message.time || 0);
      state.lastCaptureAt = Math.max(0, ...participantTimes, ...chatTimes) || null;
    }
    if (!state.lastChatCaptureAt) {
      state.lastChatCaptureAt = Math.max(0, ...state.chat.map((message) => message.time || 0)) || null;
    }
    seenChat.clear();
    state.chat.forEach((message) => seenChat.add(chatKey(message)));
  }

  function findChatInput() {
    const selector =
      'textarea[placeholder*="mensagem" i], input[placeholder*="mensagem" i], ' +
      'textarea[placeholder*="mensaje" i], input[placeholder*="mensaje" i], ' +
      'textarea[placeholder*="message" i], input[placeholder*="message" i], ' +
      '[contenteditable="true"][aria-label*="mensagem" i], ' +
      '[contenteditable="true"][aria-label*="mensaje" i], ' +
      '[contenteditable="true"][aria-label*="message" i], ' +
      '[role="textbox"][aria-label*="mensagem" i], ' +
      '[role="textbox"][aria-label*="mensaje" i], ' +
      '[role="textbox"][aria-label*="message" i]';
    return [...document.querySelectorAll(selector)].find((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 20 && rect.height > 10 && style.display !== 'none' && style.visibility !== 'hidden';
    }) || null;
  }

  function findChatButton() {
    return [...document.querySelectorAll('button, [role="button"]')].find((node) => {
      if (node.closest('#corujinha-panel, #corujinha-launcher, #corujinha-preflight')) return false;
      const label = [
        node.getAttribute('aria-label'),
        node.getAttribute('data-tooltip'),
        node.getAttribute('title'),
        node.textContent,
      ].filter(Boolean).join(' ').trim();
      if (!CHAT_BUTTON_PATTERN.test(label)) return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 12 && rect.height > 12 && style.display !== 'none' && style.visibility !== 'hidden';
    }) || null;
  }

  async function ensureChatOpen(timeoutMs = 5000) {
    if (findChatInput()) return true;
    const button = findChatButton();
    if (!button) return false;
    button.click();
    const deadline = now() + timeoutMs;
    while (now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 180));
      if (findChatInput()) return true;
    }
    return false;
  }

  function findChatPanel(input = findChatInput()) {
    if (!input) return null;
    let structuralCandidate = null;
    let ancestor = input.parentElement;
    for (let depth = 0; ancestor && depth < 12; depth++, ancestor = ancestor.parentElement) {
      const text = ancestor.innerText || '';
      const rect = ancestor.getBoundingClientRect();
      if (
        !structuralCandidate &&
        rect.width >= 240 &&
        rect.width <= Math.min(700, window.innerWidth * 0.65) &&
        rect.height >= 300 &&
        rect.right >= window.innerWidth * 0.7
      ) {
        structuralCandidate = ancestor;
      }
      if (CHAT_HEADER_PATTERN.test(text.split('\n')[0]?.trim() || '') && rect.width >= 240 && rect.height >= 250) {
        return ancestor;
      }
      if (
        /(?:Mensagens na chamada|In-call messages|Messages in the call|Mensajes de la llamada)/i.test(text) &&
        rect.width >= 240 && rect.height >= 250
      ) {
        return ancestor;
      }
    }
    return structuralCandidate;
  }

  function scanChat() {
    // Privacidade: fora do modo WR, a Corujinha não inspeciona mensagens do Meet.
    if (!trackingActive || !state?.warroomMode || !refreshMeetingPresence()) return;
    lastChatScanAt = now();
    const input = findChatInput();
    updateLiveStatus(Boolean(input));
    if (!input) return;

    const chatPanel = findChatPanel(input);
    if (!chatPanel) return;

    const panelRect = chatPanel.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const controls = CHAT_CONTROL_PATTERN;
    const ignored = /(?:chat contínuo|continuous chat|chat continuo|mensagens não ficarão|messages won.t be saved|los mensajes no se guardarán|permitir que os participantes|allow participants|permitir que los participantes|Mensagens na chamada|In-call messages|Messages in the call|Mensajes de la llamada)/i;
    const bubbles = new Map();

    chatPanel.querySelectorAll('div, span, p').forEach((node) => {
      const text = (node.innerText || node.textContent || '').trim();
      if (!text || text.length > 5000 || controls.test(text) || ignored.test(text)) return;
      if (/^\d{1,2}:\d{2}$/.test(text)) return;

      const rect = node.getBoundingClientRect();
      if (
        rect.width < 12 || rect.height < 12 || rect.height > 180 ||
        rect.bottom >= inputRect.top || rect.top <= panelRect.top + 35
      ) return;

      let bubble = node;
      for (let level = 0; bubble && level < 4; level++, bubble = bubble.parentElement) {
        if (!chatPanel.contains(bubble)) break;
        const style = getComputedStyle(bubble);
        const bg = style.backgroundColor;
        const radius = parseFloat(style.borderRadius) || 0;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && radius >= 6) {
          const bubbleText = (bubble.innerText || bubble.textContent || '').trim();
          if (bubbleText && !ignored.test(bubbleText) && !controls.test(bubbleText)) {
            const bubbleRect = bubble.getBoundingClientRect();
            const key = `${Math.round(bubbleRect.top)}|${bubbleText}`;
            bubbles.set(key, { node: bubble, text: bubbleText, rect: bubbleRect });
          }
          break;
        }
      }
    });

    const timeLabels = [...chatPanel.querySelectorAll('div, span, time')]
      .map((node) => ({ text: (node.textContent || '').trim(), rect: node.getBoundingClientRect() }))
      .filter((item) => /^\d{1,2}:\d{2}$/.test(item.text));

    const bubbleNodes = [...bubbles.values()].map((bubble) => bubble.node);
    const senderLabels = [...chatPanel.querySelectorAll('div, span')]
      .map((node) => {
        const raw = (node.innerText || node.textContent || '').trim();
        const name = raw.replace(/\s+\d{1,2}:\d{2}\s*$/, '').trim();
        const time = raw.match(/\b\d{1,2}:\d{2}\s*$/)?.[0]?.trim() || '';
        return { node, raw, name, time, rect: node.getBoundingClientRect() };
      })
      .filter((item) => {
        if (!item.raw || item.raw.length > 140 || item.rect.height > 65) return false;
        if (ignored.test(item.raw) || controls.test(item.raw) || controls.test(item.name) || CHAT_HEADER_PATTERN.test(item.name)) return false;
        if (!(isName(item.name) || /^(?:você|you|tú|tu)$/i.test(item.name))) return false;
        if (bubbleNodes.some((bubbleNode) => bubbleNode.contains(item.node))) return false;
        const sameLineTime = timeLabels.some((label) => {
          const verticalDistance = Math.abs((label.rect.top + label.rect.height / 2) - (item.rect.top + item.rect.height / 2));
          return verticalDistance <= 18 && label.rect.left >= item.rect.left;
        });
        return Boolean(item.time || sameLineTime);
      });

    const lastSenderBySide = { left: null, right: detectSelfName() || 'Você' };
    const occurrences = new Map();
    [...bubbles.values()]
      .sort((a, b) => a.rect.top - b.rect.top)
      .forEach((bubble) => {
        const nearbySender = senderLabels
          .filter((item) => {
            const verticalGap = bubble.rect.top - item.rect.bottom;
            const horizontalGap = Math.abs(item.rect.left - bubble.rect.left);
            return verticalGap >= -4 && verticalGap <= 700 && horizontalGap <= 180;
          })
          .sort((a, b) => b.rect.bottom - a.rect.bottom)[0];
        const label = nearbySender?.time || [...timeLabels]
          .filter((item) => item.rect.top <= bubble.rect.top)
          .sort((a, b) => b.rect.top - a.rect.top)[0]?.text;
        const onRight = bubble.rect.left + bubble.rect.width / 2 > panelRect.left + panelRect.width / 2;
        const side = onRight ? 'right' : 'left';
        const aria = bubble.node.getAttribute('aria-label') || '';
        const senderMatch = aria.match(/(?:de|from)\s+(.+?)(?::|,|$)/i);
        const explicitSender = senderMatch?.[1]?.trim() || nearbySender?.name;
        if (explicitSender && !CHAT_HEADER_PATTERN.test(explicitSender) && !controls.test(explicitSender)) lastSenderBySide[side] = explicitSender;
        const sender = lastSenderBySide[side] || (onRight ? (detectSelfName() || 'Você') : 'Participante');
        const cleanText = bubble.text
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line && !controls.test(line) && !/^\d{1,2}:\d{2}$/.test(line))
          .join('\n');
        const baseKey = `${normalize(sender)}|${cleanText.replace(/\s+/g, ' ').toLowerCase()}|${label || ''}`;
        const occurrence = occurrences.get(baseKey) || 0;
        occurrences.set(baseKey, occurrence + 1);
        addChat(sender, cleanText, timeFromLabel(label), occurrence);
      });
  }

  async function captureLoadedChatHistory() {
    if (!state?.warroomMode || !trackingActive) return false;
    if (!await ensureChatOpen()) return false;

    const input = findChatInput();
    const chatPanel = findChatPanel(input);
    if (!chatPanel) return false;
    const scrollable = [...chatPanel.querySelectorAll('*')]
      .filter((node) => {
        const style = getComputedStyle(node);
        return node.clientHeight >= 100 && node.scrollHeight > node.clientHeight + 20 &&
          /(?:auto|scroll)/.test(style.overflowY);
      })
      .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];

    if (!scrollable) {
      scanChat();
      await new Promise((resolve) => setTimeout(resolve, 250));
      scanChat();
      return true;
    }

    const step = Math.max(120, Math.floor(scrollable.clientHeight * 0.7));
    let position = 0;
    let iterations = 0;
    while (iterations < 80) {
      const maximum = Math.max(0, scrollable.scrollHeight - scrollable.clientHeight);
      scrollable.scrollTop = Math.min(position, maximum);
      scrollable.dispatchEvent(new Event('scroll', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 160));
      scanChat();
      if (position >= maximum) break;
      position = Math.min(position + step, maximum);
      iterations += 1;
    }
    scrollable.scrollTop = scrollable.scrollHeight;
    scrollable.dispatchEvent(new Event('scroll', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 220));
    scanChat();
    sanitizeState();
    await persist();
    return true;
  }

  function scheduleChatScan() {
    clearTimeout(chatScanTimer);
    chatScanTimer = setTimeout(scanChat, 350);
  }

  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scanParticipants, 700);
  }

  function startObserver() {
    if (observer) observer.disconnect();
    clearInterval(periodicScanTimer);
    clearInterval(periodicChatTimer);
    observer = new MutationObserver((mutations) => {
      refreshMeetingPresence();
      let changed = false;
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          const toast = parseToast(node.textContent);
          if (toast) toast.type === 'join' ? join(toast.name) : leave(toast.name);
          const addedText = (node.textContent || '').trim();
          if (addedText.length < 600 && MEETING_ENDED_PATTERN.test(addedText)) triggerWarroomReport();
          changed = true;
        });
        if (mutation.removedNodes.length) changed = true;
      }
      if (changed) {
        scheduleScan();
        scheduleChatScan();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    periodicScanTimer = setInterval(scanParticipants, 5000);
    periodicChatTimer = setInterval(scanChat, 2000);
  }

  function stopTracking() {
    const stoppedAt = now();
    trackingActive = false;
    observer?.disconnect();
    clearInterval(periodicScanTimer);
    clearInterval(periodicChatTimer);
    clearTimeout(scanTimer);
    clearTimeout(chatScanTimer);
    [...inCall].forEach((key) => {
      const last = state.participants[key]?.sessions?.at(-1);
      if (last && !last.leaveTime) last.leaveTime = stoppedAt;
    });
    inCall.clear();
    state.endTime = stoppedAt;
    state.finalized = true;
    persist();
  }

  function resumeTracking() {
    trackingActive = true;
    state.endTime = null;
    state.finalized = false;
    startObserver();
    scanParticipants();
    persist();
  }

  function participantsInOrder(target = state) {
    return Object.values(target.participants || {}).sort(
      (a, b) => (a.sessions?.[0]?.joinTime || 0) - (b.sessions?.[0]?.joinTime || 0)
    );
  }

  function fmtTime(time, seconds = false) {
    if (!time) return '—';
    return new Date(time).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', ...(seconds ? { second: '2-digit' } : {}),
    });
  }

  function fmtDate(time) {
    return new Date(time || now()).toLocaleDateString('pt-BR');
  }

  function durationMs(sessions, until = now()) {
    return (sessions || []).reduce((total, session) => {
      return total + Math.max(0, (session.leaveTime || until) - session.joinTime);
    }, 0);
  }

  function fmtDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }

  function cleanCopyText(value, preserveLines = false) {
    const cleaned = String(value || '')
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
      .replace(/\u00A0/g, ' ')
      .replace(/[\t\r]+/g, ' ');
    if (!preserveLines) return cleaned.replace(/\s+/g, ' ').trim();
    return cleaned.split('\n')
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join('\n');
  }

  function buildBitacora(target = state) {
    return participantsInOrder(target)
      .map((participant) => `${cleanCopyText(participant.name)} - ${fmtTime(participant.sessions?.[0]?.joinTime)}`)
      .join('\n');
  }

  function buildChat(target = state) {
    return (target.chat || [])
      .slice()
      .sort((a, b) => (a.time || 0) - (b.time || 0))
      .map((message) => `${fmtTime(message.time)} ${cleanCopyText(message.sender)}: ${cleanCopyText(message.text, true)}`)
      .join('\n');
  }

  async function refreshBeforeCopy() {
    // Remove falsos controles primeiro para permitir uma recaptura correta no mesmo ciclo.
    sanitizeState();
    if (trackingActive) {
      scanParticipants();
      scanChat();
      await new Promise((resolve) => setTimeout(resolve, 180));
      scanParticipants();
      scanChat();
    }
    sanitizeState();
    await persist();
  }

  function buildAta(target = state) {
    const participants = participantsInOrder(target);
    const lines = [
      'LISTA DE PRESENÇA — REUNIÃO',
      `Reunião: ${target.meetingName || target.meetingId}`,
    ];
    if (target.incidentId) lines.push(`Incidente: ${target.incidentId}`);
    lines.push(
      `Data: ${fmtDate(target.startTime)}`,
      `Início: ${fmtTime(target.startTime)}`,
      '',
      'PARTICIPANTES — por ordem de entrada',
    );
    participants.forEach((participant, index) => {
      const first = participant.sessions?.[0];
      lines.push(`${index + 1}. ${participant.name} - ${fmtTime(first?.joinTime)}`);
    });
    if (target.chat?.length) {
      lines.push('', 'CHAT DA REUNIÃO');
      target.chat.forEach((message) => {
        lines.push(`${fmtTime(message.time)} ${message.sender ? `${message.sender}: ` : ''}${message.text}`);
      });
    }
    return lines.join('\n');
  }

  function buildSheets(target = state) {
    const rows = [
      ['Reunião', target.meetingName || target.meetingId],
    ];
    if (target.incidentId) rows.push(['Incidente', target.incidentId]);
    rows.push(
      ['Data', fmtDate(target.startTime)],
      ['Início', fmtTime(target.startTime)],
      [],
      ['#', 'Nome', 'Horário de entrada'],
    );
    participantsInOrder(target).forEach((participant, index) => {
      const first = participant.sessions?.[0];
      rows.push([
        index + 1,
        participant.name,
        fmtTime(first?.joinTime, true),
      ]);
    });
    return rows.map((row) => row.join('\t')).join('\n');
  }

  function buildCsv(target = state) {
    const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = [['#', 'Nome', 'Horário de entrada', 'Reunião', 'ID do incidente']];
    participantsInOrder(target).forEach((participant, index) => {
      rows.push([
        index + 1,
        participant.name,
        fmtTime(participant.sessions?.[0]?.joinTime, true),
        target.meetingName || target.meetingId,
        target.incidentId || '',
      ]);
    });
    return '\ufeff' + rows.map((row) => row.map(quote).join(',')).join('\n');
  }

  async function copyText(text, label, successMessage = '') {
    if (!text) return showToast(UI.noData);
    await navigator.clipboard.writeText(text);
    showToast(successMessage || `${label}: ${UI.copyDone}.`);
  }

  function downloadCsv(target = state) {
    const csv = buildCsv(target);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const filename = `corujinha-${target.meetingId}-${fmtDate(target.startTime).replaceAll('/', '-')}.csv`;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
    }[char]));
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #corujinha-launcher{position:fixed;right:16px;top:92px;z-index:2147483646;width:76px;height:42px;padding:0 7px;display:flex;align-items:center;justify-content:center;gap:5px;border:2px solid #8ab4f8;border-radius:14px;background:#1a73e8;color:#fff;cursor:grab;touch-action:none;box-shadow:0 8px 22px #0005;transition:transform .15s,background .15s,border-color .15s}#corujinha-launcher:hover{transform:translateY(-2px);background:#1765cc}#corujinha-launcher.dragging{cursor:grabbing;transform:none!important;transition:none}#corujinha-launcher.wr-active{border-color:#34a853;background:#188038}.cj-launcher-owl{font-size:19px;line-height:1}.cj-launcher-count{min-width:28px;overflow:hidden;padding:2px 4px;border-radius:7px;background:#ffffff26;font-size:9px;font-weight:750;line-height:1.2;white-space:nowrap}
      #corujinha-panel{position:fixed;right:70px;top:92px;z-index:2147483647;width:390px;max-width:calc(100vw - 24px);height:auto;max-height:78vh;min-width:290px;min-height:180px;resize:both;display:none;flex-direction:column;background:#fff;color:#202124;border:1px solid #dfe3eb;border-radius:16px;box-shadow:0 18px 48px #0006;font:13px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;overflow:hidden}
      #corujinha-panel.open{display:flex}#corujinha-panel *{box-sizing:border-box}
      #corujinha-panel.minimized{width:260px!important;height:auto!important;min-height:0;resize:none}#corujinha-panel.minimized>.cj-incident,#corujinha-panel.minimized>.cj-stats,#corujinha-panel.minimized>.cj-body,#corujinha-panel.minimized>.cj-chatbox,#corujinha-panel.minimized>.cj-actions{display:none}
      .cj-head{padding:13px 14px;background:#fff;border-bottom:1px solid #edf0f5;display:flex;justify-content:space-between;align-items:center;cursor:move;user-select:none}.cj-brand{display:flex;align-items:center;gap:10px;min-width:0}.cj-brand-icon{width:36px;height:36px;display:grid;place-items:center;flex:0 0 auto;border-radius:11px;background:#e8f0fe;font-size:20px}.cj-title{font-size:15px;font-weight:750;color:#174ea6;line-height:1.2}.cj-muted{max-width:240px;margin-top:2px;font-size:11px;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cj-capture-state{display:inline-flex;align-items:center;margin-top:5px;padding:3px 7px;border-radius:999px;background:#e6f4ea;font-size:10px;font-weight:650;color:#137333}.cj-capture-state::before{content:'●';margin-right:5px;font-size:8px}.cj-capture-state.chat-closed{background:#fef7e0;color:#8a5700}.cj-capture-state.stopped{background:#f1f3f4;color:#6b7280}.cj-head-actions{display:flex;gap:6px}.cj-head-actions button{width:29px;height:29px;border:1px solid #d7dce5;background:#fff;color:#4b5563;border-radius:8px;cursor:pointer;font-size:15px}.cj-head-actions button:hover{background:#f4f6f9}
      .cj-incident{display:block;padding:10px 14px;background:#fff;border-bottom:1px solid #edf0f5}.cj-incident span{display:block;margin-bottom:5px;color:#667085;font-size:10px;font-weight:650;text-transform:uppercase;letter-spacing:.04em}.cj-incident input{width:100%;height:34px;padding:7px 10px;border:1px solid #d7dce5;border-radius:8px;background:#fafbfe;color:#263142;font:12px inherit;outline:none}.cj-incident input:focus{border-color:#1a73e8;box-shadow:0 0 0 3px #e8f0fe;background:#fff}.cj-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px 14px;background:#f8fafe;border-bottom:1px solid #edf0f5}.cj-stat{padding:11px 10px;text-align:left;background:#fff;border:1px solid #e7ebf2;border-radius:11px;color:#667085;font-size:11px}.cj-stat b{display:block;margin-bottom:2px;font-size:22px;line-height:1;color:#1f2937}.cj-body{overflow:auto;max-height:330px;background:#fff}
      .cj-person{display:grid;grid-template-columns:30px 1fr;gap:9px;align-items:center;padding:10px 14px;border-bottom:1px solid #f0f2f6}.cj-person:hover{background:#fafbfe}.cj-order{width:26px;height:26px;display:grid;place-items:center;border-radius:8px;background:#eef3fd;color:#3767a6;font-size:11px;font-weight:750}.cj-name{font-weight:650;color:#263142}.cj-time{margin-top:2px;font-size:11px;color:#7b8494}
      .cj-chatbox{border-top:1px solid #edf0f5;background:#fff}.cj-chatbox summary{padding:11px 14px;font-weight:650;color:#344054;cursor:pointer;list-style-position:inside}.cj-chatbox summary:hover{background:#f8fafe}.cj-chat-list{max-height:170px;overflow:auto;background:#f8fafe}.cj-message{padding:9px 14px;border-top:1px solid #edf0f5;font-size:11px;line-height:1.45;color:#344054}.cj-message b{color:#1769d1}.cj-message time{color:#98a2b3;margin-right:7px}
      .cj-empty{padding:30px 18px;text-align:center;color:#7b8494;line-height:1.5}.cj-actions{padding:12px 14px 14px;display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#f8fafe;border-top:1px solid #e7ebf2}.cj-actions button{min-height:38px;border:1px solid #d7dce5;background:#fff;color:#344054;border-radius:9px;padding:8px 10px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:650;transition:background .15s,border-color .15s,transform .1s}.cj-actions button:hover{background:#f2f5fa;border-color:#bdc5d2}.cj-actions button:active{transform:scale(.99)}.cj-actions .primary{grid-column:1/-1;min-height:42px;background:#1a73e8;color:#fff;border-color:#1a73e8;font-size:13px}.cj-actions .primary:hover{background:#1765cc;border-color:#1765cc}.cj-actions .review,.cj-actions .scan,.cj-actions .finish,.cj-actions .danger{grid-column:1/-1}.cj-actions .review{background:#fff;color:#174ea6;border-color:#b8cef0}.cj-actions .scan{background:#eef4ff;color:#285ea8;border-color:#d8e6fb}.cj-actions .finish{background:#fff}.cj-actions .danger{background:#fff8f7;color:#c5221f;border-color:#f1d0cc}
      #corujinha-history{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:20px;background:#111827b3;font:13px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}#corujinha-history.open{display:flex}#corujinha-history *{box-sizing:border-box}.cj-history-dialog{width:min(720px,95vw);max-height:86vh;display:flex;flex-direction:column;background:#fff;color:#202124;border:1px solid #dfe3eb;border-radius:16px;box-shadow:0 22px 70px #0007;overflow:hidden}.cj-history-head{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid #e7ebf2}.cj-history-head strong{font-size:17px;color:#174ea6}.cj-history-head button{width:30px;height:30px;background:#fff;border:1px solid #d7dce5;border-radius:8px;cursor:pointer}.cj-history-list{padding:14px;overflow:auto;background:#f8fafe}.cj-history-card{margin-bottom:10px;background:#fff;border:1px solid #dfe3eb;border-radius:11px;overflow:hidden}.cj-history-summary{padding:13px 14px;cursor:pointer}.cj-history-summary:hover{background:#fafbfe}.cj-history-name{font-weight:700;color:#263142}.cj-history-meta{margin-top:4px;color:#7b8494;font-size:11px}.cj-history-content{padding:0 14px 11px}.cj-history-person,.cj-history-message{padding:7px 0;border-top:1px solid #f0f2f6;font-size:12px}.cj-history-message time{color:#98a2b3;margin-right:6px}.cj-history-card-actions{display:flex;flex-wrap:wrap;gap:7px;padding:10px 12px;background:#f8fafe;border-top:1px solid #e7ebf2}.cj-history-card-actions button{padding:7px 10px;background:#fff;border:1px solid #d7dce5;border-radius:7px;cursor:pointer;font-size:11px;font-weight:600}.cj-history-card-actions button:hover{background:#eef3f9}.cj-history-card-actions .danger{color:#c5221f}.cj-history-empty{padding:42px;text-align:center;color:#7b8494}
      #corujinha-review{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;background:#111827b3;font:13px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}#corujinha-review *{box-sizing:border-box}.cj-review-dialog{width:min(760px,96vw);max-height:88vh;display:flex;flex-direction:column;background:#fff;color:#202124;border-radius:16px;box-shadow:0 22px 70px #0007;overflow:hidden}.cj-review-head{display:flex;justify-content:space-between;align-items:flex-start;padding:16px 18px;border-bottom:1px solid #e7ebf2}.cj-review-head strong{display:block;font-size:17px;color:#174ea6}.cj-review-help{margin-top:4px;color:#7b8494;font-size:11px}.cj-review-close{width:30px;height:30px;background:#fff;border:1px solid #d7dce5;border-radius:8px;cursor:pointer}.cj-review-body{padding:14px 18px;overflow:auto;background:#f8fafe}.cj-review-section{margin-bottom:16px}.cj-review-section h3{margin:0 0 8px;font-size:12px;color:#344054}.cj-review-section>input{width:100%;padding:8px 9px;border:1px solid #d7dce5;border-radius:8px;background:#fff;color:#263142;font:12px inherit}.cj-review-row{display:grid;grid-template-columns:34px 1fr auto;gap:8px;align-items:center;margin-bottom:7px}.cj-review-row.chat{grid-template-columns:120px 1fr auto}.cj-review-row input,.cj-review-row textarea{width:100%;padding:8px 9px;border:1px solid #d7dce5;border-radius:8px;background:#fff;color:#263142;font:12px inherit;resize:vertical}.cj-review-row textarea{min-height:38px}.cj-review-index{color:#7b8494;text-align:center;font-size:11px}.cj-review-remove{padding:7px 9px;border:1px solid #f1d0cc;border-radius:7px;background:#fff8f7;color:#c5221f;cursor:pointer;font-size:11px}.cj-review-row.removed{display:none}.cj-review-footer{display:flex;justify-content:flex-end;gap:8px;padding:12px 18px;border-top:1px solid #e7ebf2}.cj-review-footer button{padding:9px 14px;border:1px solid #d7dce5;border-radius:8px;background:#fff;cursor:pointer;font-weight:650}.cj-review-footer .save{background:#1a73e8;color:#fff;border-color:#1a73e8}
      #corujinha-panel{width:310px;min-width:260px;min-height:0;max-height:none;resize:none;border-radius:13px}.cj-head{padding:10px 11px}.cj-brand{gap:8px}.cj-brand-icon{width:31px;height:31px;border-radius:9px;font-size:17px}.cj-title{font-size:14px}.cj-muted{max-width:185px;font-size:10px}.cj-capture-state{margin-top:3px;padding:2px 6px;font-size:9px}.cj-compact-summary{padding:9px 12px;text-align:center;background:#f8fafe;border-bottom:1px solid #e7ebf2;color:#667085;font-size:11px}.cj-compact-summary b{color:#263142}.cj-actions{display:flex;flex-direction:column;padding:10px 12px 12px;gap:7px}.cj-actions button,.cj-actions .primary{width:100%;min-height:36px;font-size:12px}.cj-actions button:disabled{opacity:.62;cursor:wait;transform:none}.cj-actions .copy-chat{background:#fff;color:#174ea6;border-color:#b8cef0}.cj-actions .wr-start{background:#188038;color:#fff;border-color:#188038}.cj-actions .history-link{background:transparent;border-color:transparent;color:#174ea6;min-height:30px;font-size:11px}.cj-actions .danger{background:transparent;border-color:transparent;color:#b42318;font-size:11px;min-height:30px}.cj-actions .danger:hover{background:#fff1f0;border-color:#f1d0cc}
      #corujinha-launcher.wr-active::after{content:'WR';position:absolute;right:-7px;top:-7px;padding:2px 4px;border-radius:6px;background:#7c3aed;color:#fff;border:2px solid #fff;font-size:8px;font-weight:800;letter-spacing:.03em}.cj-warroom-overlay{position:fixed;inset:0;z-index:2147483647;padding:22px;background:#f4f6fa;color:#1f2937;overflow:auto;font:14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}.cj-warroom-overlay .cj-report-shell{max-width:900px;margin:0 auto}.cj-report-close{position:fixed;right:20px;top:18px;width:34px;height:34px;border:1px solid #d7dce5;border-radius:9px;background:#fff;cursor:pointer;font-size:18px}
      #corujinha-preflight{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:18px;background:#11182799;font:13px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}#corujinha-preflight *{box-sizing:border-box}.cj-preflight-card{width:min(390px,96vw);overflow:hidden;border:1px solid #dfe3eb;border-radius:15px;background:#fff;color:#263142;box-shadow:0 22px 65px #0007}.cj-preflight-head{padding:17px 18px 13px;border-bottom:1px solid #edf0f5}.cj-preflight-head strong{display:block;color:#174ea6;font-size:17px}.cj-preflight-help{margin-top:5px;color:#7b8494;font-size:11px}.cj-preflight-body{padding:14px 18px}.cj-preflight-row{display:flex;justify-content:space-between;gap:14px;padding:8px 0;border-bottom:1px solid #f0f2f6}.cj-preflight-row span{color:#7b8494}.cj-preflight-row b{text-align:right}.cj-preflight-open-chat{width:100%;min-height:34px;margin-top:10px;border:1px solid #b8cef0;border-radius:8px;background:#eef4ff;color:#174ea6;cursor:pointer;font-weight:700}.cj-preflight-open-chat:disabled{opacity:.65;cursor:wait}.cj-preflight-field{display:block;margin-top:14px;color:#667085;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.cj-preflight-field input{width:100%;height:38px;margin-top:6px;padding:8px 10px;border:1px solid #d7dce5;border-radius:8px;background:#fafbfe;color:#263142;font:13px inherit;outline:none}.cj-preflight-field input:focus{border-color:#1a73e8;box-shadow:0 0 0 3px #e8f0fe;background:#fff}.cj-preflight-actions{display:flex;gap:8px;padding:12px 18px 16px}.cj-preflight-actions button{flex:1;min-height:38px;border:1px solid #d7dce5;border-radius:9px;background:#fff;color:#344054;cursor:pointer;font-weight:700}.cj-preflight-actions .start{background:#188038;border-color:#188038;color:#fff}
      #corujinha-toast{position:fixed;right:24px;bottom:26px;z-index:2147483647;background:#1f2937;color:#fff;padding:10px 14px;border-radius:9px;box-shadow:0 8px 24px #0005;font:12px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;opacity:0;transform:translateY(8px);transition:.2s;pointer-events:none}#corujinha-toast.show{opacity:1;transform:none}
    `;
    document.head.appendChild(style);
  }

  function element(tag, options = {}, children = []) {
    const node = document.createElement(tag);
    if (options.id) node.id = options.id;
    if (options.className) node.className = options.className;
    if (options.text !== undefined) node.textContent = options.text;
    if (options.title) node.title = options.title;
    if (options.ariaLabel) node.setAttribute('aria-label', options.ariaLabel);
    const items = Array.isArray(children) ? children : [children];
    items.filter(Boolean).forEach((child) => node.append(child));
    return node;
  }

  function cloneMeeting(target) {
    return JSON.parse(JSON.stringify(target));
  }

  function openReview(target = state, afterSave) {
    document.querySelector('#corujinha-review')?.remove();
    const draft = cloneMeeting(target);
    const overlay = element('div', { id: 'corujinha-review' });
    const dialog = element('section', { className: 'cj-review-dialog' });
    const closeReview = () => overlay.remove();
    const close = element('button', { className: 'cj-review-close', text: '×', ariaLabel: UI.close });
    close.onclick = closeReview;
    dialog.append(element('div', { className: 'cj-review-head' }, [
      element('div', {}, [
        element('strong', { text: UI.reviewTitle }),
        element('div', { className: 'cj-review-help', text: UI.reviewHelp }),
      ]),
      close,
    ]));

    const body = element('div', { className: 'cj-review-body' });
    const incidentSection = element('section', { className: 'cj-review-section' }, [
      element('h3', { text: UI.incident }),
    ]);
    const incidentInput = element('input', { ariaLabel: UI.incident });
    incidentInput.value = draft.incidentId || '';
    incidentInput.placeholder = UI.incidentPlaceholder;
    incidentSection.append(incidentInput);
    body.append(incidentSection);

    const participantRows = [];
    const participantSection = element('section', { className: 'cj-review-section' }, [
      element('h3', { text: `${UI.participants} (${participantsInOrder(draft).length})` }),
    ]);
    participantsInOrder(draft).forEach((participant, index) => {
      const row = element('div', { className: 'cj-review-row' });
      const input = element('input', { ariaLabel: UI.participantName });
      input.value = participant.name || '';
      const remove = element('button', { className: 'cj-review-remove', text: UI.remove });
      const item = { row, input, participant, removed: false };
      remove.onclick = () => { item.removed = true; row.classList.add('removed'); };
      row.append(
        element('span', { className: 'cj-review-index', text: `#${index + 1}` }),
        input,
        remove,
      );
      participantRows.push(item);
      participantSection.append(row);
    });
    if (!participantRows.length) participantSection.append(element('div', { className: 'cj-review-help', text: UI.noParticipants }));
    body.append(participantSection);

    const chatRows = [];
    const chatSection = element('section', { className: 'cj-review-section' }, [
      element('h3', { text: `${UI.chat} (${draft.chat?.length || 0})` }),
    ]);
    (draft.chat || []).forEach((message) => {
      const row = element('div', { className: 'cj-review-row chat' });
      const sender = element('input', { ariaLabel: UI.sender });
      const textInput = element('textarea', { ariaLabel: UI.message });
      sender.value = message.sender || '';
      textInput.value = message.text || '';
      const remove = element('button', { className: 'cj-review-remove', text: UI.remove });
      const item = { row, sender, textInput, message, removed: false };
      remove.onclick = () => { item.removed = true; row.classList.add('removed'); };
      row.append(sender, textInput, remove);
      chatRows.push(item);
      chatSection.append(row);
    });
    if (!chatRows.length) chatSection.append(element('div', { className: 'cj-review-help', text: UI.noMessages }));
    body.append(chatSection);
    dialog.append(body);

    const cancel = element('button', { text: UI.cancel });
    const save = element('button', { className: 'save', text: UI.save });
    cancel.onclick = closeReview;
    save.onclick = async () => {
      const participants = {};
      participantRows.filter((item) => !item.removed).forEach((item) => {
        const name = item.input.value.trim();
        if (!name) return;
        const key = normalize(name);
        if (!participants[key]) participants[key] = { ...item.participant, name, sessions: [...(item.participant.sessions || [])] };
        else participants[key].sessions.push(...(item.participant.sessions || []));
      });
      Object.values(participants).forEach((participant) => {
        participant.sessions.sort((a, b) => (a.joinTime || 0) - (b.joinTime || 0));
      });
      draft.participants = participants;
      draft.chat = chatRows.filter((item) => !item.removed).map((item) => ({
        ...item.message,
        sender: item.sender.value.trim(),
        text: item.textInput.value.trim(),
      })).filter((message) => message.sender && message.text);
      draft.incidentId = incidentInput.value.trim();
      draft.updatedAt = now();

      if (target._storageKey === state._storageKey) {
        state = draft;
        inCall.clear();
        seenChat.clear();
        restoreActiveParticipants();
        if (!trackingActive) inCall.clear();
        await persist();
      } else {
        await GM_setValue(draft._storageKey, draft);
      }
      closeReview();
      showToast(UI.saved);
      if (afterSave) await afterSave();
    };
    dialog.append(element('div', { className: 'cj-review-footer' }, [cancel, save]));
    overlay.append(dialog);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeReview();
    });
    document.body.append(overlay);
  }

  async function historyMeetings() {
    const keys = await GM_listValues();
    const meetingKeys = keys.filter((key) => key.startsWith(STORE_PREFIX));
    const meetings = await Promise.all(meetingKeys.map(async (key) => {
      const meeting = await GM_getValue(key, null);
      if (meeting) meeting._storageKey = key;
      return meeting;
    }));
    return meetings
      .filter((meeting) => meeting?.meetingId)
      .sort((a, b) => (b.startTime || 0) - (a.startTime || 0));
  }

  function historyAction(label, onClick, className = '') {
    const button = element('button', { text: label, className });
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    });
    return button;
  }

  function renderHistoryCard(meeting, refresh) {
    const participants = participantsInOrder(meeting);
    const details = element('details', { className: 'cj-history-card' });
    const summary = element('summary', { className: 'cj-history-summary' }, [
      element('div', { className: 'cj-history-name', text: meeting.meetingName || meeting.meetingId }),
      element('div', {
        className: 'cj-history-meta',
        text: `${new Date(meeting.startTime || now()).toLocaleString(navigator.language)}${meeting.incidentId ? ` · ${UI.incidentId}: ${meeting.incidentId}` : ''} · ${participants.length} ${UI.participants} · ${meeting.chat?.length || 0} ${UI.messages}`,
      }),
    ]);
    const content = element('div', { className: 'cj-history-content' });
    if (!participants.length) {
      content.append(element('div', { className: 'cj-history-person', text: UI.noParticipants }));
    } else {
      participants.forEach((participant, index) => {
        content.append(element('div', {
          className: 'cj-history-person',
          text: `${index + 1}. ${participant.name} - ${fmtTime(participant.sessions?.[0]?.joinTime)}`,
        }));
      });
    }
    (meeting.chat || []).forEach((message) => {
      content.append(element('div', { className: 'cj-history-message' }, [
        element('time', { text: fmtTime(message.time) }),
        document.createTextNode(`${message.sender}: ${message.text}`),
      ]));
    });

    const actions = element('div', { className: 'cj-history-card-actions' }, [
      historyAction(UI.copiedBitacora, () => copyText(buildBitacora(meeting), UI.copiedBitacora)),
      historyAction(UI.copiedAta, () => copyText(buildAta(meeting), UI.copiedAta)),
      historyAction('Sheets', () => copyText(buildSheets(meeting), UI.copiedSheet)),
      historyAction('CSV', () => downloadCsv(meeting)),
      historyAction(UI.review, () => openReview(meeting, refresh)),
    ]);
    if (meeting._storageKey !== state._storageKey) {
      actions.append(historyAction(UI.delete, async () => {
        if (!confirm(`${UI.confirmDelete} “${meeting.meetingName || meeting.meetingId}”`)) return;
        await GM_deleteValue(meeting._storageKey);
        showToast(UI.deleted);
        refresh();
      }, 'danger'));
    } else {
      actions.append(element('span', { className: 'cj-muted', text: UI.currentMeeting }));
    }
    details.append(summary, content, actions);
    return details;
  }

  async function openHistory() {
    await persist();
    let overlay = document.querySelector('#corujinha-history');
    if (!overlay) {
      overlay = element('div', { id: 'corujinha-history' });
      document.body.append(overlay);
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) overlay.classList.remove('open');
      });
    }

    const refresh = async () => {
      const meetings = await historyMeetings();
      const dialog = element('section', { className: 'cj-history-dialog' });
      const close = element('button', { text: '×', ariaLabel: UI.close });
      close.onclick = () => overlay.classList.remove('open');
      dialog.append(element('div', { className: 'cj-history-head' }, [
        element('strong', { text: UI.historyTitle }),
        close,
      ]));
      const list = element('div', { className: 'cj-history-list' });
      if (!meetings.length) {
        list.append(element('div', { className: 'cj-history-empty', text: UI.noHistory }));
      } else {
        meetings.forEach((meeting) => list.append(renderHistoryCard(meeting, refresh)));
      }
      dialog.append(list);
      overlay.replaceChildren(dialog);
    };

    await refresh();
    overlay.classList.add('open');
  }

  function activateWarroomMode() {
    if (!state) return false;
    if (state.warroomMode) return true;
    if (!refreshMeetingPresence()) return false;
    openWarroomPreflight();
    return true;
  }

  function openWarroomPreflight() {
    if (document.querySelector('#corujinha-preflight')) return;
    const overlay = element('div', { id: 'corujinha-preflight' });
    const card = element('section', { className: 'cj-preflight-card' });
    const close = () => overlay.remove();
    const participants = Object.keys(state.participants || {}).length;
    const chatOpen = Boolean(findChatInput());

    card.append(element('div', { className: 'cj-preflight-head' }, [
      element('strong', { text: UI.preflightTitle }),
      element('div', { className: 'cj-preflight-help', text: UI.preflightHelp }),
    ]));
    const chatStatus = element('b', { text: chatOpen ? UI.chatDetected : UI.chatNotDetected });
    const body = element('div', { className: 'cj-preflight-body' }, [
      element('div', { className: 'cj-preflight-row' }, [
        element('span', { text: UI.meetingLabel }),
        element('b', { text: state.meetingName || state.meetingId }),
      ]),
      element('div', { className: 'cj-preflight-row' }, [
        element('span', { text: UI.participants }),
        element('b', { text: String(participants) }),
      ]),
      element('div', { className: 'cj-preflight-row' }, [
        element('span', { text: UI.chat }),
        chatStatus,
      ]),
    ]);
    if (!chatOpen) {
      const openChat = element('button', { className: 'cj-preflight-open-chat', text: UI.openChatNow });
      openChat.onclick = async () => {
        openChat.disabled = true;
        const opened = await ensureChatOpen();
        openChat.disabled = false;
        if (!opened) return showToast(UI.chatUnavailable);
        chatStatus.textContent = UI.chatDetected;
        openChat.remove();
      };
      body.append(openChat);
    }
    const incidentInput = element('input', { ariaLabel: UI.incident });
    incidentInput.placeholder = UI.incidentPlaceholder;
    incidentInput.value = state.incidentId || '';
    body.append(element('label', { className: 'cj-preflight-field' }, [
      document.createTextNode(UI.incident),
      incidentInput,
    ]));
    card.append(body);

    const cancel = element('button', { text: UI.cancel });
    const start = element('button', { className: 'start', text: UI.startWarroom });
    cancel.onclick = close;
    start.onclick = async () => {
      state.incidentId = incidentInput.value.trim();
      state.warroomMode = true;
      state.warroomArmedAt = now();
      await persist();
      render();
      panel.classList.remove('open', 'minimized');
      panel.querySelector('#cj-minimize').textContent = '−';
      close();
      // Se o chat já estiver aberto, começa a captura imediatamente.
      setTimeout(scanChat, 0);
    };
    card.append(element('div', { className: 'cj-preflight-actions' }, [cancel, start]));
    overlay.append(card);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) close();
    });
    document.body.append(overlay);
    incidentInput.focus();
  }

  function reportStyles() {
    return `
      *{box-sizing:border-box}body{margin:0;background:#f4f6fa;color:#1f2937;font:14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}
      .cj-report-shell{max-width:900px;margin:0 auto;padding:34px 22px 60px}.cj-report-head{margin-bottom:22px;padding:22px 24px;border-radius:15px;background:#174ea6;color:#fff;box-shadow:0 10px 30px #174ea62b}.cj-report-head h1{margin:0 0 7px;font-size:25px}.cj-report-head p{margin:3px 0;color:#dbeafe}.cj-report-card{margin-bottom:16px;background:#fff;border:1px solid #dfe3eb;border-radius:13px;box-shadow:0 5px 18px #1725540d;overflow:hidden}.cj-report-card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 17px;border-bottom:1px solid #e7ebf2}.cj-report-card-head h2{margin:0;font-size:15px;color:#263142}.cj-report-copy{padding:8px 11px;border:1px solid #b8cef0;border-radius:8px;background:#eef4ff;color:#174ea6;cursor:pointer;font-weight:650}.cj-report-list{padding:4px 17px 12px}.cj-report-row{padding:10px 0;border-bottom:1px solid #edf0f5}.cj-report-row:last-child{border-bottom:0}.cj-report-person{display:flex;gap:10px}.cj-report-index{width:26px;color:#7b8494;font-weight:700}.cj-report-name{font-weight:650}.cj-report-time{margin-left:auto;color:#7b8494}.cj-report-message-time{color:#98a2b3;margin-right:7px}.cj-report-message-sender{color:#1769d1;font-weight:700}.cj-report-message-text{margin-top:4px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.5}.cj-report-empty{padding:20px 0;color:#7b8494;text-align:center}@media(max-width:600px){.cj-report-shell{padding:18px 10px 40px}.cj-report-head{padding:18px}.cj-report-card-head{align-items:flex-start;flex-direction:column}.cj-report-copy{width:100%}}
    `;
  }

  async function copyFromReport(view, text, button) {
    if (!text) return;
    try {
      await view.navigator.clipboard.writeText(text);
    } catch (_) {
      const textarea = view.document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      view.document.body.append(textarea);
      textarea.select();
      view.document.execCommand('copy');
      textarea.remove();
    }
    const original = button.textContent;
    button.textContent = UI.copyDone;
    view.setTimeout(() => { button.textContent = original; }, 1400);
  }

  function createReportShell(doc, snapshot) {
    const make = (tag, className = '', text = '') => {
      const node = doc.createElement(tag);
      if (className) node.className = className;
      if (text !== '') node.textContent = text;
      return node;
    };
    const shell = make('main', 'cj-report-shell');
    const header = make('header', 'cj-report-head');
    header.append(
      make('h1', '', `🦉 ${UI.reportTitle}`),
      make('p', '', snapshot.meetingName || snapshot.meetingId),
      make('p', '', new Date(snapshot.startTime || now()).toLocaleString(navigator.language)),
    );
    shell.append(header);

    const section = (title, copyValue) => {
      const card = make('section', 'cj-report-card');
      const cardHeader = make('div', 'cj-report-card-head');
      const copy = make('button', 'cj-report-copy', `⧉ ${UI.copySection}`);
      copy.addEventListener('click', () => copyFromReport(doc.defaultView, copyValue, copy));
      cardHeader.append(make('h2', '', title), copy);
      const list = make('div', 'cj-report-list');
      card.append(cardHeader, list);
      shell.append(card);
      return list;
    };

    const participants = participantsInOrder(snapshot);
    const participantList = section(`${UI.reportParticipants} (${participants.length})`, buildBitacora(snapshot));
    if (!participants.length) participantList.append(make('div', 'cj-report-empty', UI.noParticipants));
    participants.forEach((participant, index) => {
      const row = make('div', 'cj-report-row cj-report-person');
      row.append(
        make('span', 'cj-report-index', `#${index + 1}`),
        make('span', 'cj-report-name', cleanCopyText(participant.name)),
        make('span', 'cj-report-time', fmtTime(participant.sessions?.[0]?.joinTime)),
      );
      participantList.append(row);
    });

    const messages = snapshot.chat || [];
    const chatList = section(`${UI.reportChat} (${messages.length})`, buildChat(snapshot));
    if (!messages.length) chatList.append(make('div', 'cj-report-empty', UI.noMessages));
    messages.forEach((message) => {
      const row = make('div', 'cj-report-row');
      const line = make('div');
      line.append(
        make('span', 'cj-report-message-time', fmtTime(message.time)),
        make('span', 'cj-report-message-sender', cleanCopyText(message.sender)),
      );
      row.append(line, make('div', 'cj-report-message-text', cleanCopyText(message.text, true)));
      chatList.append(row);
    });
    return shell;
  }

  function renderReportInWindow(reportWindow, snapshot) {
    const doc = reportWindow.document;
    doc.title = `${UI.reportTitle} — ${snapshot.meetingName || snapshot.meetingId}`;
    const style = doc.createElement('style');
    style.textContent = reportStyles();
    doc.head.replaceChildren(style);
    doc.body.replaceChildren(createReportShell(doc, snapshot));
    reportWindow.focus();
  }

  function renderReportOverlay(snapshot) {
    document.querySelector('.cj-warroom-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'cj-warroom-overlay';
    const style = document.createElement('style');
    style.textContent = reportStyles();
    const close = element('button', { className: 'cj-report-close', text: '×', ariaLabel: UI.close });
    close.onclick = () => overlay.remove();
    overlay.append(style, close, createReportShell(document, snapshot));
    document.body.append(overlay);
  }

  function triggerWarroomReport(reportWindow = null) {
    if (!state?.warroomMode || warroomReportOpened) return;
    warroomReportOpened = true;
    if (trackingActive) {
      scanParticipants();
      scanChat();
    }
    sanitizeState();
    const endedAt = now();
    [...inCall].forEach((key) => {
      const last = state.participants[key]?.sessions?.at(-1);
      if (last && !last.leaveTime) last.leaveTime = endedAt;
    });
    inCall.clear();
    state.reportGeneratedAt = endedAt;
    state.endTime = endedAt;
    state.finalized = true;
    trackingActive = false;
    observer?.disconnect();
    clearInterval(periodicScanTimer);
    clearInterval(periodicChatTimer);
    clearTimeout(scanTimer);
    clearTimeout(chatScanTimer);
    const snapshot = JSON.parse(JSON.stringify(state));
    persist();
    try {
      if (reportWindow && !reportWindow.closed) renderReportInWindow(reportWindow, snapshot);
      else renderReportOverlay(snapshot);
    } catch (_) {
      renderReportOverlay(snapshot);
    }
    showToast(UI.reportReady);
  }

  function installMeetingEndDetection() {
    document.addEventListener('click', (event) => {
      if (!state?.warroomMode || warroomReportOpened) return;
      const control = event.target instanceof Element ? event.target.closest('button, [role="button"]') : null;
      if (!control) return;
      const label = [
        control.getAttribute('aria-label'),
        control.getAttribute('data-tooltip'),
        control.getAttribute('title'),
        control.textContent,
      ].filter(Boolean).join(' ');
      if (!LEAVE_CONTROL_PATTERN.test(label)) return;
      let reportWindow = null;
      try {
        reportWindow = window.open('about:blank', `corujinha-wr-${state.meetingId}-${state.sessionId}`);
      } catch (_) {}
      triggerWarroomReport(reportWindow);
    }, true);
  }

  function makePanelDraggable(handle) {
    let drag = null;
    handle.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) return;
      const rect = panel.getBoundingClientRect();
      drag = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
      panel.style.left = `${rect.left}px`;
      panel.style.top = `${rect.top}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const maxX = Math.max(0, window.innerWidth - panel.offsetWidth);
      const maxY = Math.max(0, window.innerHeight - panel.offsetHeight);
      panel.style.left = `${Math.max(0, Math.min(maxX, event.clientX - drag.dx))}px`;
      panel.style.top = `${Math.max(0, Math.min(maxY, event.clientY - drag.dy))}px`;
    });
    const finish = () => {
      if (!drag) return;
      drag = null;
      GM_setValue('corujinha:panel-position', {
        left: panel.style.left,
        top: panel.style.top,
      });
    };
    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', finish);

    Promise.resolve(GM_getValue('corujinha:panel-position', null)).then((position) => {
      if (!position?.left || !position?.top) return;
      panel.style.left = position.left;
      panel.style.top = position.top;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    });
  }

  function makeLauncherDraggable(launcher) {
    let drag = null;
    let moved = false;

    const place = (left, top) => {
      const maxLeft = Math.max(0, window.innerWidth - launcher.offsetWidth);
      const maxTop = Math.max(0, window.innerHeight - launcher.offsetHeight);
      launcher.style.left = `${Math.max(0, Math.min(maxLeft, left))}px`;
      launcher.style.top = `${Math.max(0, Math.min(maxTop, top))}px`;
      launcher.style.right = 'auto';
      launcher.style.bottom = 'auto';
    };

    launcher.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      const rect = launcher.getBoundingClientRect();
      drag = {
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      };
      moved = false;
      launcher.classList.add('dragging');
      launcher.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    launcher.addEventListener('pointermove', (event) => {
      if (!drag) return;
      if (Math.abs(event.clientX - drag.startX) > 4 || Math.abs(event.clientY - drag.startY) > 4) moved = true;
      if (moved) place(event.clientX - drag.offsetX, event.clientY - drag.offsetY);
    });

    const finish = async (event, cancelled = false) => {
      if (!drag) return;
      launcher.classList.remove('dragging');
      const wasMoved = moved;
      drag = null;
      if (launcher.hasPointerCapture(event.pointerId)) launcher.releasePointerCapture(event.pointerId);
      if (wasMoved) {
        await GM_setValue('corujinha:launcher-position', {
          left: launcher.style.left,
          top: launcher.style.top,
        });
      } else if (!cancelled) {
        panel.classList.toggle('open');
      }
    };
    launcher.addEventListener('pointerup', finish);
    launcher.addEventListener('pointercancel', (event) => finish(event, true));

    Promise.resolve(GM_getValue('corujinha:launcher-position', null)).then((position) => {
      if (!position?.left || !position?.top) return;
      place(parseFloat(position.left) || 0, parseFloat(position.top) || 0);
    });

    window.addEventListener('resize', () => {
      if (!launcher.style.left || !launcher.style.top) return;
      place(parseFloat(launcher.style.left) || 0, parseFloat(launcher.style.top) || 0);
    });
  }

  async function runButtonTask(button, task) {
    if (actionBusy || button.disabled) return;
    actionBusy = true;
    const buttons = [...panel.querySelectorAll('.cj-actions button')];
    const originalText = button.textContent;
    buttons.forEach((item) => { item.disabled = true; });
    button.textContent = UI.busy;
    try {
      await task();
    } finally {
      buttons.forEach((item) => { item.disabled = false; });
      button.textContent = originalText;
      actionBusy = false;
    }
  }

  function createUi() {
    injectStyles();
    launcherButton = document.createElement('button');
    launcherButton.id = 'corujinha-launcher';
    launcherButton.title = 'Clique para abrir · arraste para mover';
    launcherButton.append(
      element('span', { className: 'cj-launcher-owl', text: '🦉' }),
      element('span', { className: 'cj-launcher-count', id: 'cj-launcher-count', text: '0p·0m' }),
    );

    panel = document.createElement('section');
    panel.id = 'corujinha-panel';
    const titleBlock = element('div', {}, [
      element('div', { className: 'cj-title', text: 'Corujinha' }),
      element('div', { className: 'cj-muted', id: 'cj-meeting' }),
      element('div', { className: 'cj-capture-state', id: 'cj-capture-state', text: UI.capturing }),
    ]);
    const brand = element('div', { className: 'cj-brand' }, [
      element('div', { className: 'cj-brand-icon', text: '🦉' }),
      titleBlock,
    ]);
    const minimize = element('button', { id: 'cj-minimize', text: '−', ariaLabel: UI.minimize });
    const close = element('button', { id: 'cj-close', text: '×', ariaLabel: UI.close });
    const headActions = element('div', { className: 'cj-head-actions' }, [minimize, close]);
    const header = element('div', { className: 'cj-head' }, [brand, headActions]);
    const summary = element('div', { className: 'cj-compact-summary', id: 'cj-summary' });
    const actions = element('div', { className: 'cj-actions' }, [
      element('button', { className: 'wr-start', id: 'cj-activate-wr', text: UI.activateWarroom }),
      element('button', { className: 'primary wr-only', id: 'cj-bitacora', text: `⧉  ${UI.bitacora}` }),
      element('button', { className: 'copy-chat wr-only', id: 'cj-copy-chat', text: `⧉  ${UI.copyChat}` }),
      element('button', { className: 'history-link', id: 'cj-history-link', text: UI.history }),
      element('button', { className: 'danger wr-only', id: 'cj-clear', text: UI.clear }),
    ]);
    panel.append(header, summary, actions);
    const toast = document.createElement('div');
    toast.id = 'corujinha-toast';
    document.body.append(launcherButton, panel, toast);

    makeLauncherDraggable(launcherButton);
    makePanelDraggable(header);
    panel.querySelector('#cj-close').onclick = () => {
      panel.classList.remove('open', 'minimized');
      minimize.textContent = '−';
    };
    panel.querySelector('#cj-minimize').onclick = () => {
      const minimized = panel.classList.toggle('minimized');
      minimize.textContent = minimized ? '□' : '−';
    };
    panel.querySelector('#cj-activate-wr').onclick = () => activateWarroomMode();
    panel.querySelector('#cj-history-link').onclick = () => openHistory();
    panel.querySelector('#cj-bitacora').onclick = (event) => runButtonTask(event.currentTarget, async () => {
      await refreshBeforeCopy();
      const participants = participantsInOrder();
      const suspicious = participants.filter((participant) => isSuspiciousName(participant.name)).length;
      if (suspicious && !confirm(UI.suspiciousNames.replace('{count}', suspicious))) return;
      const visible = visibleParticipantCount();
      if (visible && visible > participants.length) {
        const warning = UI.countMismatch
          .replace('{visible}', visible)
          .replace('{captured}', participants.length);
        if (!confirm(warning)) return;
      }
      await copyText(buildBitacora(), UI.copiedBitacora, `${participants.length} ${UI.participantsCopied}.`);
    });
    panel.querySelector('#cj-copy-chat').onclick = (event) => runButtonTask(event.currentTarget, async () => {
      const chatAvailable = await captureLoadedChatHistory();
      if (!chatAvailable) return showToast(UI.chatUnavailable);
      await refreshBeforeCopy();
      const count = state.chat?.length || 0;
      const unidentified = (state.chat || []).filter((message) => /^(?:participante|participant)$/i.test(message.sender || '')).length;
      if (unidentified && !confirm(UI.unidentifiedMessages.replace('{count}', unidentified))) return;
      await copyText(buildChat(), UI.copiedChat, `${count} ${UI.messagesCopied}.`);
    });
    panel.querySelector('#cj-clear').onclick = (event) => runButtonTask(event.currentTarget, async () => {
      if (!confirm(UI.confirmClear)) return;
      const keepWarroomMode = Boolean(state.warroomMode);
      const keepWarroomArmedAt = state.warroomArmedAt || now();
      const keys = await GM_listValues();
      const meetingPrefix = `${STORE_PREFIX}${state.meetingId}:`;
      const meetingKeys = keys.filter((key) => key === storageKey(state.meetingId) || key.startsWith(meetingPrefix));
      await Promise.all(meetingKeys.map((key) => GM_deleteValue(key)));
      await GM_deleteValue(activePointerKey(state.meetingId));
      state = await loadState(state.meetingId, true);
      state.warroomMode = keepWarroomMode;
      state.warroomArmedAt = keepWarroomMode ? keepWarroomArmedAt : null;
      inCall.clear();
      seenChat.clear();
      trackingActive = true;
      startObserver();
      scanParticipants();
      scanChat();
      await persist();
      showToast(UI.cleared);
    });
    render();
  }

  function updateLiveStatus(chatOpen = Boolean(findChatInput())) {
    if (!panel || !state) return;
    refreshMeetingPresence();
    const participantCount = Object.keys(state.participants || {}).length;
    const messageCount = state.chat?.length || 0;
    const lastCapture = state.lastCaptureAt
      ? (now() - state.lastCaptureAt < 60000 ? UI.updatedNow : `${UI.updatedAt} ${fmtTime(state.lastCaptureAt)}`)
      : UI.waitingCapture;
    const chatIdleMinutes = state.lastChatCaptureAt ? Math.floor((now() - state.lastChatCaptureAt) / 60000) : 0;
    const chatStale = Boolean(chatOpen && state.lastChatCaptureAt && chatIdleMinutes >= 5);
    const chatLabel = !state.warroomMode
      ? UI.chatWrOnly
      : (chatStale
        ? UI.chatStale.replace('{minutes}', chatIdleMinutes)
        : (chatOpen ? UI.chatOpen : UI.chatClosed));

    launcherButton?.classList.toggle('chat-open', chatOpen && !chatStale);
    launcherButton?.classList.toggle('chat-closed', !chatOpen || chatStale);
    launcherButton?.classList.toggle('wr-active', Boolean(state.warroomMode));
    const launcherOwl = launcherButton?.querySelector('.cj-launcher-owl');
    if (launcherOwl) launcherOwl.textContent = state.warroomMode ? '👁️' : '🦉';
    const launcherCount = launcherButton?.querySelector('#cj-launcher-count');
    if (launcherCount) launcherCount.textContent = `${participantCount}p·${messageCount}m`;
    if (launcherButton) {
      launcherButton.title = [
        `Corujinha v${VERSION}`,
        state.meetingName || state.meetingId,
        `${participantCount} ${UI.participants} · ${messageCount} ${UI.messages}`,
        state.warroomMode ? UI.warroomActive : '',
        chatLabel,
        lastCapture,
      ].filter(Boolean).join('\n');
    }

    const captureState = panel.querySelector('#cj-capture-state');
    captureState.textContent = !insideMeeting
      ? UI.waitingJoin
      : (trackingActive
        ? `${state.warroomMode ? `${UI.warroomActive} · ` : ''}${UI.capturing} · ${chatLabel}`
        : UI.finalized);
    captureState.classList.toggle('chat-closed', false);
    captureState.classList.toggle('stopped', !trackingActive);
    const activateButton = panel.querySelector('#cj-activate-wr');
    activateButton.hidden = Boolean(state.warroomMode);
    activateButton.disabled = !insideMeeting;
    activateButton.title = insideMeeting ? '' : UI.enterMeeting;
    panel.querySelectorAll('.wr-only').forEach((button) => {
      button.hidden = !state.warroomMode;
    });
    const summary = panel.querySelector('#cj-summary');
    summary.replaceChildren(
      element('b', { text: String(participantCount) }),
      document.createTextNode(` ${UI.participants}  ·  `),
      element('b', { text: String(messageCount) }),
      document.createTextNode(` ${UI.messages}  ·  ${lastCapture}`),
    );
  }

  function render() {
    if (!panel || !state) return;
    panel.querySelector('#cj-meeting').textContent = state.meetingName || state.meetingId;
    updateLiveStatus();
  }

  function showToast(message) {
    const toast = document.querySelector('#corujinha-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function showDiagnostics() {
    const chatOpen = Boolean(findChatInput());
    const participants = participantsInOrder();
    const unidentified = (state.chat || []).filter((message) => /^(?:participante|participant)$/i.test(message.sender || '')).length;
    const suspicious = participants.filter((participant) => isSuspiciousName(participant.name)).length;
    const formatDiagnosticTime = (time) => time
      ? new Date(time).toLocaleString(navigator.language)
      : '—';
    alert([
      `Corujinha v${VERSION}`,
      `Meet: ${state.meetingName || state.meetingId}`,
      `Idioma: ${LANGUAGE}`,
      `Captura ativa: ${trackingActive && observer ? 'sim' : 'não'}`,
      `Chat detectado: ${chatOpen ? 'sim' : 'não'}`,
      `Participantes capturados: ${participants.length}`,
      `Contador visível do Meet: ${visibleParticipantCount() || 'não localizado'}`,
      `Nomes suspeitos: ${suspicious}`,
      `Mensagens capturadas: ${state.chat?.length || 0}`,
      `Mensagens sem remetente: ${unidentified}`,
      `Última captura: ${formatDiagnosticTime(state.lastCaptureAt)}`,
      `Último scan de participantes: ${formatDiagnosticTime(lastParticipantScanAt)}`,
      `Último scan do chat: ${formatDiagnosticTime(lastChatScanAt)}`,
      'Retenção local: 30 dias',
    ].join('\n'));
  }

  async function init() {
    const id = meetingId();
    if (!id || document.querySelector('#corujinha-launcher')) return;
    await cleanupExpiredRecords();
    state = await loadState(id);
    restoreActiveParticipants();
    sanitizeState();
    trackingActive = !state.finalized;
    if (!trackingActive) inCall.clear();
    createUi();
    refreshMeetingPresence();
    installMeetingEndDetection();
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand(UI.diagnostics, showDiagnostics);
      GM_registerMenuCommand(`Corujinha: ${UI.history}`, openHistory);
    }
    if (trackingActive) {
      startObserver();
      setTimeout(scanParticipants, 1200);
      setTimeout(scanParticipants, 4000);
    }
    persist();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 700), { once: true });
  } else {
    setTimeout(init, 700);
  }
})();

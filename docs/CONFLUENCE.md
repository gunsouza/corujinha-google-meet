# Corujinha para Google Meet

A Corujinha é um script para warrooms que registra localmente os participantes por ordem de entrada e, somente com o modo WR ativo, as mensagens disponíveis no chat do Google Meet.

> [**INSTALAR OU ATUALIZAR A CORUJINHA**](https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js)

O link acima é permanente e serve para instalação e atualizações futuras.

## Instalação e configuração

1. Instale o [Tampermonkey pela Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Abra `chrome://extensions`.
3. No Tampermonkey, clique em **Detalhes**.
4. Ative **Permitir scripts de usuário** (`Allow User Scripts`).
5. Se essa opção não aparecer, ative **Modo do desenvolvedor** no canto superior direito e verifique novamente.
6. Abra o [instalador da Corujinha](https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js).
7. Clique em **Instalar** e recarregue a guia do Google Meet.

Se alguma opção estiver bloqueada por política corporativa, solicite a liberação ao time responsável.

## Como usar em uma warroom

1. Entre efetivamente na chamada.
2. Clique na Corujinha e selecione **Ativar modo WR**.
3. Revise o pré-check, informe opcionalmente o ID do incidente e use **Abrir chat agora** se desejar.
4. Confirme em **Iniciar modo WR**. A etiqueta `WR` indicará que a captura oficial está ativa.

Não é necessário manter o painel da Corujinha aberto.

### Participantes e bitácora

- Os participantes são organizados pelo primeiro horário de entrada.
- Saídas e retornos não duplicam a pessoa.
- **Copiar bitácora** gera: `Nome da pessoa - HH:MM`.

### Chat

- O chat só é lido e armazenado após a confirmação do modo WR.
- Com o chat aberto, as mensagens são capturadas automaticamente.
- **Abrir e copiar chat** abre o painel, percorre as mensagens que o Meet ainda disponibiliza e copia horário, autor e conteúdo.
- Mensagens anteriores à sua entrada, removidas ou indisponíveis no Meet não podem ser recuperadas.

## Encerramento e histórico

- Saia pelo botão vermelho do Meet para abrir automaticamente o relatório final.
- Se fechar diretamente a guia, o relatório não abrirá, mas os dados já salvos permanecerão no histórico.
- Para consultar reuniões anteriores sem ativar o WR, clique na Corujinha e selecione **Histórico**.
- Os registros ficam armazenados localmente por até 30 dias.
- **Limpar dados desta Meet** remove somente os registros do link atual.

## Atualização

Use sempre o mesmo [link de instalação e atualização](https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js):

1. Abra o link.
2. Clique em **Atualizar**, quando solicitado.
3. Recarregue as guias do Meet abertas.

Também é possível selecionar **Verificar atualizações dos scripts** no Tampermonkey ou aguardar a verificação automática.

## Privacidade e solução rápida

- Os dados ficam somente no armazenamento local do Tampermonkey; não há servidor externo, telemetria, gravação de áudio ou integração com Gemini.
- Se a Corujinha não aparecer, confirme que o Tampermonkey, o script e **Permitir scripts de usuário** estão ativos; depois recarregue o Meet.
- Desative versões antigas ou duplicadas do script.
- Mudanças na interface do Google Meet podem exigir uma atualização da Corujinha.

Links: [repositório](https://github.com/gunsouza/corujinha-google-meet) · [versões](https://github.com/gunsouza/corujinha-google-meet/releases) · [privacidade](https://github.com/gunsouza/corujinha-google-meet/blob/main/PRIVACIDADE.md)

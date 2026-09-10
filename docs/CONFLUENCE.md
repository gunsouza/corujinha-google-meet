# Corujinha para Google Meet — instalação e uso

## Instalação rápida

> [**CLIQUE AQUI PARA INSTALAR OU ATUALIZAR A CORUJINHA**](https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js)

O endereço acima é permanente. Ele é usado para a instalação inicial e para todas as atualizações futuras.

## O que é a Corujinha

A Corujinha é um script executado pelo Tampermonkey no Google Meet, criado para apoiar warrooms e incidentes. Ela registra localmente:

- Nome dos participantes.
- Primeiro horário de entrada.
- Ordem de entrada.
- Mensagens visíveis no chat enquanto o modo WR estiver ativo.
- Histórico e relatório final da warroom.

O formato principal para a bitácora é:

```text
Nome da pessoa - HH:MM
```

A Corujinha não realiza transcrição de áudio e não substitui ferramentas de acompanhamento durante a chamada.

## Requisitos

- Google Chrome ou navegador Chromium autorizado pela empresa.
- Tampermonkey instalado e liberado.
- Permissão **Permitir scripts de usuário** habilitada.
- Acesso ao Google Meet e ao endereço público do instalador.

## 1. Instalar o Tampermonkey

1. Abra o [Tampermonkey na Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Clique em **Usar no Chrome** ou **Adicionar ao Chrome**.
3. Confirme em **Adicionar extensão**.
4. Abra o menu de extensões do navegador e confirme que o Tampermonkey está ativado.
5. Opcionalmente, fixe o ícone do Tampermonkey na barra do navegador.

Se a instalação estiver bloqueada por política corporativa, solicite a liberação ao time responsável.

## 2. Permitir scripts de usuário

1. Digite `chrome://extensions` na barra de endereços.
2. Localize o **Tampermonkey** e clique em **Detalhes**.
3. Ative **Permitir scripts de usuário** (`Allow User Scripts`).

Se a opção não aparecer, ative **Modo do desenvolvedor** no canto superior direito de `chrome://extensions` e verifique novamente os detalhes do Tampermonkey.

Não confunda essa configuração com **Permitir acesso a URLs de arquivos**, que não é necessária para a instalação pelo GitHub.

## 3. Instalar a Corujinha

1. Abra o [**instalador oficial da Corujinha**](https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js).
2. Na tela do Tampermonkey, clique em **Instalar**.
3. Confirme que **Corujinha para Google Meet** aparece habilitada na lista de scripts instalados.
4. Recarregue qualquer guia do Google Meet que já estivesse aberta.

## Como atualizar

O instalador sempre usa este mesmo endereço:

```text
https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js
```

Há três formas de atualizar:

1. Abrir novamente o link e clicar em **Atualizar**.
2. No painel do Tampermonkey, selecionar **Verificar atualizações dos scripts**.
3. Aguardar a verificação automática do Tampermonkey.

O Tampermonkey só instala uma atualização quando o campo `@version` do arquivo publicado é superior ao da versão instalada. Após atualizar, recarregue a guia do Meet.

## Como iniciar uma warroom

1. Entre efetivamente na chamada do Google Meet.
2. Clique no ícone da Corujinha.
3. Selecione **Ativar modo WR**.
4. Revise o pré-check e informe opcionalmente o ID do incidente.
5. Confirme em **Iniciar modo WR**.

Depois da confirmação, aparece a etiqueta `WR` e o ícone assume o estado ativo. O painel pode ser fechado ou minimizado; a captura continua automaticamente.

## Participantes

- A lista é ordenada pelo primeiro horário de entrada.
- Se uma pessoa sair e retornar, ela continua sendo um único participante.
- Para a bitácora, é usado o primeiro horário de entrada.
- Não é necessário manter o painel da Corujinha aberto.
- O botão **Copiar bitácora** copia a lista no formato esperado pela operação.

## Chat

- O chat somente é lido e armazenado depois da confirmação do modo WR.
- A captura automática acontece enquanto o painel de mensagens do Meet está aberto.
- Fechar o painel da Corujinha não interrompe a captura.
- O botão **Abrir e copiar chat** abre o painel do Meet, percorre o histórico disponível e copia horário, autor e conteúdo.
- O pré-check oferece **Abrir chat agora** para facilitar a preparação da warroom.
- Mensagens anteriores que já não estejam disponíveis na interface do Meet podem não ser recuperadas.

## Encerramento e relatório

Para abrir o relatório automaticamente, saia pelo botão vermelho **Sair da chamada** do Google Meet. O relatório apresenta:

- Participantes por ordem de entrada.
- Primeiro horário de entrada de cada participante.
- Total final de participantes.
- Mensagens capturadas no chat.
- Botões para copiar cada seção.

Se a guia for fechada diretamente, o navegador encerra o script antes que ele consiga abrir outra página. Os dados já salvos não são perdidos e podem ser consultados no histórico.

## Histórico

O histórico pode ser aberto sem ativar o modo WR:

1. Abra qualquer página de reunião do Google Meet.
2. Clique na Corujinha.
3. Selecione **Histórico**.

Os registros ficam armazenados localmente por até 30 dias. **Limpar dados desta Meet** remove somente os dados associados ao link atual.

## Privacidade

- Os dados ficam no armazenamento local do Tampermonkey no navegador do usuário.
- A Corujinha não envia participantes, chats ou relatórios para servidores externos.
- Não existe telemetria ou integração com Gemini.
- A captura do chat só ocorre no modo WR, após confirmação explícita.
- A limpeza dos dados pode ser feita pela própria interface.

## Limitações conhecidas

- Para captura automática em tempo real, o chat precisa estar aberto. A ação **Abrir e copiar chat** recupera posteriormente o conteúdo que o Meet ainda disponibilizar.
- Fechar diretamente a guia impede a abertura automática do relatório.
- Mudanças na interface do Google Meet podem exigir uma atualização da Corujinha.
- A Corujinha registra apenas informações disponíveis na página do Meet; ela não acessa áudio ou transcrição.

## Solução rápida de problemas

### A Corujinha não aparece

- Confirme que o Tampermonkey e o script estão ativados.
- Confirme a permissão **Permitir scripts de usuário**.
- Verifique se o endereço começa com `https://meet.google.com/`.
- Recarregue a página depois da instalação ou atualização.
- Desative cópias duplicadas ou antigas do script.

### O chat não foi capturado

- Confirme que o modo WR foi ativado e confirmado.
- Clique em **Abrir e copiar chat** antes de sair da chamada.
- A Corujinha não consegue recuperar conteúdo que não esteja mais disponível no Meet.
- Recarregue a página se o Meet tiver sido aberto antes da atualização do script.

### O relatório não abriu

- Prefira sair pelo botão vermelho do Meet.
- Se a guia foi fechada, reabra um link do Meet e consulte **Histórico**.

## Links oficiais

- [Instalar ou atualizar](https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js)
- [Repositório e documentação](https://github.com/gunsouza/corujinha-google-meet)
- [Versões publicadas](https://github.com/gunsouza/corujinha-google-meet/releases)
- [Política de privacidade](https://github.com/gunsouza/corujinha-google-meet/blob/main/PRIVACIDADE.md)

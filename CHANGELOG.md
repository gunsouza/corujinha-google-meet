# Histórico de versões

As mudanças relevantes da Corujinha são registradas neste arquivo.

## 0.16.2

- Corrige mensagens próprias atribuídas ao último participante exibido no chat.
- Usa o nome do próprio usuário para mensagens alinhadas como enviadas por ele.
- Corrige a atribuição antiga ao varrer novamente o chat ainda disponível.
- Ignora “Mostrar minha tela mesmo assim” e equivalentes em espanhol e inglês.

## 0.16.1

- Ignora controles de apresentação como “Tela inteira” e “Liberar sua apresentação da tela principal”.
- Remove textos auxiliares da apresentação identificados incorretamente como participantes.
- Mescla o sufixo “(sua apresentação)” com o nome real do participante.
- Limpa esses falsos participantes dos registros já salvos ao abrir novamente o Meet.

## 0.16.0

- Substitui **Copiar chat** por **Abrir e copiar chat** no modo WR.
- Abre automaticamente o painel de mensagens quando necessário.
- Percorre o histórico disponível no painel antes de copiar.
- Adiciona **Abrir chat agora** ao pré-check da warroom.
- Mantém a captura e a leitura do chat restritas ao modo WR.

## 0.15.3

- Adiciona instalação por URL pública do userscript.
- Adiciona verificação e download automático de novas versões pelo Tampermonkey.
- Adiciona links para o repositório e para suporte no cabeçalho do script.

## 0.15.2

- Ignora identificadores internos `keep_on` e `keep_off`.
- Ignora ações de fixar e desafixar mensagens em português e inglês.
- Remove falsos remetentes antes de copiar ou gerar o relatório.

## 0.15.1

- Impede que controles de áudio sejam identificados como participantes.

## 0.15.0

- Adiciona pré-check de ativação do modo WR.
- Adiciona campo opcional para o ID do incidente.
- Fecha o painel automaticamente após iniciar a warroom.

## 0.14.0

- Separa a abertura do painel da ativação do modo WR.
- Adiciona acesso ao histórico sem iniciar o WR.
- Adiciona modo de miniatura.
- Muda o ícone para olho verde enquanto o WR está ativo.

## 0.13.1

- Substitui “Você” pelo nome do próprio participante no chat.
- Ignora “Janela do app” como participante.

## 0.13.0

- Impede a captura de participantes na tela anterior à entrada.
- Finaliza o registro ao gerar o relatório.
- Amplia os filtros de controles do Google Meet.

## 0.12.1

- Adiciona confirmação antes de ativar o modo WR.

## 0.12.0

- Restringe a leitura e o armazenamento do chat ao modo WR.

## 0.11.0

- Adiciona o modo Warroom e o relatório final.
- Adiciona retenção local automática de 30 dias.
- Adiciona diagnóstico pelo menu do Tampermonkey.

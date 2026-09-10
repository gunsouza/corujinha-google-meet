# Instalação e atualização

Este guia foi escrito para quem nunca utilizou o Tampermonkey. Siga as etapas na ordem apresentada.

## Requisitos

- Google Chrome ou outro navegador Chromium autorizado.
- Tampermonkey instalado e permitido pela política da empresa.
- Arquivo `Corujinha-tampermonkey.user.js`.
- Acesso ao Google Meet.

## 1. Instalar o Tampermonkey

1. Abra a página oficial do [Tampermonkey na Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Clique em **Usar no Chrome** ou **Adicionar ao Chrome**.
3. Confirme em **Adicionar extensão**.
4. Abra o menu de extensões, identificado pelo ícone de quebra-cabeça ao lado da barra de endereços.
5. Localize o Tampermonkey e, se quiser, fixe-o na barra do navegador.

Computadores corporativos podem bloquear a instalação por política. Nesse caso, solicite a liberação do Tampermonkey ao time responsável; não tente contornar a política.

## 2. Permitir a execução de scripts de usuário

O Tampermonkey 5.3 ou superior precisa de uma autorização adicional nos navegadores baseados em Chrome.

### Chrome 138 ou superior

1. Digite `chrome://extensions` na barra de endereços e pressione Enter.
2. Localize o cartão do **Tampermonkey**.
3. Clique em **Detalhes**.
4. Ative **Permitir scripts de usuário** (`Allow User Scripts`).

Também é possível clicar com o botão direito no ícone do Tampermonkey e selecionar **Gerenciar extensão** para chegar à mesma tela.

### Se “Permitir scripts de usuário” não aparecer

1. Abra `chrome://extensions`.
2. Ative **Modo do desenvolvedor** no canto superior direito.
3. Volte ao Tampermonkey e confirme que ele está ativado.

Em navegador corporativo, essa opção pode estar bloqueada pelo administrador. Quando isso acontecer, a solução correta é pedir a liberação da permissão **User Scripts** ou do modo necessário ao time de Segurança/Workplace.

> **Atenção:** “Permitir acesso a URLs de arquivos” é outra opção. Ela só é necessária para métodos que abrem arquivos locais diretamente e não substitui “Permitir scripts de usuário”.

## 3. Instalar a Corujinha

### Forma recomendada enquanto não existe uma URL de instalação

1. Clique no ícone do Tampermonkey.
2. Abra o **Painel de controle**.
3. Clique no botão **+** ou em **Adicionar novo script**.
4. Apague todo o código de exemplo apresentado pelo editor.
5. Abra o arquivo `Corujinha-tampermonkey.user.js` em um editor de texto.
6. Copie todo o arquivo, desde `// ==UserScript==` até a última linha.
7. Cole no editor do Tampermonkey.
8. Salve com `Ctrl+S` no Windows ou `⌘S` no macOS.
9. Abra a aba **Scripts instalados** e confirme que **Corujinha para Google Meet** está ativada.
10. Recarregue completamente a guia do Google Meet.

No início do arquivo deve aparecer a versão instalada:

```javascript
// @version      0.15.3
```

Também é possível conferir a versão deixando o mouse sobre o ícone da Corujinha durante uma chamada.

### Instalação com um clique

Abra o link abaixo no navegador. O Tampermonkey deverá mostrar uma tela com o botão **Instalar**:

```text
https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js
```

Depois da instalação, mantenha o script ativado no painel do Tampermonkey.

## 4. Validar a instalação

1. Abra um link válido do Google Meet.
2. Entre efetivamente na chamada.
3. Aguarde alguns segundos até aparecer o botão da Corujinha.
4. Clique na coruja: o painel deve abrir sem ativar o modo WR.
5. Confirme que existe a opção **Histórico**.
6. Clique em **Ativar modo WR** apenas em uma reunião de teste.
7. Confira o pré-check e cancele ou inicie o modo WR.

Se esses controles aparecerem, a instalação foi concluída.

## Atualização manual

1. Obtenha a versão mais recente do arquivo `.user.js`.
2. Abra o painel do Tampermonkey.
3. Edite **Corujinha para Google Meet**.
4. Substitua todo o código pelo arquivo novo.
5. Salve.
6. Recarregue a guia do Meet.

O Tampermonkey não substitui o código já injetado em uma página aberta. A recarga da guia é obrigatória.

## Atualização automática por repositório Git

Manter o projeto no Git é recomendado. Além do histórico de mudanças, o Tampermonkey pode verificar novas versões usando uma URL direta para o arquivo.

Depois que o repositório remoto for criado, adicione ao cabeçalho do userscript:

```javascript
// @updateURL    https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js
// @downloadURL  https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js
```

Essas URLs já fazem parte do cabeçalho da Corujinha.

Para distribuir uma atualização:

1. Altere o código.
2. Aumente obrigatoriamente o campo `@version`.
3. Atualize o `CHANGELOG.md`.
4. Execute os testes descritos em `CONTRIBUINDO.md`.
5. Faça commit e push para a branch usada nas URLs.
6. No Tampermonkey, use **Verificar atualizações dos scripts** ou aguarde a verificação automática.

### Repositórios privados

Atualizações automáticas podem falhar quando a URL exige login, cookies corporativos ou token. Para um repositório privado, valide se a URL raw pode ser acessada diretamente pelo navegador sem expor credenciais. Caso contrário, mantenha a atualização manual ou publique versões aprovadas em um endereço interno próprio.

## Solução de problemas

### A Corujinha não aparece

- Confirme que o script está ativado.
- Confira se a URL começa com `https://meet.google.com/`.
- Entre efetivamente na chamada.
- Recarregue a página após atualizar o script.
- Verifique se não existem duas versões da Corujinha ativadas ao mesmo tempo.

### Aparece uma interface antiga

- Confira o valor de `@version` no editor do Tampermonkey.
- Salve novamente e recarregue a guia.
- Desative cópias duplicadas do script.

### O relatório não abriu

- Saia usando o botão vermelho do Google Meet.
- Se a guia foi fechada diretamente, reabra o link e consulte **Histórico**.
- Verifique se o navegador bloqueou a abertura da nova guia.

### O chat não foi capturado

- Confirme que o modo WR estava ativo.
- Mantenha o painel de mensagens do Meet aberto.
- Mensagens que não estão mais disponíveis na interface podem não ser recuperadas.

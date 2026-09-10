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

## 3. Instalar a Corujinha com um clique

> [**INSTALAR OU ATUALIZAR A CORUJINHA**](https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js)

1. Abra o link acima no navegador em que o Tampermonkey está instalado.
2. O Tampermonkey mostrará a tela de instalação da Corujinha.
3. Clique em **Instalar** ou **Atualizar**.
4. Confirme no painel do Tampermonkey que **Corujinha para Google Meet** está ativada.
5. Recarregue completamente a guia do Google Meet.

Esse endereço é permanente e serve tanto para a primeira instalação quanto para atualizações. Ele sempre aponta para a versão aprovada mais recente no branch `main` do repositório.

No início do arquivo aparece a versão disponível:

```javascript
// @version      0.16.0
```

Também é possível conferir a versão deixando o mouse sobre o ícone da Corujinha durante uma chamada.

## 4. Validar a instalação

1. Abra um link válido do Google Meet.
2. Entre efetivamente na chamada.
3. Aguarde alguns segundos até aparecer o botão da Corujinha.
4. Clique na coruja: o painel deve abrir sem ativar o modo WR.
5. Confirme que existe a opção **Histórico**.
6. Clique em **Ativar modo WR** apenas em uma reunião de teste.
7. Confira o pré-check e cancele ou inicie o modo WR.

Se esses controles aparecerem, a instalação foi concluída.

## Atualização pelo mesmo link

O link de instalação não muda entre versões:

```text
https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js
```

Ao abri-lo novamente, o Tampermonkey compara o campo `@version` e oferece a atualização quando houver uma versão mais nova. Também é possível usar **Verificar atualizações dos scripts** no painel do Tampermonkey ou aguardar a verificação automática.

Depois de atualizar, recarregue as guias do Google Meet que já estavam abertas.

## Atualização manual alternativa

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
- Durante a chamada, use **Abrir e copiar chat** para abrir o painel, varrer as mensagens disponíveis e copiá-las.
- A Corujinha não consegue recuperar mensagens que o próprio Meet não disponibiliza ao usuário.
- Mensagens que não estão mais disponíveis na interface podem não ser recuperadas.

# Corujinha para Google Meet

A Corujinha é um userscript para Google Meet voltado a warrooms e incidentes. Ela registra localmente a ordem de entrada dos participantes e, quando o modo WR está ativo, captura as mensagens visíveis no chat para facilitar a atualização da bitácora e a consolidação do relatório final.

> Versão atual documentada: **0.16.0**
> Implementação suportada atualmente: **Tampermonkey**

> [**CLIQUE AQUI PARA INSTALAR OU ATUALIZAR A CORUJINHA**](https://raw.githubusercontent.com/gunsouza/corujinha-google-meet/main/Corujinha-tampermonkey.user.js)
>
> Este é o link permanente de instalação e atualização.

## Principais recursos

- Participantes em ordem de entrada, com nome e horário.
- Formato de bitácora: `Nome da pessoa - HH:MM`.
- Captura do chat somente após a ativação explícita do modo WR.
- Ação **Abrir e copiar chat**, que abre o painel do Meet e recupera as mensagens disponíveis antes de copiar.
- Pré-check antes de iniciar a warroom.
- Campo opcional para o ID do incidente.
- Painel compacto, minimizável e móvel.
- Indicador visual do modo WR: olho verde com a etiqueta `WR`.
- Histórico local das reuniões.
- Relatório final com participantes e chat ao sair pelo botão do Meet.
- Interface em português, espanhol ou inglês, conforme o idioma do navegador.
- Retenção automática dos registros por 30 dias.

## Como funciona

1. Ao entrar em uma chamada, a coruja aparece na tela.
2. Clicar na coruja abre o painel, mas não ativa o modo WR.
3. O histórico pode ser consultado sem iniciar uma captura oficial.
4. Ao escolher **Ativar modo WR**, a Corujinha mostra um pré-check.
5. Depois da confirmação, o ícone muda para um olho verde com a etiqueta `WR`.
6. Os participantes são organizados pelo primeiro horário de entrada.
7. O chat é capturado enquanto o modo WR estiver ativo e o painel de mensagens do Meet estiver aberto.
8. Ao sair pelo botão vermelho do Meet, a Corujinha abre o relatório final.

## Instalação rápida

Consulte o guia completo em [docs/INSTALACAO.md](docs/INSTALACAO.md).

Para uma orientação visual, abra [INSTALAR.html](INSTALAR.html) no navegador.

1. Instale o Tampermonkey no navegador autorizado pela empresa.
2. Ative **Permitir scripts de usuário** nos detalhes da extensão.
3. Abra o link **Instalar ou atualizar a Corujinha** acima.
4. Confirme em **Instalar** e recarregue a guia do Google Meet.

## Documentação

- [Instalação e atualizações](docs/INSTALACAO.md)
- [Guia de uso em warrooms](docs/USO.md)
- [Documentação consolidada para o Confluence](docs/CONFLUENCE.md)
- [Privacidade e armazenamento](PRIVACIDADE.md)
- [Processo de atualização e publicação](CONTRIBUINDO.md)
- [Histórico de versões](CHANGELOG.md)

## Limitações conhecidas

- O Tampermonkey não consegue abrir uma nova página de relatório depois que a guia do Meet já foi fechada. Para gerar o relatório automaticamente, use o botão **Sair da chamada** do Meet.
- Se a guia for fechada, os dados já capturados continuam armazenados. Reabra o mesmo link e acesse **Histórico**.
- A captura automática ocorre enquanto o chat está aberto. Se ele ficou fechado, use **Abrir e copiar chat** durante a chamada para recuperar as mensagens que o Meet ainda disponibiliza.
- Alterações do Google na interface do Meet podem exigir ajustes nos seletores de captura.

## Armazenamento e privacidade

Os dados são mantidos pelo Tampermonkey no navegador. A Corujinha não envia participantes, mensagens ou relatórios para servidores externos e não possui telemetria. Leia [PRIVACIDADE.md](PRIVACIDADE.md) para detalhes.

## Estrutura recomendada do repositório

```text
Corujinha/
├── Corujinha-tampermonkey.user.js
├── README.md
├── CHANGELOG.md
├── CONTRIBUINDO.md
├── PRIVACIDADE.md
└── docs/
    ├── INSTALACAO.md
    └── USO.md
```

Os arquivos atuais da extensão Chrome podem permanecer em uma pasta separada, como `extension/`, até que recebam as mesmas funcionalidades e sejam homologados.

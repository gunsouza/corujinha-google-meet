# Guia de uso em warrooms

## Antes da warroom

1. Entre na chamada do Google Meet.
2. Abra o chat se quiser registrar mensagens.
3. Clique na coruja.
4. Se quiser apenas consultar reuniões anteriores, selecione **Histórico**. Isso não ativa o modo WR.
5. Para iniciar a captura oficial, selecione **Ativar modo WR**.

## Pré-check

Antes da ativação, confira:

- Código ou nome da reunião.
- Quantidade de participantes já identificados.
- Situação do chat.
- ID opcional da warroom ou do incidente.

Clique em **Iniciar modo WR**. O painel será fechado e o ícone mudará para um olho verde com a etiqueta `WR`.

## Durante a warroom

A Corujinha funciona automaticamente. Não é necessário manter o painel aberto.

- `p` representa participantes identificados.
- `m` representa mensagens capturadas.
- O ícone pode ser arrastado para qualquer posição da tela.
- Clicar no olho abre o painel compacto.
- O botão `−` reduz o painel a uma miniatura com status e contadores.

### Copiar bitácora

O botão **Copiar bitácora** gera a lista completa por ordem de entrada:

```text
Nome da pessoa - 14:03
Outra pessoa - 14:07
```

### Copiar chat

O botão **Copiar chat** gera:

```text
14:08 Nome da pessoa: mensagem enviada
14:10 Outra pessoa: outra mensagem
```

O chat é complementar. A captura de participantes continua mesmo quando o painel de mensagens estiver fechado.

## Encerramento

Use o botão vermelho **Sair da chamada** do Meet. A Corujinha finaliza o registro e abre um relatório com:

- Participantes em ordem de entrada.
- Primeiro horário de entrada.
- Mensagens capturadas.
- Ações para copiar cada seção.

Fechar diretamente a guia impede que o Tampermonkey abra o relatório, pois o script é encerrado junto com a página. Os dados que já tinham sido capturados permanecem no armazenamento local.

## Histórico

O histórico não exige a ativação do modo WR:

1. Abra ou reabra um link do Google Meet.
2. Clique na coruja.
3. Selecione **Histórico**.

Os registros são mantidos por até 30 dias. O histórico permite revisar, copiar e excluir reuniões salvas.

## Limpar dados

**Limpar dados desta Meet** remove os registros associados ao link atual. A ação solicita confirmação e não apaga reuniões de outros links.

## Reconexões

- Se uma pessoa sair e retornar, permanece como um único participante, com múltiplas sessões internas.
- A bitácora usa o primeiro horário de entrada.
- Se você cair e retornar ao mesmo link em até 12 horas, a sessão não finalizada é retomada.
- Quando o relatório final é gerado, a sessão é marcada como finalizada para não ser misturada à próxima reunião.

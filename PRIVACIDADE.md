# Privacidade e armazenamento

## Resumo

A Corujinha foi projetada para funcionar localmente no navegador durante warrooms. Ela não envia dados para servidores próprios ou de terceiros e não possui telemetria.

## Dados tratados

Dependendo do uso, podem ser armazenados:

- Código, nome e URL da reunião.
- Nome dos participantes.
- Horários de entrada e saída usados internamente.
- Mensagens visíveis no chat, remetentes e horários.
- ID opcional do incidente.
- Estado do modo WR e horário de ativação.

## Quando o chat é lido

O chat só é examinado quando:

1. O usuário entrou efetivamente na reunião.
2. O modo WR foi ativado explicitamente.
3. O painel de mensagens está aberto e disponível na interface do Meet.

Fora do modo WR, a Corujinha não inspeciona nem armazena mensagens do chat.

No modo WR, a ação **Abrir e copiar chat** pode abrir o painel de mensagens por solicitação do usuário para capturar o histórico que o próprio Meet disponibilizar naquele momento.

## Onde os dados ficam

Os registros são mantidos no armazenamento local disponibilizado pelo Tampermonkey (`GM_setValue`). Eles ficam associados ao perfil do navegador em que o script foi instalado.

A implementação atual:

- Não usa banco de dados externo.
- Não realiza upload de participantes, chat ou relatórios.
- Não contém chaves, tokens ou credenciais.
- Não carrega bibliotecas por `@require`.
- Não possui analytics ou telemetria.

## Retenção e exclusão

- Registros com mais de 30 dias são removidos automaticamente.
- O usuário pode apagar os dados do link atual pelo painel.
- Registros individuais também podem ser removidos pelo histórico.
- A remoção do Tampermonkey ou dos dados da extensão pode apagar todo o armazenamento local.

## Atualizações automáticas

Se `@updateURL` e `@downloadURL` forem configurados, o Tampermonkey consultará o endereço do arquivo para verificar versões. Essa consulta trata apenas da atualização do código; os dados das reuniões não são enviados ao repositório.

## Responsabilidade de uso

A instalação e o uso devem seguir as políticas de segurança, privacidade e retenção da organização. Os participantes devem ser informados quando exigido pela política interna ou pela legislação aplicável.

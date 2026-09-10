# Processo de atualização e publicação

## Fluxo recomendado

1. Crie uma branch curta para a alteração.
2. Faça a mudança no arquivo `Corujinha-tampermonkey.user.js`.
3. Aumente `@version` e a constante `VERSION` para o mesmo valor.
4. Atualize o `CHANGELOG.md`.
5. Execute a validação de sintaxe.
6. Teste em uma reunião controlada.
7. Faça commit e push.
8. Integre na branch usada pelo `@updateURL` somente depois da validação.

## Convenção de versão

Use versionamento semântico:

- `PATCH` (`0.15.2` → `0.15.3`): correção de captura ou filtro.
- `MINOR` (`0.15.2` → `0.16.0`): nova funcionalidade compatível.
- `MAJOR` (`0.x` → `1.0.0`): primeira versão homologada ou mudança incompatível.

O Tampermonkey só oferece a atualização quando a versão publicada é superior à instalada.

## Checklist mínimo de teste

- [ ] A Corujinha aparece na chamada e não captura chat fora do WR.
- [ ] Clicar no ícone apenas abre o painel.
- [ ] O histórico abre sem ativar o WR.
- [ ] O pré-check mostra a reunião e permite informar o incidente.
- [ ] A ativação muda o ícone para olho verde com `WR`.
- [ ] Participantes são listados em ordem de entrada.
- [ ] Uma saída e reconexão não duplicam o participante.
- [ ] Mensagens próprias exibem o nome, não “Você”.
- [ ] Mensagens de outras pessoas preservam o remetente correto.
- [ ] Controles do Meet não aparecem como participantes ou remetentes.
- [ ] Copiar bitácora produz `Nome - HH:MM`.
- [ ] Copiar chat preserva mensagens multilinha.
- [ ] Sair pelo botão do Meet abre o relatório.
- [ ] Fechar e reabrir o link permite consultar os dados no histórico.
- [ ] Português, espanhol e inglês não apresentam textos quebrados.

## Validação de sintaxe no macOS

```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc Corujinha-tampermonkey.user.js
```

Ao executar fora do Google Meet, pode aparecer um erro de ambiente como `Can't find variable: navigator`. Isso ocorre depois que o arquivo foi interpretado e não representa necessariamente um erro de sintaxe.

## Sugestão de commits

```text
fix: ignora controles de pin do chat
feat: adiciona pré-check do modo WR
docs: adiciona guia de instalação
```

## Publicação

Antes de disponibilizar uma versão:

- Confirme que não há dados pessoais, tokens ou URLs internas no código.
- Confirme que `@version` e `VERSION` coincidem.
- Use uma URL raw estável para `@updateURL` e `@downloadURL`.
- Crie uma tag Git correspondente, por exemplo `v0.15.2`.
- Mantenha a branch de distribuição protegida contra pushes não revisados, quando possível.

# Integração com Prompt Alerts API

## Para o Professor

Este projeto implementa um sistema completo de alerts/notificações que pode ser integrado com sua API "Prompt Alerts".

### Configuração da API

Para ativar a integração, edite o arquivo `src/App.tsx` e configure o `AlertProvider`:

```tsx
<AlertProvider apiUrl="https://sua-api.com/prompt-alerts">
  <AppContent />
  <AlertContainer />
</AlertProvider>
```

### Formato dos Dados Enviados

Quando um alert é disparado, o sistema enviará uma requisição POST para sua API com o seguinte formato:

```json
{
  "type": "success|error|warning|info",
  "title": "Título do alert (opcional)",
  "message": "Mensagem principal do alert",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "userId": "id-do-usuario-logado",
  "source": "service-local-app"
}
```

### Headers da Requisição

```
Content-Type: application/json
Authorization: Bearer {token-do-usuario}
```

### Exemplos de Alerts Enviados

#### Alert de Sucesso (Login)
```json
{
  "type": "success",
  "title": "Bem-vindo!",
  "message": "Login realizado com sucesso!",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "userId": "123",
  "source": "service-local-app"
}
```

#### Alert de Erro (Validação)
```json
{
  "type": "error",
  "title": "Erro de validação",
  "message": "As senhas não coincidem",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "userId": "123",
  "source": "service-local-app"
}
```

#### Alert de Aviso (Sistema)
```json
{
  "type": "warning",
  "title": "Atenção",
  "message": "Seu token expira em 5 minutos",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "userId": "123",
  "source": "service-local-app"
}
```

### Situações que Geram Alerts

O sistema está configurado para enviar alerts nas seguintes situações:

1. **Autenticação**
   - Login bem-sucedido
   - Erro de credenciais
   - Cadastro realizado
   - Erro no cadastro

2. **Operações CRUD**
   - Serviço criado
   - Erro ao criar serviço
   - Serviço atualizado
   - Erro ao atualizar
   - Confirmação de exclusão

3. **Validações**
   - Campos obrigatórios
   - Formato de dados inválido
   - Senhas não coincidem

4. **Sistema**
   - Novos pedidos recebidos
   - Mudanças de status
   - Avisos importantes

### Estrutura da API Esperada

Sua API deve aceitar POST requests no endpoint configurado e responder adequadamente:

```
POST /prompt-alerts
Content-Type: application/json
Authorization: Bearer {token}

{
  "type": "success",
  "title": "Título",
  "message": "Mensagem",
  "timestamp": "ISO-string",
  "userId": "string",
  "source": "service-local-app"
}
```

**Respostas esperadas:**
- 200/201: Alert recebido com sucesso
- 400: Dados inválidos
- 401: Token inválido
- 500: Erro interno

### Teste da Integração

Para testar se a integração está funcionando:

1. Configure a URL da sua API no `AlertProvider`
2. Faça login no sistema
3. Execute algumas operações (criar serviço, etc.)
4. Verifique se os alerts estão chegando na sua API

### Logs de Debug

O sistema registra logs no console do navegador caso haja problemas na comunicação:

```javascript
console.error('Erro ao enviar alert para Prompt Alerts:', error);
console.warn('Falha ao enviar alert para Prompt Alerts API:', response.statusText);
```

### Desativando a Integração

Para desativar temporariamente a integração com sua API, basta não passar o parâmetro `apiUrl` para o `AlertProvider`:

```tsx
<AlertProvider>
  <AppContent />
  <AlertContainer />
</AlertProvider>
```

Neste caso, os alerts continuarão funcionando normalmente na interface, mas não serão enviados para sua API.

### Arquivos Principais

- `src/contexts/AlertContext.tsx` - Lógica principal e integração com API
- `src/components/UI/AlertContainer.tsx` - Componente visual dos alerts
- `src/App.tsx` - Configuração do provider

O sistema está pronto para uso e pode ser facilmente integrado com sua API!

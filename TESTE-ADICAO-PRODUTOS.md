# 🔧 Como Testar Adição de Produtos

## Passo 1: Preparação
1. Abra http://localhost:3000/
2. Pressione **F12** para abrir o console
3. Limpe o console (🚫)

## Passo 2: Tentar Adicionar Produto
1. Abra o painel admin (senha: 124578)
2. Vá para aba "Cardápio / Produtos"
3. Clique em **"+ Adicionar Produto"**
4. Preencha os dados:
   - Nome: "Teste"
   - Tipo: qualquer
   - Descrição: "Produto de teste"
   - Preço (se aplicável)
5. Clique em **"Salvar Produto"**

##Passo 3: Observar Console
Você deve ver uma das mensagens:

### ✅ Sucesso
```
Adicionando produto: {id: ..., name: "Teste", ...}
Produto adicionado com sucesso: {id: 99, name: "Teste", ...}
```

### ❌ Erro
```
Adicionando produto: {id: ..., name: "Teste", ...}
Erro ao adicionar produto: {message: "...", code: "..."}
```

## Passo 4: Me Informe
Copie e cole aqui:
- A mensagem completa do console
- Se apareceu erro, qual é o código e mensagem
- O produto apareceu na lista ou não?

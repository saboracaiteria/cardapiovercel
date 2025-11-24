# 🔧 SOLUÇÃO DEFINITIVA - Obter Chave Correta do Supabase

## ❌ Problema Atual

A chave do Supabase no arquivo `.env` está **INVÁLIDA**, causando erros 401 em todas as requisições.

## ✅ Como Resolver

### Opção 1: Copiar a Chave Correta do Painel do Supabase

1. **Acesse**: https://app.supabase.com/project/oydhuyfnvsblaabvzymr/settings/api

2. **Procure por**: "Project API keys" ou "Chaves de API do Projeto"

3. **Copie a chave** chamada **"anon public"** (NÃO a service_role!)
   - Ela começa com `eyJhbGc...`
   - É uma string longa (tipo JWT)

4. **Cole no arquivo `.env`**:
   ```bash
   VITE_SUPABASE_URL=https://oydhuyfnvsblaabvzymr.supabase.co
   VITE_SUPABASE_ANON_KEY=COLE_AQUI_A_CHAVE_COPIADA
   ```

5. **Reinicie o servidor**:
   - Pare o servidor (Ctrl+C no terminal)
   - Execute: `npm run dev`

### Opção 2: Desabilitar RLS Temporariamente (Mais Rápido)

Se você quer uma solução rápida para testar:

1. **Acesse**: https://app.supabase.com/project/oydhuyfnvsblaabvzymr/sql

2. **Cole e execute** o script [`disable-rls-temp.sql`](file:///c:/Users/Terminal/Downloads/sabor-açaíteria-_/disable-rls-temp.sql)

3. **Recarregue** a página http://localhost:3000/

> ⚠️ **ATENÇÃO**: Esta opção 2 desabilita a segurança. Use APENAS para desenvolvimento local!

---

## 📸 Screenshot de Onde Está a Chave

![Exemplo de onde encontrar a chave](https://supabase.com/docs/img/project-api-keys.png)

**A chave que você precisa é a "anon" ou "public"** (NÃO use a "service_role"!)

---

## 🎯 Após Corrigir

Quando você corrigir a chave, os produtos cadastrados aparecerão automaticamente! ✨

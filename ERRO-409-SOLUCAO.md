# 🔧 Como Corrigir Erro 409 (Produto Duplicado)

## Problema Identificado
**Erro 409 = Conflito/Duplicata**

O banco de dados Supabase tem uma constraint UNIQUE no nome dos produtos, impedindo que você adicione produtos com nomes que já existem.

## Solução

### Opção 1: Usar Nomes Únicos (Temporário)
Ao adicionar produtos, use nomes diferentes dos que já existem:
- ❌ "Copo 400ml" (já existe)
- ✅ "Copo 400ml Premium" (novo)

### Opção 2: Remover Constraint UNIQUE (Recomendado)

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Cole e execute o script `remove-unique-constraint.sql`
4. Isso vai permitir produtos com nomes repetidos

## Por Que o Terceiro Teste Funcionou?

O produto "55" funcionou porque esse nome não existia no banco!

## Próximos Passos

Você quer que eu:
1. **Remova a constraint** para permitir nomes duplicados?
2. **Adicione validação na interface** para alertar sobre nomes duplicados antes de salvar?
3. **Ambos**?

Me informe o que prefere!

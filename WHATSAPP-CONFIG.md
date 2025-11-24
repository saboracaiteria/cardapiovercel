# Configuração do WhatsApp

## Número Atual
`5594991623576`

## Instruções para Atualizar

1. Acesse o painel admin no aplicativo
2. Digite a senha: `124578`
3. Vá para aba "Configurações"
4. Atualize o campo "WhatsApp (apenas números)"
5. Salve as alterações

## Sobre o Toggle de Produtos

✅ **Já está funcionando corretamente!**

Quando você desmarca o toggle de um produto no painel admin:
- O produto fica com `disabled: true`
- Isso significa que ele está **indisponível**
- O produto não aparece para os clientes

O código está correto:
```typescript
checked={!product.disabled}
onChange={() => updateProduct(product.id, { disabled: !product.disabled })}
```

Quando `checked` está **ligado** (verde) = produto **disponível** (`disabled: false`)
Quando `checked` está **desligado** (cinza) = produto **indisponível** (`disabled: true`)

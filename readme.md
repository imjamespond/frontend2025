# Install
```bash
pnpm i @modelcontextprotocol/sdk zod@3 express
pnpm i --save-dev typescript @types/node 
pnpm i --save-dev @types/express tsx

```

# Prompts
- 123+456=？


# Resources  
[Type ”@” to mention MCP resources](https://modelcontextprotocol.io/clients#continue)  

[Reference](https://github.com/continuedev/continue/blob/main/core/context/providers/MCPContextProvider.ts)  
[Continue experimentally supports resource templates ](https://modelcontextprotocol.io/docs/concepts/resources#resource-templates)
by allowing specifically just the "query" variable in the template, which we will update with the full input of the user in the input box
Continue会将所有内容放到query,传参实用性很低，最好`@some-res`直接用
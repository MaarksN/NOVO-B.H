# Política de artefatos binários

Os arquivos binários ZIP foram removidos do repositório porque o ambiente de revisão não é compatível com artefatos binários versionados.

## Artefatos removidos

| Arquivo removido | Motivo | Substituição textual mantida |
|---|---|---|
| `birth-hub-360-reconstructed.zip` | Entrega compactada binária incompatível com revisão textual | A árvore reconstruída permanece expandida no repositório e pode ser compactada localmente se necessário. |
| `plataforma.zip` | ZIP original binário incompatível com revisão textual | O inventário completo, tamanhos e hashes SHA-256 permanecem em `docs/reports/traceability.md`. |
| `docs/legacy/plataforma-original.zip` | Cópia arquivística binária incompatível com revisão textual | O material bruto extraído permanece em `docs/legacy/` e no restante da árvore versionada. |

## Como gerar uma entrega compactada localmente

Se um ZIP for necessário fora do Git, gere-o localmente a partir da árvore textual versionada:

```bash
python3 scripts/create-deliverable-zip.py
```

O arquivo gerado será criado fora do controle de versão e ignorado por `.gitignore`.

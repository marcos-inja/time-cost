# Time Cost

Extensao Chrome que transforma precos em **tempo de trabalho**. Ao navegar por qualquer site, precos em R$ sao detectados e anotados com quantas horas aquele item custa (time cost). Ao passar o mouse, um tooltip mostra o detalhamento: horas, dias, semanas, meses e anos -- tudo baseado no seu perfil real de trabalho.

## Pre-requisitos

- [Node.js](https://nodejs.org/) 18+
- npm (incluso com Node.js)
- Google Chrome

## Instalacao

```bash
git clone <repo-url> time-cost
cd time-cost
npm install
```

## Desenvolvimento

Inicie o servidor de desenvolvimento com HMR:

```bash
npm run dev
```

Isso gera a pasta `dist/` com hot-reload habilitado.

### Carregar no Chrome

1. Abra `chrome://extensions/`
2. Ative o **Modo do desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactacao**
4. Selecione a pasta `dist/` do projeto

A extensao sera carregada e ativada. Alteracoes no codigo serao refletidas automaticamente (pode ser necessario recarregar a pagina).

## Build de Producao

```bash
npm run build
```

A pasta `dist/` contera a extensao pronta para publicacao.

## Testes

```bash
# Rodar todos os testes
npm test

# Modo watch (re-executa ao salvar)
npm run test:watch
```

## Como Usar

1. Clique no icone da extensao na barra do Chrome
2. Cadastre seus dados:
   - **Renda mensal** (R$)
   - **Horas por dia** de trabalho
   - **Dias por semana** de trabalho
3. Clique em **Salvar**
4. Navegue por qualquer site -- precos em R$ serao anotados com o tempo equivalente

### Exemplo

Se voce ganha R$ 5.000/mes, trabalha 8h/dia, 5 dias/semana:

- Seu valor/hora = R$ 28,87
- Um produto de R$ 1.500 mostrara `(52.0h)` ao lado do preco
- No hover, o tooltip mostra: 52h, 6.5 dias, 1.3 semanas, 0.30 meses, 0.02 anos

## Estrutura do Projeto

```
time-cost/
  manifest.json              # Chrome Extension Manifest V3
  vite.config.ts             # Vite + CRXJS config
  vitest.config.ts           # Vitest config
  src/
    core/
      types.ts               # Interfaces e tipos compartilhados
      calculator.ts          # Logica de calculo (Strategy Pattern)
      calculator.test.ts     # Testes do calculator
      priceParser.ts         # Deteccao e normalizacao de precos BRL
      priceParser.test.ts    # Testes do parser
    storage/
      userSettingsRepository.ts      # CRUD chrome.storage.sync (Repository Pattern)
      userSettingsRepository.test.ts # Testes do repository
    content/
      index.ts               # Entry point do content script
      priceDetector.ts       # Varre DOM buscando precos (TreeWalker)
      priceAnnotator.ts      # Injeta badges com tempo ao lado dos precos
      priceObserver.ts       # MutationObserver para SPAs
      tooltip.ts             # Tooltip com Shadow DOM (Builder Pattern)
      tooltip.css            # Estilos do tooltip
    popup/
      index.html             # HTML do popup
      main.tsx               # Entry point React
      App.tsx                # Componente principal
      components/
        SettingsForm.tsx     # Formulario de configuracoes
        ThemeToggle.tsx      # Toggle claro/escuro
      hooks/
        useSettings.ts       # Hook de configuracoes
        useTheme.ts          # Hook de tema
    styles/
      variables.css          # Tokens CSS (claro/escuro)
    background/
      serviceWorker.ts       # Service worker minimal
```

## Padroes de Projeto

| Padrao       | Onde                      | Para que                                         |
| ------------ | ------------------------- | ------------------------------------------------ |
| Strategy     | `calculator.ts`           | Diferentes estrategias de calculo                |
| Repository   | `userSettingsRepository`  | Abstrai `chrome.storage.sync`                    |
| Observer     | `priceObserver.ts`        | Detecta mudancas no DOM via `MutationObserver`   |
| Factory      | `priceParser.ts`          | Cria parser correto por moeda                    |
| Builder      | `tooltip.ts`              | Constroi tooltip com Shadow DOM                  |
| Singleton    | `SettingsManager`         | Fonte unica de configuracoes no content script   |
| Adapter      | `BrlPriceParser.normalize`| Normaliza strings de preco para `number`         |

## Stack Tecnica

- **TypeScript** (strict mode)
- **Vite** + `@crxjs/vite-plugin` (HMR para extensoes)
- **React 18** (popup)
- **Vanilla TS** (content script)
- **Shadow DOM** (isolamento CSS do tooltip)
- **CSS Modules** (estilos do popup)
- **Vitest** (testes unitarios)
- **Chrome Manifest V3**

## Licenca

MIT

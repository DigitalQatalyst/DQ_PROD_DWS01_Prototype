---
shared-source: shared/diagrams/rendering-guide.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Rendering Tool Decision Guide

## Tool Summary

| Tool | Best For | Output | Editable Source | Cloud Icons |
|------|----------|--------|----------------|-------------|
| **Mermaid** | Markdown, GitHub, chat, quick diagrams | SVG/PNG in-browser | Text (`.mmd`) | No (text labels) |
| **PlantUML** | UML fidelity, C4-PlantUML stdlib, CI pipelines | PNG/SVG via server | Text (`.puml`) | Community libs |
| **Structurizr DSL** | C4-as-code, all four levels, living docs | SVG/PNG via Lite/cloud | Text (`.dsl`) | No |
| **draw.io** | Editable diagrams, cloud icons, stakeholder hand-off | `.drawio` XML, PNG | XML (`.drawio`) | AWS/Azure/GCP |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Start: Need a diagram]) --> B{Will it live in\nMarkdown / GitHub / chat?}
    B -- Yes --> C{Needs C4 notation?}
    C -- Yes --> D[Mermaid C4Context\nor C4Container]
    C -- No --> E{Diagram type?}
    E -- Sequence/Flow/State/ER --> F[Mermaid]
    E -- Class/Complex UML --> G{High UML fidelity\nneeded?}
    G -- Yes --> H[PlantUML]
    G -- No --> F
    B -- No --> I{Is this C4 L1-L4\nas living documentation?}
    I -- Yes --> J[Structurizr DSL]
    I -- No --> K{Needs cloud vendor\nicons or stakeholder\neditable XML?}
    K -- Yes --> L[draw.io]
    K -- No --> M{Primary need?}
    M -- UML precision --> H
    M -- Quick / CI-friendly --> F
```

---

## Mermaid

**Choose Mermaid when:**
- The diagram will be embedded in a README, GitHub PR, Confluence page (with plugin), or a chat response.
- The audience will view it rendered (not edit the source).
- The diagram type is: flowchart, sequence, state, ER, class, Gantt, pie, or C4Context/C4Container.

**Limitations:**
- No BPMN support.
- C4 support is partial — only Context and Container; no Component or Code level diagrams natively.
- Class diagrams lack some UML 2.x features (interfaces with full notation, abstract stereotypes).
- No cloud vendor icon support.

**Rendering options:**
- GitHub Markdown renders Mermaid natively in `.md` files.
- VS Code: use the "Mermaid Preview" extension.
- CLI: `mmdc -i diagram.mmd -o diagram.svg`
- Live editor: https://mermaid.live

---

## PlantUML

**Choose PlantUML when:**
- You need precise UML 2.x notation (class stereotypes, activation bars, combined fragments).
- You are producing C4 diagrams with the official C4-PlantUML stdlib.
- The output will be generated in a CI pipeline (PlantUML server or local jar).
- You need sequence diagrams with complex `alt`/`opt`/`loop`/`ref` fragments.

**Key includes:**
```
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml
```

**Rendering options:**
- Online server: https://www.plantuml.com/plantuml/
- Local: `java -jar plantuml.jar diagram.puml`
- VS Code: "PlantUML" extension with local server or remote render.
- GitHub Actions: `plantuml/github-action`

---

## Structurizr DSL

**Choose Structurizr when:**
- You want C4 as code with all four levels (Context, Container, Component, Code) in one workspace.
- You want automatic layout and consistent styling enforced by the tool.
- The architecture model needs to evolve and diagrams should regenerate from the model.

**Rendering options:**
- Structurizr Lite (Docker, free): `docker run -it --rm -p 8080:8080 -v $(pwd):/usr/local/structurizr structurizr/lite`
- Structurizr Cloud (SaaS): https://structurizr.com
- CLI export to PlantUML or Mermaid: `structurizr-cli export -workspace workspace.dsl -format mermaid`

---

## OpenAPI tooling (for API Contract diagrams)

For LLD Diagram 6 (API Contract), the primary artifact is an **OpenAPI 3.x YAML file**, not a diagram file. Render and validate it with:
- **Swagger UI** — interactive browser UI; run locally via `docker run -p 8080:8080 -e SWAGGER_JSON=/spec/openapi.yaml swaggerapi/swagger-ui` or host on SwaggerHub.
- **Redoc** — read-only documentation renderer; `npx @redocly/cli preview-docs openapi.yaml`.
- **Spectral** — OpenAPI linter for contract validation; `npx @stoplight/spectral-cli lint openapi.yaml`.

---

## draw.io

**Choose draw.io when:**
- Stakeholders need to edit the diagram themselves (hand-off artifact).
- The diagram requires AWS, Azure, or GCP official service icons.
- You are producing a network topology or physical infrastructure diagram.
- The output format is a `.drawio` XML file checked into a repository.

**Rendering options:**
- Desktop app: https://www.drawio.com (free, cross-platform)
- VS Code: "Draw.io Integration" extension (`.drawio` files open in-editor)
- Confluence: draw.io plugin
- Import AWS stencils: Extras > Edit Diagram or use built-in shape libraries.

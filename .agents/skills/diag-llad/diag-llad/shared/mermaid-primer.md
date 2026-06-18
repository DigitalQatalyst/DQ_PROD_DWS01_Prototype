---
shared-source: shared/diagrams/mermaid-primer.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Mermaid Primer — Copy-Paste Snippets

## 1. Flowchart (Top-Down)

```mermaid
flowchart TD
    A([User]) -->|HTTP Request| B[API Gateway]
    B --> C{Auth Valid?}
    C -- Yes --> D[Order Service]
    C -- No --> E[401 Unauthorized]
    D --> F[(Orders DB)]
    D --> G[Notification Service]
    G -->|Email| H([User])
```

---

## 2. Flowchart (Left-Right) with Subgraphs

```mermaid
flowchart LR
    subgraph Client[Client — Browser & Mobile]
        A[Web App]
        B[Mobile App]
    end
    subgraph Backend[Backend Services]
        C[API Gateway]
        D[Auth Service]
        E[Product Service]
    end
    subgraph Data[Data Layer]
        F[(PostgreSQL)]
        G[(Redis Cache)]
    end
    A & B --> C
    C --> D
    C --> E
    E --> F
    E --> G
```

---

## 3. Sequence Diagram with alt/opt/loop

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant Auth as Auth Service
    participant API as Order API
    participant DB as Database

    User->>FE: Submit Order
    FE->>Auth: Validate Token
    Auth-->>FE: Token Valid

    alt Token expired
        Auth-->>FE: 401 Unauthorized
        FE-->>User: Redirect to Login
    end

    FE->>API: POST /orders
    API->>DB: BEGIN TRANSACTION

    loop Validate each line item
        API->>DB: Check inventory
        DB-->>API: Stock level
    end

    opt Promo code present
        API->>API: Apply discount
    end

    API->>DB: INSERT order
    DB-->>API: order_id
    API-->>FE: 201 Created {order_id}
    FE-->>User: Order Confirmation
```

---

## 4. State Diagram (v2)

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Submitted : submit()
    Submitted --> UnderReview : assign_reviewer()
    UnderReview --> Approved : approve()
    UnderReview --> Rejected : reject()
    UnderReview --> Draft : request_changes()
    Approved --> Published : publish()
    Rejected --> [*]
    Published --> [*]

    state UnderReview {
        [*] --> TechnicalReview
        TechnicalReview --> LegalReview
        LegalReview --> [*]
    }
```

---

## 5. Entity Relationship Diagram

```mermaid
erDiagram
    CUSTOMER {
        uuid id PK
        string email UK
        string full_name
        timestamp created_at
    }
    ORDER {
        uuid id PK
        uuid customer_id FK
        string status
        decimal total_amount
        timestamp placed_at
    }
    ORDER_LINE {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal unit_price
    }
    PRODUCT {
        uuid id PK
        string sku UK
        string name
        decimal price
        int stock_qty
    }

    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_LINE : contains
    PRODUCT ||--o{ ORDER_LINE : "appears in"
```

---

## 6. Class Diagram

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() String
    }
    class Dog {
        +String breed
        +fetch() void
    }
    class Cat {
        +boolean isIndoor
        +purr() void
    }
    class PetOwner {
        +String name
        +List~Animal~ pets
        +addPet(Animal) void
    }

    Animal <|-- Dog
    Animal <|-- Cat
    PetOwner "1" --> "0..*" Animal : owns
```

---

## 7. C4 Context Diagram (L1)

```mermaid
C4Context
    title System Context — E-Commerce Platform

    Person(customer, "Customer", "Browses catalog and places orders")
    Person(admin, "Administrator", "Manages products, orders, and users")

    System(ecommerce, "E-Commerce Platform", "Allows customers to browse, order, and track purchases")

    System_Ext(payment, "Payment Gateway", "Stripe — processes card payments")
    System_Ext(email, "Email Service", "SendGrid — sends transactional emails")
    System_Ext(erp, "ERP System", "SAP — manages inventory and fulfillment")

    Rel(customer, ecommerce, "Uses", "HTTPS")
    Rel(admin, ecommerce, "Administers", "HTTPS")
    Rel(ecommerce, payment, "Processes payments via", "HTTPS/REST")
    Rel(ecommerce, email, "Sends emails via", "HTTPS/REST")
    Rel(ecommerce, erp, "Syncs inventory and orders via", "HTTPS/REST")
```

---

## 8. C4 Container Diagram (L2)

```mermaid
C4Container
    title Container Diagram — E-Commerce Platform

    Person(customer, "Customer")

    System_Boundary(ecommerce, "E-Commerce Platform") {
        Container(spa, "Single Page App", "React", "Customer-facing storefront")
        Container(api, "API Gateway", "Node.js / Express", "Routes requests, enforces auth")
        Container(order_svc, "Order Service", "Java / Spring Boot", "Manages order lifecycle")
        Container(product_svc, "Product Service", "Python / FastAPI", "Catalog and inventory")
        ContainerDb(orders_db, "Orders DB", "PostgreSQL", "Stores orders and line items")
        ContainerDb(products_db, "Products DB", "PostgreSQL", "Stores product catalog")
        Container(cache, "Cache", "Redis", "Session and product cache")
    }

    System_Ext(payment, "Payment Gateway", "Stripe")

    Rel(customer, spa, "Uses", "HTTPS")
    Rel(spa, api, "Calls", "HTTPS/REST")
    Rel(api, order_svc, "Routes to", "HTTP/REST")
    Rel(api, product_svc, "Routes to", "HTTP/REST")
    Rel(order_svc, orders_db, "Reads/Writes", "TCP/SQL")
    Rel(product_svc, products_db, "Reads/Writes", "TCP/SQL")
    Rel(product_svc, cache, "Reads/Writes", "TCP")
    Rel(order_svc, payment, "Calls", "HTTPS/REST")
```

---

## 9. Gantt Chart

```mermaid
gantt
    title Project Timeline — API Migration
    dateFormat  YYYY-MM-DD
    section Discovery
    Requirements gathering      :a1, 2025-01-06, 7d
    Architecture review         :a2, after a1, 5d
    section Development
    Service A migration         :b1, after a2, 14d
    Service B migration         :b2, after a2, 14d
    Integration testing         :b3, after b1, 7d
    section Release
    Staging deployment          :c1, after b3, 3d
    Production rollout          :c2, after c1, 2d
```

---

## 10. Pie Chart

```mermaid
pie title API Error Distribution (Last 30 days)
    "4xx Client Errors" : 62
    "5xx Server Errors" : 23
    "Timeout" : 10
    "Network" : 5
```

---

## 11. Quadrant Chart

```mermaid
quadrantChart
    title Service Criticality vs Effort to Migrate
    x-axis Low Effort --> High Effort
    y-axis Low Criticality --> High Criticality
    quadrant-1 Migrate First
    quadrant-2 Plan Carefully
    quadrant-3 Defer
    quadrant-4 Quick Wins
    Auth Service: [0.7, 0.9]
    Payment Service: [0.8, 0.95]
    Notification Service: [0.3, 0.4]
    Reporting Service: [0.6, 0.3]
    User Profile: [0.2, 0.6]
```

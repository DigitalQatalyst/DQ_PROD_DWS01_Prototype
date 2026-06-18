---
shared-source: shared/diagrams/structurizr-primer.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Structurizr DSL Primer

## Complete Workspace Example — E-Commerce Platform

This example covers all four C4 levels in a single DSL file.

```dsl
workspace "E-Commerce Platform" "Architecture model for the e-commerce system" {

    model {
        # --- People ---
        customer = person "Customer" "Browses catalog and places orders" "Customer"
        admin    = person "Administrator" "Manages products, orders, and users" "Internal"

        # --- External Systems ---
        stripe  = softwareSystem "Stripe"   "Payment processing gateway"    "External"
        sendgrid = softwareSystem "SendGrid" "Transactional email delivery"  "External"
        sap      = softwareSystem "SAP ERP"  "Inventory and fulfillment"     "External"

        # --- Our System ---
        ecommerce = softwareSystem "E-Commerce Platform" "Allows customers to browse, order, and track purchases" {

            spa = container "Single Page App" "Customer-facing storefront" "React 18" "Web Browser"

            apiGateway = container "API Gateway" "Routes requests and enforces authentication" "Node.js / Express" {
                authMiddleware  = component "Auth Middleware"   "Validates JWT tokens"              "Express middleware"
                routerComponent = component "Request Router"    "Routes to downstream services"    "Express Router"
                rateLimiter     = component "Rate Limiter"      "Enforces per-client rate limits"  "express-rate-limit"
            }

            orderService = container "Order Service" "Manages order lifecycle and payment" "Java 21 / Spring Boot 3" {
                orderController  = component "OrderController"   "HTTP entry point for order operations" "Spring MVC @RestController"
                orderSvcComp     = component "OrderService"      "Core order business logic"             "Spring @Service"
                paymentClient    = component "PaymentClient"     "Wraps Stripe API calls"                "Feign Client"
                orderRepository  = component "OrderRepository"   "Persists order aggregates"             "Spring Data JPA"
                eventPublisher   = component "EventPublisher"    "Publishes domain events to Kafka"      "Spring Kafka"
            }

            productService = container "Product Service" "Catalog, search, and inventory" "Python 3.12 / FastAPI" {
                productRouter  = component "Product Router"    "HTTP routes for product CRUD"    "FastAPI APIRouter"
                inventorySvc   = component "Inventory Service" "Stock management logic"          "Python class"
                productRepo    = component "Product Repository" "Reads/writes product records"   "SQLAlchemy ORM"
            }

            ordersDb   = container "Orders DB"   "Stores orders and line items"  "PostgreSQL 15"  "Database"
            productsDb = container "Products DB" "Stores product catalog"        "PostgreSQL 15"  "Database"
            cache      = container "Cache"       "Session and product cache"     "Redis 7"        "Cache"
            eventBus   = container "Event Bus"   "Async domain event streaming"  "Apache Kafka"   "Queue"
        }

        # --- Relationships: People -> System ---
        customer -> ecommerce  "Uses"         "HTTPS"
        admin    -> ecommerce  "Administers"  "HTTPS"
        ecommerce -> stripe    "Processes payments via"  "HTTPS/REST"
        ecommerce -> sendgrid  "Sends emails via"        "HTTPS/REST"
        ecommerce -> sap       "Syncs inventory via"     "HTTPS/REST"

        # --- Relationships: Container Level ---
        customer       -> spa           "Uses"            "HTTPS"
        spa            -> apiGateway    "Calls"           "HTTPS/REST"
        apiGateway     -> orderService  "Routes to"       "HTTP/REST"
        apiGateway     -> productService "Routes to"      "HTTP/REST"
        orderService   -> ordersDb      "Reads/Writes"    "JDBC / TCP 5432"
        orderService   -> eventBus      "Publishes events" "Kafka protocol"
        productService -> productsDb    "Reads/Writes"    "SQLAlchemy / TCP 5432"
        productService -> cache         "Reads/Writes"    "Redis protocol"
        orderService   -> stripe        "Charges card"    "HTTPS/REST"

        # --- Relationships: Component Level (Order Service) ---
        apiGateway      -> orderController  "Forwards request" "HTTP"
        orderController -> orderSvcComp     "Delegates to"
        orderSvcComp    -> paymentClient    "Charges via"
        orderSvcComp    -> orderRepository  "Persists via"
        orderSvcComp    -> eventPublisher   "Emits events via"
        orderRepository -> ordersDb         "SQL queries"      "JDBC"
        paymentClient   -> stripe           "API call"         "HTTPS"
        eventPublisher  -> eventBus         "Publishes"        "Kafka"
    }

    views {
        systemContext ecommerce "SystemContext" {
            include *
            autoLayout lr
            description "C4 Level 1 — System Context"
        }

        container ecommerce "Containers" {
            include *
            autoLayout lr
            description "C4 Level 2 — Containers"
        }

        component orderService "OrderServiceComponents" {
            include *
            autoLayout tb
            description "C4 Level 3 — Order Service Components"
        }

        theme default

        styles {
            element "Person" {
                shape Person
                background #08427b
                color #ffffff
            }
            element "External" {
                background #999999
                color #ffffff
            }
            element "Database" {
                shape Cylinder
            }
            element "Queue" {
                shape Pipe
            }
            element "Cache" {
                shape Cylinder
                background #e67e22
            }
            element "Web Browser" {
                shape WebBrowser
            }
        }
    }
}
```

## Running Structurizr Lite

```bash
# Start Structurizr Lite against the directory containing workspace.dsl
docker run -it --rm \
  -p 8080:8080 \
  -v $(pwd):/usr/local/structurizr \
  structurizr/lite

# Export to PlantUML
docker run --rm \
  -v $(pwd):/usr/local/structurizr \
  structurizr/cli export \
  -workspace workspace.dsl \
  -format plantuml

# Export to Mermaid
docker run --rm \
  -v $(pwd):/usr/local/structurizr \
  structurizr/cli export \
  -workspace workspace.dsl \
  -format mermaid
```

## DSL Quick Reference

| Keyword | Purpose |
|---------|---------|
| `workspace` | Root element |
| `model` | Contains all elements and relationships |
| `person` | A human user |
| `softwareSystem` | Top-level system boundary |
| `container` | Deployable unit inside a system |
| `component` | Structural building block inside a container |
| `->` | Defines a relationship (source -> dest "label" "tech") |
| `views` | Defines which views to render |
| `systemContext` | L1 view |
| `container` (in views) | L2 view |
| `component` (in views) | L3 view |
| `styles` | Visual overrides per tag |
| `include *` | Auto-include all in-scope elements |
| `autoLayout` | Automatic layout direction (tb/lr/bt/rl) |

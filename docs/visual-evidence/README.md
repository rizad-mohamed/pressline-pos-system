# Production visual evidence

Captured from the final local production build with fictional demo data, Chromium, 1440px desktop and 390px mobile. These are direct browser renders; no compositing or generated screenshot imagery. Full-page captures may extend beyond the viewport. The populated desktop POS and mobile drawer captures show the actual viewport. Receipt/ticket images use print media; PDFs are each one A4 page. Browser console/page error log: empty.

| Area                    | Actual capture                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entry and roles         | [Entry](login-1440.png), [cashier dashboard](cashier-dashboard-1440.png), [administrator dashboard](admin-dashboard-1440.png)                                                         |
| Print workspace         | [Initial](pos-1440.png), [populated desktop](pos-populated-1440.png), [empty recovery](pos-empty-1440.png), [mobile](pos-390.png), [mobile order sheet](mobile-current-order-390.png) |
| Order and production    | [Order details](order-detail-drawer-1440.png), [production queue](production-jobs-1440.png)                                                                                           |
| Inventory and transfers | [Inventory](inventory-1440.png), [material drawer](inventory-drawer-1440.png), [transfers](transfers-1440.png), [transfer drawer](transfer-drawer-1440.png)                           |
| Administration          | [Reports](reports-1440.png), [unsent SMS preview](sms-1440.png), [settings](settings-1440.png), [profile](profile-1440.png)                                                           |
| Printing                | [Receipt image](customer-receipt-print.png), [receipt PDF](customer-receipt.pdf), [ticket image](production-ticket-print.png), [ticket PDF](production-ticket.pdf)                    |
| Runtime                 | [Raw six-sample production lab](production-pos-lab.json), [browser errors](browser-errors.json)                                                                                       |

Viewport emulation and PDF rendering do not establish physical-device, assistive-technology or printer compatibility. Runtime samples are account-primed local lab navigations; see scope and throttling in the raw JSON. No field CWV/INP or Lighthouse claim.

Newer connected customer/service/material evidence is in [followup](followup/README.md). The captures and runtime values above remain the earlier premium-phase checkpoint, not the current feature evidence.

Current mobile refinement evidence is in [mobile](mobile/README.md). Earlier premium and connected-follow-up galleries remain historical checkpoints.

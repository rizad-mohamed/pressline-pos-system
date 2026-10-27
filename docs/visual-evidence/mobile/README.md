# Mobile refinement visual evidence

Actual fictional-data production captures; matching clock 2026-10-25 06:30 UTC / Asia/Colombo. Reviewed on 2026-10-27–28. Raw 60-route renders and all 36 matching desktop comparisons remain in ignored .local/mobile-final; selected reviewable artifacts are retained here. More and landscape inset images were refreshed after their isolated corrections.

| Existing screen | Phone 390px                | Tablet 820px                |
| --------------- | -------------------------- | --------------------------- |
| dashboard       | [Phone](dashboard-390.png) | [Tablet](dashboard-820.png) |
| pos             | [Phone](pos-390.png)       | [Tablet](pos-820.png)       |
| orders          | [Phone](orders-390.png)    | [Tablet](orders-820.png)    |
| customers       | [Phone](customers-390.png) | [Tablet](customers-820.png) |
| jobs            | [Phone](jobs-390.png)      | [Tablet](jobs-820.png)      |
| inventory       | [Phone](inventory-390.png) | [Tablet](inventory-820.png) |
| transfers       | [Phone](transfers-390.png) | [Tablet](transfers-820.png) |
| pricing         | [Phone](pricing-390.png)   | [Tablet](pricing-820.png)   |
| reports         | [Phone](reports-390.png)   | [Tablet](reports-820.png)   |
| sms             | [Phone](sms-390.png)       | [Tablet](sms-820.png)       |
| settings        | [Phone](settings-390.png)  | [Tablet](settings-820.png)  |
| profile         | [Phone](profile-390.png)   | [Tablet](profile-820.png)   |

Desktop examples: [Dashboard](dashboard-1440.png), [POS](pos-1440.png), [Inventory](inventory-1440.png). [All 36 desktop comparisons](desktop-comparison.json): 33 exact; three unchanged search icons differ by twelve pixels each.

Before examples: [Dashboard](before-dashboard-390.png), [POS](before-pos-390.png), [Inventory phone](before-inventory-390.png), [Inventory tablet](before-inventory-820.png), [Desktop POS](before-pos-1440.png).

Interactions: [Admin More](more-admin-390.png), [Cashier More](more-cashier-390.png), [Cashier Dashboard](dashboard-cashier-390.png), [Current order](current-order-390.png), [Review](review-order-390.png), [Customer editor](customer-editor-390.png), [Service editor](service-editor-390.png), [Material editor](material-editor-390.png), [Landscape safe insets](landscape-safe-insets.png).

Printing: [Receipt image](receipt-print.png), [receipt PDF](receipt.pdf), [job image](job-print.png), [job PDF](job.pdf). This seed receipt has two A4 pages, as does the matching pre-mobile baseline; their print screenshots are pixel-identical. Job ticket is one page. Physical printer output unverified.

Measurements: [capture/browser/Taste evidence](capture-evidence.json), [source advisories](taste-source.json), [baseline runtime](baseline-runtime.json), [final runtime](final-runtime.json), [assets](bundle.json), [browser engines/input modes](engine-smoke.json), [inset measurements](side-insets.json). No browser exceptions/console errors/external runtime requests occurred in the captured routes.

Taste: 36 signed-in combinations, zero FAIL/four desktop whitespace WARN; source zero FAIL/29 contextual WARN. Existing small-title/header exceptions are unchanged. Warnings are retained.

Reproduce on the local production server at port 3001 with node scripts/capture-mobile.mjs, node scripts/measure-mobile.mjs final and node scripts/check-mobile-engines.mjs. The capture helper requires the installed reviewed Taste skill. Before images come from the retained baseline, not a recreated mockup. Automated E2E uses PRESSLINE_TEST_PORT; CI builds/starts production itself.

Viewport/inset/touch/keyboard simulations and desktop browser engines do not establish physical-device, real screen-reader, participant, printer or production compatibility. Runtime includes warmed assets/automation; no field INP/CWV/Lighthouse or performance score is claimed.

Additional retained evidence: [paired baseline runtime](baseline-paired-runtime.json), [paired final runtime](final-paired-runtime.json), and [executed gate summary](verification.json). All four runtime datasets remain available; no performance-improvement claim follows from their variability.

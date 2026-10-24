# Connected follow-up production visual evidence

Direct Chromium renders from `npm run start -- --port 3001`, isolated fictional data, 1440/768/390 widths, reduced motion. Images are actual browser captures; receipt/ticket use print media. Full-page images can extend below the viewport. Selected desktop/mobile and tablet dialog captures were inspected after the first visual pass and repairs. Automated nine-width/zoom/axe/focus evidence is in the 44-test suite; no physical device/AT/printer claim.

| Workflow                                 | Desktop                                | Tablet                               | Mobile                               |
| ---------------------------------------- | -------------------------------------- | ------------------------------------ | ------------------------------------ |
| Administrator service/recipe setup       | [1440](service-setup-1440.png)         | [768](service-setup-768.png)         | [390](service-setup-390.png)         |
| POS returning-customer quick view        | [1440](customer-selection-1440.png)    | [768](customer-selection-768.png)    | [390](customer-selection-390.png)    |
| Managed banner selected in POS           | [1440](pos-managed-banner-1440.png)    | [768](pos-managed-banner-768.png)    | [390](pos-managed-banner-390.png)    |
| Customer scoped account/payment history  | [1440](customer-account-1440.png)      | [768](customer-account-768.png)      | [390](customer-account-390.png)      |
| Actual branch stock-impact confirmation  | [1440](material-confirmation-1440.png) | [768](material-confirmation-768.png) | [390](material-confirmation-390.png) |
| Immutable job movement evidence          | [1440](material-history-1440.png)      | [768](material-history-768.png)      | [390](material-history-390.png)      |
| Same movement in Inventory               | [1440](inventory-movements-1440.png)   | [768](inventory-movements-768.png)   | [390](inventory-movements-390.png)   |
| Reasoned administrator correction review | [1440](correction-review-1440.png)     | [768](correction-review-768.png)     | [390](correction-review-390.png)     |

Print evidence: [Receipt image](receipt-1440.png), [receipt PDF](receipt.pdf), [job image](job-1440.png), [job PDF](job.pdf). PDF page-count evidence is in validation-log.md; no maximum page count is promised for arbitrarily long jobs/history. [Raw capture/ledger/error/Taste evidence](capture-evidence.json) records actual values and findings. The gallery context records one five-roll event (15 at Branch 1, 12 at Branch 2), total 350000 cents and payments 150000 cents; the correction/replacement scenario is a separate tested browser context.

[Raw source Taste findings](taste-source.json): 0 FAIL / 29 contextual WARN. Browser measurement retains 5 WARN across 18 combinations; operational typography and table spacing advisories remain explicit rather than hidden passes.

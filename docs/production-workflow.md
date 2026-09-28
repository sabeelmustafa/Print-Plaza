# Production job orders

Confirming a quotation now creates a pending customer order, without allocating a PJO number. Repeat confirmation returns the existing order. Confirmation and order creation use one database transaction.

Use **Create PJO** in the admin header to select one or more waiting orders. A PJO records paper stocks, GSM, parent/cut sheet sizes, sheet quantities, wastage, imposition, press colors, plates, finishing operations, delivery, and production notes. Finishing can apply to all selected orders or a subset. Printing a PJO includes its member orders and production details without invoice amounts.

The pipeline shows grouped PJOs above customer orders and includes a **Waiting for PJO** filter. Customer invoices, payments and quantities remain on the individual orders. Production status is changed on the PJO; delivery and cancellation remain individual order actions. Delivered and cancelled orders are excluded from grouped status updates.

Existing per-order PJOs are preserved and cannot be allocated a second time. New orders are assigned as whole orders to one PJO; splitting quantities between runs is not supported. PJO specifications can be edited until completion; membership is fixed after creation. Operators must check compatibility and enter imposition/sheet counts themselves; this does not automatically calculate gang layouts.

## Installation

Deploy the updated server files, including `production.cjs`, `quotationConfirmation.cjs`, and `database/production_migration.sql`, together with the rebuilt frontend. The existing server startup schema setup runs the additive production migration automatically. The database user needs CREATE TABLE privileges. Alternatively, apply `database/production_migration.sql` to the existing database before restarting the server. It adds `production_jobs` and `production_job_orders` without rewriting old orders.

The base `orders` table must already exist. The migration must complete successfully before the new production API can be used. Watch startup logs for schema errors.

## Verification

Run `node --test scripts/production.test.cjs`, `npm run lint`, and `npm run build`.

The workflow tests exercise handlers using a simulated database connection, including rollback and duplicate confirmation paths. They do not replace an integration check against MySQL. On a staging database, confirm a quote twice (one order, no PJO), group two pending orders, reload, print the ticket, edit specifications, and complete the run. Verify that orders retain separate invoices and cannot be assigned to another PJO.

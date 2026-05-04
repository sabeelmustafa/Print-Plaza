# Security Specification

## Data Invariants
1. A user can only create their own profile and by default is a 'client'.
2. Only admins can modify products.
3. Users can only view their own orders; admins can view all.
4. Orders must have a valid `userId` matching the request auth UID.
5. Order status can only be updated by an admin.

## The Dirty Dozen Payloads

1. **Self-Promotion**: Create a user profile with `role: 'admin'` as a regular user. (Fail: Rejected by `isValidUser`)
2. **Order Hijacking**: Create an order with `userId` of another user. (Fail: Rejected by `isValidOrder`)
3. **Price Manipulation**: Create an order with `totalPrice: -100`. (Fail: Rejected by `isValidOrder`)
4. **Status Forging**: Create an order with `status: 'completed'`. (Fail: Rejected by `isValidOrder` requiring `pending` on creation)
5. **Product Tampering**: Update a product as a non-admin. (Fail: Rejected by `isAdmin` check)
6. **Ghost Field Injection**: Add `isVerified: true` to a user profile. (Fail: Rejected by `keys().size() == 5`)
7. **Identity Spoofing**: Update another user's profile. (Fail: Rejected by `isOwner(userId)`)
8. **Resource Poisoning**: Create a product with a 1MB name string. (Fail: Rejected by `size() < 200`)
9. **Query Scraping**: Attempt to list all orders without filtering by `userId`. (Fail: Rejected by `resource.data.userId == request.auth.uid` in `list` rule)
10. **Admin Escalation**: Create a document in `/admins/` to gain privileges. (Fail: No write permissions to `/admins/`)
11. **PII Leak**: Request a user profile of someone else. (Fail: Rejected by `isOwner(userId)`)
12. **Status Shortcut**: Update an order status to 'completed' as a client. (Fail: Rejected by `isAdmin` check for updates)

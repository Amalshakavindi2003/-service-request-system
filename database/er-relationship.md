# ER Relationship Explanation

## Entities
1. users
- Primary key: id
- Stores account and profile details for both normal users and admins.

2. service_requests
- Primary key: id
- Foreign key: user_id -> users.id
- Stores each service request submitted by a user.

## Relationship
- One-to-Many (1:N)
- One user can create many service_requests.
- Each service_request belongs to exactly one user.

## Why this design is good
- Keeps user/account data separated from request transaction data.
- Supports future analytics by status, department, category, and timeline.
- Makes role-based access straightforward for admin vs user views.
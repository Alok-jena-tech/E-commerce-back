Full-Stack E-Commerce App

Stack: React + Tailwind CSS + Redux (Thunk) · Node.js · Express · MongoDB (Mongoose) · PayPal · Multer/Cloudinary · 

Project Summary

Rabit is a full-featured e-commerce application supporting guest and authenticated shopping flows. Public users can browse and filter products; authenticated users can checkout with PayPal and view order history. Admins have a dashboard to manage products, orders, and users.

Key Features

Public product browsing and product detail pages (no login required).

Powerful filtering & sorting: gender, category, color, size, brand, price range, date/price asc/desc.

Guest cart + authenticated cart merge: guest cart (guestId) persists in localStorage; on login the server merges guest cart to user cart.

Authentication: JWT tokens in Authorization header; role-based access (user/admin).

Checkout: PayPal integration (handled in frontend) — on success an Order document is created in the backend.

Order tracking: purchase date, delivery date, status (processing → shipping → delivered).

Admin dashboard: product CRUD (create/edit/delete), order management (status updates), user role management.

Image uploads: Multer for parsing + Cloudinary (or CDN) for storage.

Deployment: Frontend & backend deployed to Vercel; MongoDB Atlas for database.

Data Models (high level)

User:

{ name, email, passwordHash, role, addresses[] }


Product:

{ name, images[], price, brand, category, gender, sizes[], colors[], stock }


Cart:

{ userId? | guestId?, products: [{ productId, qty, size, color }] }


Order:

{ userId, products, shippingAddress, paymentResult, totalPrice, status, purchaseDate, deliveryDate }


Checkout:

{ userId, cartId, shippingAddress, paymentMethod, isPaid, paidAt }


Subscribe:

{ email, createdAt }

Important Implementation Notes

Cart merge logic: On login, client sends guestId; server merges items by productId+size+color (sum qty), removes guest cart.

Payment: PayPal integration is implemented in the frontend using @paypal/react-paypal-js.
Backend receives payment confirmation and creates an Order document to prevent fraud.

Security: Passwords hashed with bcrypt; admin endpoints protected by JWT + role middleware; CORS configured to allow deployed domain + localhost for dev.

Performance: Product endpoints support pagination (limit, page) and filters are indexed in MongoDB for speed.

Run Locally

git clone <repo>

cd backend — set .env (MONGO_URI, JWT_SECRET, CLOUDINARY creds)

npm install

npm run dev (for backend)
Frontend:  npm install && npm run dev.


MongoDB Atlas used as the cloud database.

Demo Flow (short)

Browse products → apply filters.

Add items to cart as guest → sign up/login → cart merges.

Checkout with PayPal (frontend flow) → on success backend creates order.

Switch to admin → create/update product and change order status.

Contact

Alok Kumar Jena — available for walkthroughs and code review.

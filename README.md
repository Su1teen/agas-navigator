# AGAS Navigator

# SYSTEM ROLE & ARCHITECTURE INSTRUCTIONS

You are an Elite Full-Stack Developer and UI/UX Engineer. Your task is to build a comprehensive, production-ready frontend for a multi-tenant B2B seller platform called "AGAS seller". 

This platform allows companies (admins) to upload catalogs, manage complex pricing, track logistics, and view deep analytics. Build the application using React/Next.js, TypeScript, and Tailwind CSS. Use Zustand for state management and Lucide React for icons. Do NOT leave placeholders; use rich, realistic mock data for all arrays, states, and charts so the application is fully interactive and demonstrable immediately.

---

# 1. UI/UX DESIGN SYSTEM (STRICT CONSTRAINTS)

*   **Aesthetic Theme:** "Apple Enterprise". Clean, highly professional, minimalist, and trustworthy.

*   **Materials:** Extensive use of "Liquid Glass UI" (Glassmorphism). Use Tailwind classes like `backdrop-blur-xl`, `bg-white/60`, and subtle `border-white/20` for floating cards, sticky headers, and modals. 

*   **Colors:** Monochrome base (pure white, slate grays, deep blacks) with desaturated, elegant accent colors for active states (e.g., a muted deep blue or subtle emerald).

*   **ANTI-AI SLOP RULE:** You are strictly forbidden from using neon glowing effects, heavy drop shadows, over-saturated "cyberpunk" colors, or cheap 3D-generated icons. Everything must look like a mature SaaS product used by Fortune 500 companies.

*   **Tenant Context:** The UI must display the active company as "SGK (Smart Group Kazakhstan)" in the top navigation profile area.

---

# 2. GLOBAL CONTROLS & LOCALIZATION

*   **Language Engine:** A smooth toggle in the navbar switching the entire interface between English (EN) and Russian (RU). Include a robust mock translation dictionary for all headers, buttons, and labels.

*   **Currency Engine:** A global toggle between USD ($) and KZT (₸). 

    *   *Requirement:* All dashboards, charts, tables, and price calculators must instantly recalculate and format based on this toggle. Assume a fixed mock exchange rate (e.g., 1 USD = 480 KZT).

---

# 3. CORE MODULES & FEATURES

### Module A: The Intelligent Pricing & Product Upload Engine

This is the most critical feature. The UI should have tabs for "Single Product Onboarding" and "Bulk Excel Import".

*   **Single Product Upload:** 

    *   Form fields: Name, Rich Text Description, Image Dropzone, Category Selector (e.g., Smart Home, HVAC, Lighting, Security), and Hashtag multi-select.

    *   **The Profitability Calculator (Live UI):** A split-pane view. On the left, the user inputs their data. On the right, a "Live Pricing Breakdown" (like a receipt) updates instantly.

        *   Input 1: `Cost of Goods (COGS)`

        *   Input 2: `Desired Profit Margin (%)` -> Auto-calculates `Base Selling Price`.

        *   Fixed Additions: `Shipping Cost (Fixed 20% of Base)` + `Tax (Fixed 21% of Base)`.

        *   Output: `Final Retail Price`.

        *   *Feature:* Add a "Apply Discount" toggle that dynamically reduces the final price and shows how it impacts the profit margin.

    *   *Live Preview:* A small rendered card showing exactly how the product will look to the end-buyer.

*   **Bulk Excel Upload System:**

    *   Button: "Download Master Template (.xlsx)".

    *   Upload Dropzone: For the populated Excel file.

    *   **Validation Stage (Vital):** Before committing to the database, show a Data Grid preview of the uploaded items. Highlight rows with errors (e.g., missing price, wrong category) in red, allowing the user to inline-edit and fix them before clicking "Publish Catalog".

    *   **Upload History:** A data table showing past batch uploads (Date, File Name, Items Processed, Status).

### Module B: Per-Product Deep Dive

Clicking any product from the catalog opens a detailed modal/page.

*   **Micro-Analytics:** A Recharts line-chart showing unit sales over the last 6 months *specifically for this item*.

*   **Feedback Loop:** A section displaying mock user comments, star ratings, and reviews from end-buyers.

*   **Inventory Status (Vital):** Current stock levels, with a color-coded indicator (Green: Healthy, Yellow: Low, Red: Out of Stock).

### Module C: Logistics & Current Sales (Order Tracking)

A dedicated page for active transactions. Use a Kanban board or a highly detailed Data Table.

*   **Data Columns:** Order ID, Customer Name, Product Name, Quantity, Total Price.

*   **Logistics Tracking:** 

    *   Status badges: "Processing", "In Transit", "Customs", "Delivered", "Return/Dispute" (Vital real-world feature).

    *   Countdown: "Days Before Shipping Deadline" (e.g., "2 Days Left" in red if urgent).

    *   Location: "Current Warehouse location".

### Module D: Executive Analytics Dashboard (Personalized)

The landing page of the application. It must be heavily informative, utilizing realistic data visualization.

*   **Top KPI Cards:** Total Revenue, Net Profit, Total Orders, Active Disputes. (All responsive to USD/KZT).

*   **Main Chart:** A beautiful, smooth Line Chart mapping Revenue vs. Profit over a 12-month period.

*   **Categorical Chart:** A Bar or Donut chart showing "Revenue by Product Category".

*   **Stock Alerts (Vital):** A small widget showing "Products requiring immediate restock".

*   **AI Integration:**

    *   **Actionable Insights Widget:** A glassmorphic card presenting AI-generated tips based on mock data (e.g., "Tip: Security Sensors are trending. Consider increasing inventory by 15% before Q3.").

    *   **AI Chat Assistant:** A floating action button (bottom right) that opens a sleek chat drawer. The seller can "ask" questions like "What is my best selling product?" (Provide a mocked conversational response).

### Module E: Settings & Team (RBAC) - Vital Addition

*   A settings page demonstrating Role-Based Access Control.

*   List mock team members for SGK. Show roles: "Owner", "Catalog Editor", "Financial Analyst". This proves the platform is enterprise-ready.

---

# EXECUTION COMMAND

Begin generating the complete React application code for the "AGAS seller" platform following these strict guidelines, ensuring all math logic in the pricing calculator is perfectly accurate and all charts render with the provided mock data.

```eof

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bd28ffd8-fe02-4fa2-8621-d0c46e035a96).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

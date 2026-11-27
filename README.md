# B2B Lead Generation & CRM Platform

A full-stack B2B Lead Generation & CRM platform that automates Google Maps business data extraction, streamlines lead management, and enhances sales outreach through an efficient, data-driven workflow.

## Overview

The B2B Lead Generation & CRM Platform helps businesses discover potential customers, collect business information from Google Maps, and manage sales leads through a centralized CRM dashboard.

It simplifies the lead generation process by reducing manual data collection and providing an organized workflow for tracking prospects, managing follow-ups, and improving sales productivity.

## Key Features

- **Automated Lead Generation:** Extract business information from Google Maps.
- **Business Data Collection:** Collect relevant business details, including names, addresses, phone numbers, websites, and categories where available.
- **Lead Management:** Organize and manage collected leads from a centralized dashboard.
- **Lead Status Tracking:** Track leads through different stages of the sales pipeline.
- **Follow-up Management:** Keep track of potential customers and follow-up activities.
- **Search & Filtering:** Find and filter leads based on relevant business information.
- **CRM Dashboard:** Monitor and manage lead generation and sales activities.
- **Sales Outreach:** Streamline the process of connecting with potential customers.

## Lead Management Workflow

The platform supports the following lead statuses:

- Not Contacted
- Contacted
- Follow Up
- In Discussion
- Interested
- Won

## Technology Stack

**Frontend**
- Next.js
- React.js
- Tailwind CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB

**Automation & Tools**
- Puppeteer
- Git & GitHub
- Postman

## Project Structure

```text
project-root/
├── app/
├── components/
├── public/
├── src/
│   └── lib/
├── package.json
├── next.config.js
└── README.md
```

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)
- npm, yarn, pnpm, or bun
- MongoDB

### Installation

**1. Clone the repository**

```bash
git clone YOUR_REPOSITORY_URL
```

**2. Navigate to the project directory**

```bash
cd YOUR_PROJECT_DIRECTORY
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in the project root and add the required environment variables.

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_API_URL=your_backend_api_url
```

Replace the placeholder values with your actual configuration. Add any other environment variables required by your application.

**5. Run the development server**

```bash
npm run dev
```

**6. Open the application**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build the production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Use Cases

- B2B sales and marketing teams
- Business development professionals
- Lead generation agencies
- Digital marketing agencies
- Companies looking for potential business customers
- Sales teams managing customer acquisition

## Future Improvements

- Advanced lead analytics and reporting
- Automated email and WhatsApp outreach
- CSV and Excel lead exports
- Advanced CRM pipeline management
- Lead scoring and prioritization
- Automated follow-up reminders

## Contributing

Contributions, issues, and feature requests are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

## License

This project is currently developed for business and educational purposes.

---

**Built to simplify B2B lead generation and make sales workflows more efficient.**

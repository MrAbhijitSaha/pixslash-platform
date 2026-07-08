# Pixslash Platform 🖼️

A modern, minimalistic platform for exploring, uploading, and downloading high-quality wallpapers. 

Built with an emphasis on clean code and an editorial UI, Pixslash provides a robust full-stack experience for wallpaper enthusiasts and creators.

## 🚀 Features

- **Robust Authentication:** Secure user sessions and account management via Better Auth, supporting both standard credentials and OAuth integrations (Google, Facebook).
- **Wallpaper Management:** Seamlessly upload, manage, and download wallpapers with rich metadata, including resolution width/height, file sizes, and image formatting.
- **Community Engagement:** Users can actively interact by liking, commenting on, and saving their favorite wallpapers to personalized collections.
- **Dynamic Organization:** Discover content easily through a relational categorization and tagging system.
- **Optimized Performance:** Efficient image manipulation and processing utilizing `sharp`.

## 🛠️ Tech Stack

This project leverages a modern React ecosystem for optimal developer experience and application performance:

- **Framework:** Next.js 16 & React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Shadcn UI
- **Database:** SQLite managed with Prisma ORM and Kysely
- **Authentication:** Better Auth
- **Validation:** Zod & React Hook Form

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (>= 22.x.x)
- npm (>= 11.x.x)

### 1. Clone the repository

```bash
git clone https://github.com/ShankarDutta/pixslash-platform.git
cd pixslash-platform

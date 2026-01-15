🚀 MINI-TIME-TRACKER — Getting Started (from ZIP)
✅ Requirements
Make sure you have installed:


Node.js 18+


npm



1) Unzip the project
Unzip the archive and open the project folder:
cd MINI-TIME-TRACKER


2) Install dependencies
Backend (API)
cd apps/api
npm install

Frontend (Web)
cd ../web
npm install


3) Set up the database (Prisma + SQLite)
The app uses SQLite. The database file is located here:
apps/api/prisma/dev.db
Apply migrations and generate the Prisma Client:
cd apps/api
npx prisma generate
npx prisma migrate dev


4) Run the backend (API)
cd apps/api
npm run start:dev

✅ Backend will be running at:
http://localhost:3001

5) Run the frontend (Web)
Open a second terminal and run:
cd apps/web
npm run dev

✅ Frontend will be available at:
http://localhost:3000

✅ Using the app


Open http://localhost:3000


Fill in the Time Entry Form


Click Save


Your entries + total hours will appear at the bottom 🎯


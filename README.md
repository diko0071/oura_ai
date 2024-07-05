# Oura AI Extension

[Oura](https://ouraring.com/) is smart ring that allow you to track your sleep quality and activity.

The Oura AI Extension allows you to generate proactive insights based on three key metrics: readiness, sleep, and activity.

Check out the short video about it: [Link to Loom video](https://www.loom.com/share/9059f472834945b6bf35a2e9961ba06e?sid=f8edcf17-0780-4a56-974a-fea8907246d9)

![Oura](/images/oura.png)


## How to start and set up project:
#### 1. Clone the repository
```bash
git clone https://github.com/diko0071/oura_ai.git
```

### Backend part. 

#### Jump to backend folder
```bash
cd backend
```

#### Add .env.local file 
```bash
OURA_TOKEN=
OPENAI_API_KEY=
SECRET_KEY=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_PORT=
REDIS_URL=
```
You can create OURA token here: https://cloud.ouraring.com/

#### Build docker-image
```bash
docker-compose build
```

#### Run the project
```bash
docker-compose up
```

Open http://localhost:8000 with your browser to see the result.


#### Additional details
- I also added the Celery worker and Celery beat to the project, as I thought I could automatically trigger them. You can do this if you know the exact time you wake up or simply run the beat check every few hours.
- For LLM I use OpenAI, but it doesn't matter, you can use any other LLM you want.
- For database I use Supabase, but it doesn't matter, you can use any other database you want.

I choose them because easy to start with. 

### Frontend part. 

#### Add .env.local file 
```
NEXT_PUBLIC_API_URL=
```

#### Jump to frontend folder
```bash
cd frontend
```

#### Build the project
```bash
npm run build
```

#### Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
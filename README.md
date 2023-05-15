## AI Teaching Assistant

A multi-user web application designed for students and teachers, which enables students to ask questions related to their classwork, and teachers to review and approve the answers provided by a large language model (LLM) like OpenAI's GPT-4.

## Features

- Students can submit questions to the LLM.
- LLM provides answers, which are reviewed by teachers.
- Teachers can approve or reject answers.
- Students can view approved answers.

## Future Features

- Teachers can edit answers before approving or rejecting them.
- Add prompts to better direct the LLM's output.
- Provide specific context to the LLM about a particular lesson.

## Tech Stack

- Frontend: React
- Backend: Express
- Database: PostgreSQL

## Installation and Setup

1. Clone the repository:

   ```
   git clone https://github.com/kstrikis/ai-assistant.git
   cd ai-assistant
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Create a `.env` file in the root directory and fill in the required environment variables:

   ```
   SESSION_SECRET=generate_a_uuid_and_put_here
   DATABASE_URL=ai-assistant_development
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:

   ```
   yarn run dev
   ```

   The application should now be accessible at [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
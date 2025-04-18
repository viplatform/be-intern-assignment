# 💻 Backend Intern Assignment

## 📋 Overview

This project involves building a backend for a social media platform with features for posts, likes, follows, and hashtags. You'll be creating the core functionality that would support a social networking application.

## ✨ Features

### 🎯 Core Functionality

- 📝 Create posts with text content
- 👥 Follow and unfollow other users
- ❤️ Like posts
- #️⃣ Tag posts with hashtags

### 🔌 Essential API Endpoints

You must implement CRUD (Create, Read, Update, Delete) operations for all entities. Additionally, implement these specific endpoints:

1. **`/api/feed`** - Show users their personalized content stream 🌊

   - Returns a paginated list of posts from users the current user follows
   - Posts should be sorted by creation date (newest first)
   - Include post content, author details, like count, and hashtags
   - Support pagination with `limit` and `offset` query parameters

2. **`/api/posts/hashtag/:tag`** - Find posts by hashtag 🔍

   - Returns all posts containing the specified hashtag
   - Support case-insensitive hashtag matching
   - Include post content, author details, and like count
   - Implement pagination with `limit` and `offset` parameters

3. **`/api/users/:id/followers`** - Get user's followers 👥

   - Returns a list of users who follow the specified user
   - Include follower's basic profile information
   - Support pagination with `limit` and `offset` parameters
   - Sort followers by follow date (newest first)
   - Include total follower count in response

4. **`/api/users/:id/activity`** - View user activity history 📜

   - Returns a chronological list of user activities
   - Include posts created and likes given
   - Show follow/unfollow actions
   - Support filtering by activity type and date range
   - Implement pagination for large activity histories

### 🧪 Testing Requirements

- **Important**: If the test script fails to run, your submission will not be considered for evaluation ⚠️
- The shell script should test all CRUD operations for each entity and all the endpoints defined above
- Each endpoint must have its own test case in the shell script
- Test coverage is mandatory for all endpoints
- Test results should be clearly logged and visible in the console output

### 📝 Test Script Structure

The project includes a `test.sh` script that provides an interactive testing interface with the following structure:

1. **Main Menu**

   - List of all entities
   - Exit option

2. **Entity Submenus**
   Each entity has its own submenu with CRUD operations:

   - Get all
   - Get by ID
   - Create
   - Update
   - Delete
   - Back to main menu

3. **Special Endpoint Tests**
   The script includes tests for all the specific endpoints mentioned above, in addition to the standard CRUD operations on entities.

Note: The test script follows a consistent structure for all entities and endpoints. Each new entity should follow the same submenu pattern as the existing implementations.

### 🏗️ Code Structure

- Follow TypeORM entity structure (see `src/entities/User.ts`) for all entities
- ⚠️ Do not use the `synchronize: true` option in TypeORM - use migrations instead (see `src/migrations/1713427200000-CreateUserTable.ts`)
- Use appropriate column types and decorators
- Add Joi validations for all entities to ensure data integrity
- Follow the API pattern established in the codebase for consistency
- Migration commands:
  - `npm run migration:generate` - Generate new migrations
  - `npm run migration:run` - Apply pending migrations
  - `npm run migration:revert` - Rollback last migration

### 💾 Database Design

- Create proper relationships between entities
- Implement efficient indexes for quick queries ⚡
- Use composite indexes where needed
- Document your indexing decisions 📚

## 📚 Development Guidelines

1. ✅ Implement all required entities
2. ✅ Define proper relationships
3. ✅ Write efficient queries
4. ✅ Plan smart indexing
5. ✅ Maintain code quality
6. ✅ Keep structure consistent
7. ✅ LLM Usage Guidelines:
   - You are free to use LLMs for assistance
   - Be prepared to explain any code you submit
   - Use LLMs as a tool, not as a replacement for your understanding

## 📤 Submission Instructions

To submit your completed assignment:

1. Fork this repository to your personal GitHub account
2. Complete the assignment in your forked repository
3. Push all your changes to your forked repository
4. Send the link to your forked repository to your assignment reviewer

**Important Notes:**

- Ensure your repository is public so reviewers can access it
- Make sure all the code is committed and pushed before submitting
- Do not create pull requests to the original repository
- Fill in the existing `DESIGN.md` file with:
  - Database schema design and entity relationships
  - Indexing strategy for performance optimization
  - Scalability considerations and solutions
  - Any other important design considerations

## 🚀 Getting Started

1. Fork this repository to your personal GitHub account
2. Clone your forked repository to your local machine
3. Run `npm install`
4. Run migrations with `npm run migration:run` to set up the database
5. Start the server with `npm run dev`
6. Use SQLite Viewer Extension in VS Code to view the database, or any other viewer if not using VS Code

Made with ❤️ by the VI team

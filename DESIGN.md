# System Design Documentation

## Database Schema Design

### Core Entities

1. **User**
   - Primary key: `id`
   - Fields:
     - `firstName` (string)
     - `lastName` (string)
     - `email` (string, unique)
     - `avatarUrl` (string, nullable)
     - `createdAt` (datetime)
     - `updatedAt` (datetime)
   - Relationships:
     - One-to-Many with Posts (as author)
     - Many-to-Many with Users (self-referential for follows)

2. **Post**
   - Primary key: `id`
   - Fields:
     - `content` (text)
     - `status` (enum: DRAFT, PUBLISHED, ARCHIVED, DELETED)
     - `createdAt` (datetime)
     - `updatedAt` (datetime)
   - Relationships:
     - Many-to-One with User (author)
     - Many-to-Many with Hashtags
     - One-to-Many with PostLikes

3. **Hashtag**
   - Primary key: `id`
   - Fields:
     - `name` (string, unique)
     - `createdAt` (datetime)
     - `updatedAt` (datetime)
   - Relationships:
     - Many-to-Many with Posts

4. **PostLike**
   - Primary key: `id`
   - Fields:
     - `createdAt` (datetime)
     - `updatedAt` (datetime)
   - Relationships:
     - Many-to-One with User
     - Many-to-One with Post
   - Constraints:
     - Unique composite constraint on (userId, postId)

5. **UserFollow**
   - Primary key: `id`
   - Fields:
     - `createdAt` (datetime)
     - `updatedAt` (datetime)
   - Relationships:
     - Many-to-One with User (follower)
     - Many-to-One with User (following)
   - Constraints:
     - Unique composite constraint on (followerId, followingId)

## Indexing Strategy

### Performance Indexes

1. **Posts Table**
   ```sql
   CREATE INDEX "IDX_posts_created_at" ON "posts" ("createdAt");
   CREATE INDEX "IDX_posts_author_status" ON "posts" ("authorId", "status");
   ```
   - Optimizes feed queries by creation date
   - Improves filtering posts by author and status
   - Enhances performance for user activity feeds

2. **Hashtags Table**
   ```sql
   CREATE INDEX "IDX_hashtags_name_search" ON "hashtags" ("name");
   ```
   - Enables efficient case-insensitive hashtag searches
   - Improves performance for hashtag-based post filtering

3. **PostLikes Table**
   ```sql
   CREATE UNIQUE INDEX "IDX_post_likes_user_post" ON "post_likes" ("userId", "postId");
   ```
   - Prevents duplicate likes
   - Optimizes like count queries
   - Improves performance for user interaction checks

### Reasoning Behind Index Choices

1. **Feed Performance**
   - The `IDX_posts_created_at` index optimizes the main feed query that sorts posts by creation date
   - Combined with `IDX_posts_author_status`, it efficiently filters active posts from followed users

2. **Hashtag Search Efficiency**
   - `IDX_hashtags_name_search` enables quick hashtag lookups
   - Essential for the `/api/posts/hashtag/:tag` endpoint
   - Supports case-insensitive matching without full table scans

3. **User Interaction Optimization**
   - The unique composite index on PostLikes prevents duplicates at the database level
   - Improves performance for checking if a user has liked a post

## Scalability Considerations

### Current Implementation

1. **Pagination**
   - All list endpoints support `limit` and `offset` parameters
   - Prevents memory overload with large datasets
   - Example: `/api/feed?limit=10&offset=20`

2. **Efficient Queries**
   - Uses TypeORM query builder for optimized SQL generation
   - Implements eager loading to prevent N+1 query problems
   - Utilizes composite indexes for common query patterns

### Future Scalability Solutions

1. **Caching Strategy**
   - Implement Redis caching for:
     - User feeds
     - Trending hashtags
     - Post like counts
   - Cache invalidation on relevant updates

2. **Database Scaling**
   - Vertical scaling initially (more powerful hardware)
   - Horizontal scaling possibilities:
     - Read replicas for feed queries
     - Sharding based on user ID or post date
     - Separate databases for different features

3. **Performance Monitoring**
   - Add query performance monitoring
   - Implement slow query logging
   - Regular index usage analysis

4. **Content Delivery**
   - CDN integration for media content
   - Geographic distribution for global scale
   - Content compression strategies

## API Design Considerations

1. **Rate Limiting**
   - Implement per-user and per-IP rate limits
   - Graduated rate limits based on user activity

2. **Security**
   - Input validation using Joi
   - SQL injection prevention via TypeORM
   - Request validation middleware

3. **Error Handling**
   - Consistent error response format
   - Detailed logging for debugging
   - Graceful failure handling

## Future Improvements

1. **Search Optimization**
   - Elasticsearch integration for full-text search
   - Improved hashtag search with fuzzy matching
   - Advanced post content search

2. **Performance Enhancements**
   - Implement GraphQL for flexible data fetching
   - Background job processing for heavy operations
   - WebSocket support for real-time updates

3. **Monitoring and Analytics**
   - User engagement metrics
   - System performance metrics
   - Error rate monitoring


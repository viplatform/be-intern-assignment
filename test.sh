#!/bin/bash

# Base URLs
USERS_URL="http://localhost:3000/api/users"
POSTS_URL="http://localhost:3000/api/posts"
HASHTAGS_URL="http://localhost:3000/api/hashtags"
LIKES_URL="http://localhost:3000/api/likes"
FOLLOWS_URL="http://localhost:3000/api/follows"
FEED_URL="http://localhost:3000/api/feed"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3

    echo "Request: $method $endpoint"
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi

    if [ "$method" = "GET" ]; then
        curl -s -X $method "$endpoint" | jq .
    elif [ "$method" = "DELETE" ]; then
        local http_code=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$endpoint")
        echo "Response status: $http_code"
    else
        curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" | jq .
    fi
    echo ""
}

# ========================
# User test functions
# ========================
test_get_all_users() {
    print_header "Testing GET all users"
    make_request "GET" "$USERS_URL"
}

test_get_user() {
    print_header "Testing GET user by ID"
    read -p "Enter user ID: " user_id
    make_request "GET" "$USERS_URL/$user_id"
}

test_create_user() {
    print_header "Testing POST create user"
    read -p "Enter first name: " firstName
    read -p "Enter last name: " lastName
    read -p "Enter email: " email

    local user_data=$(cat <<EOF
{
    "firstName": "$firstName",
    "lastName": "$lastName",
    "email": "$email"
}
EOF
)
    make_request "POST" "$USERS_URL" "$user_data"
}

test_update_user() {
    print_header "Testing PUT update user"
    read -p "Enter user ID to update: " user_id
    read -p "Enter new first name (press Enter to keep current): " firstName
    read -p "Enter new last name (press Enter to keep current): " lastName
    read -p "Enter new email (press Enter to keep current): " email

    local update_data="{"
    local has_data=false

    if [ -n "$firstName" ]; then
        update_data+="\"firstName\": \"$firstName\""
        has_data=true
    fi

    if [ -n "$lastName" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"lastName\": \"$lastName\""
        has_data=true
    fi

    if [ -n "$email" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"email\": \"$email\""
        has_data=true
    fi

    update_data+="}"

    make_request "PUT" "$USERS_URL/$user_id" "$update_data"
}

test_delete_user() {
    print_header "Testing DELETE user"
    read -p "Enter user ID to delete: " user_id
    make_request "DELETE" "$USERS_URL/$user_id"
}

# ========================
# Post test functions
# ========================
test_get_all_posts() {
    print_header "Testing GET all posts"
    read -p "Limit (default 10): " limit
    read -p "Offset (default 0): " offset
    limit=${limit:-10}
    offset=${offset:-0}
    make_request "GET" "$POSTS_URL?limit=$limit&offset=$offset"
}

test_get_post() {
    print_header "Testing GET post by ID"
    read -p "Enter post ID: " post_id
    make_request "GET" "$POSTS_URL/$post_id"
}

test_create_post() {
    print_header "Testing POST create post"
    read -p "Enter user ID: " userId
    read -p "Enter content: " content
    read -p "Enter hashtags (comma separated, or press Enter to skip): " tags_input

    if [ -n "$tags_input" ]; then
        # turn comma separated tags into a json array
        local tags_json="["
        local first=true
        IFS=',' read -ra TAGS <<< "$tags_input"
        for tag in "${TAGS[@]}"; do
            tag=$(echo "$tag" | xargs) # trim whitespace
            if [ "$first" = true ]; then
                tags_json+="\"$tag\""
                first=false
            else
                tags_json+=", \"$tag\""
            fi
        done
        tags_json+="]"

        local post_data="{\"content\": \"$content\", \"userId\": $userId, \"hashtags\": $tags_json}"
    else
        local post_data="{\"content\": \"$content\", \"userId\": $userId}"
    fi

    make_request "POST" "$POSTS_URL" "$post_data"
}

test_update_post() {
    print_header "Testing PUT update post"
    read -p "Enter post ID to update: " post_id
    read -p "Enter new content (press Enter to skip): " content
    read -p "Enter new hashtags (comma separated, press Enter to skip): " tags_input

    local update_data="{"
    local has_data=false

    if [ -n "$content" ]; then
        update_data+="\"content\": \"$content\""
        has_data=true
    fi

    if [ -n "$tags_input" ]; then
        local tags_json="["
        local first=true
        IFS=',' read -ra TAGS <<< "$tags_input"
        for tag in "${TAGS[@]}"; do
            tag=$(echo "$tag" | xargs)
            if [ "$first" = true ]; then
                tags_json+="\"$tag\""
                first=false
            else
                tags_json+=", \"$tag\""
            fi
        done
        tags_json+="]"

        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"hashtags\": $tags_json"
        has_data=true
    fi

    update_data+="}"

    make_request "PUT" "$POSTS_URL/$post_id" "$update_data"
}

test_delete_post() {
    print_header "Testing DELETE post"
    read -p "Enter post ID to delete: " post_id
    make_request "DELETE" "$POSTS_URL/$post_id"
}

# ========================
# Hashtag test functions
# ========================
test_get_all_hashtags() {
    print_header "Testing GET all hashtags"
    make_request "GET" "$HASHTAGS_URL"
}

test_get_hashtag() {
    print_header "Testing GET hashtag by ID"
    read -p "Enter hashtag ID: " hashtag_id
    make_request "GET" "$HASHTAGS_URL/$hashtag_id"
}

test_create_hashtag() {
    print_header "Testing POST create hashtag"
    read -p "Enter hashtag name: " name
    make_request "POST" "$HASHTAGS_URL" "{\"name\": \"$name\"}"
}

test_update_hashtag() {
    print_header "Testing PUT update hashtag"
    read -p "Enter hashtag ID to update: " hashtag_id
    read -p "Enter new name: " name
    make_request "PUT" "$HASHTAGS_URL/$hashtag_id" "{\"name\": \"$name\"}"
}

test_delete_hashtag() {
    print_header "Testing DELETE hashtag"
    read -p "Enter hashtag ID to delete: " hashtag_id
    make_request "DELETE" "$HASHTAGS_URL/$hashtag_id"
}

# ========================
# Like test functions
# ========================
test_get_all_likes() {
    print_header "Testing GET all likes"
    make_request "GET" "$LIKES_URL"
}

test_get_like() {
    print_header "Testing GET like by ID"
    read -p "Enter like ID: " like_id
    make_request "GET" "$LIKES_URL/$like_id"
}

test_get_likes_for_post() {
    print_header "Testing GET likes for a post"
    read -p "Enter post ID: " post_id
    make_request "GET" "$LIKES_URL/post/$post_id"
}

test_create_like() {
    print_header "Testing POST create like"
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId
    make_request "POST" "$LIKES_URL" "{\"userId\": $userId, \"postId\": $postId}"
}

test_unlike_post() {
    print_header "Testing POST unlike"
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId
    make_request "POST" "$LIKES_URL/unlike" "{\"userId\": $userId, \"postId\": $postId}"
}

test_delete_like() {
    print_header "Testing DELETE like"
    read -p "Enter like ID to delete: " like_id
    make_request "DELETE" "$LIKES_URL/$like_id"
}

# ========================
# Follow test functions
# ========================
test_get_all_follows() {
    print_header "Testing GET all follows"
    make_request "GET" "$FOLLOWS_URL"
}

test_get_follow() {
    print_header "Testing GET follow by ID"
    read -p "Enter follow ID: " follow_id
    make_request "GET" "$FOLLOWS_URL/$follow_id"
}

test_get_following() {
    print_header "Testing GET following list"
    read -p "Enter user ID: " userId
    make_request "GET" "$FOLLOWS_URL/user/$userId/following"
}

test_create_follow() {
    print_header "Testing POST create follow"
    read -p "Enter follower user ID: " followerId
    read -p "Enter user ID to follow: " followingId
    make_request "POST" "$FOLLOWS_URL" "{\"followerId\": $followerId, \"followingId\": $followingId}"
}

test_unfollow() {
    print_header "Testing POST unfollow"
    read -p "Enter follower user ID: " followerId
    read -p "Enter user ID to unfollow: " followingId
    make_request "POST" "$FOLLOWS_URL/unfollow" "{\"followerId\": $followerId, \"followingId\": $followingId}"
}

test_delete_follow() {
    print_header "Testing DELETE follow"
    read -p "Enter follow ID to delete: " follow_id
    make_request "DELETE" "$FOLLOWS_URL/$follow_id"
}

# ========================
# Feed test function
# ========================
test_get_feed() {
    print_header "Testing GET feed"
    read -p "Enter user ID: " userId
    read -p "Limit (default 10): " limit
    read -p "Offset (default 0): " offset
    limit=${limit:-10}
    offset=${offset:-0}
    make_request "GET" "$FEED_URL?userId=$userId&limit=$limit&offset=$offset"
}

# ========================
# Posts by hashtag test
# ========================
test_posts_by_hashtag() {
    print_header "Testing GET posts by hashtag"
    read -p "Enter hashtag name: " tag
    read -p "Limit (default 10): " limit
    read -p "Offset (default 0): " offset
    limit=${limit:-10}
    offset=${offset:-0}
    make_request "GET" "$POSTS_URL/hashtag/$tag?limit=$limit&offset=$offset"
}

# ========================
# User followers test
# ========================
test_get_followers() {
    print_header "Testing GET user followers"
    read -p "Enter user ID: " userId
    read -p "Limit (default 10): " limit
    read -p "Offset (default 0): " offset
    limit=${limit:-10}
    offset=${offset:-0}
    make_request "GET" "$USERS_URL/$userId/followers?limit=$limit&offset=$offset"
}

# ========================
# User activity test
# ========================
test_get_activity() {
    print_header "Testing GET user activity"
    read -p "Enter user ID: " userId
    read -p "Filter by type (post/like/follow, or press Enter for all): " type
    read -p "Start date (YYYY-MM-DD, or press Enter to skip): " startDate
    read -p "End date (YYYY-MM-DD, or press Enter to skip): " endDate
    read -p "Limit (default 10): " limit
    read -p "Offset (default 0): " offset
    limit=${limit:-10}
    offset=${offset:-0}

    local url="$USERS_URL/$userId/activity?limit=$limit&offset=$offset"
    if [ -n "$type" ]; then
        url+="&type=$type"
    fi
    if [ -n "$startDate" ]; then
        url+="&startDate=$startDate"
    fi
    if [ -n "$endDate" ]; then
        url+="&endDate=$endDate"
    fi
    make_request "GET" "$url"
}

# ========================
# Submenu functions
# ========================
show_users_menu() {
    echo -e "\n${GREEN}Users Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create new user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

show_posts_menu() {
    echo -e "\n${GREEN}Posts Menu${NC}"
    echo "1. Get all posts"
    echo "2. Get post by ID"
    echo "3. Create new post"
    echo "4. Update post"
    echo "5. Delete post"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

show_hashtags_menu() {
    echo -e "\n${GREEN}Hashtags Menu${NC}"
    echo "1. Get all hashtags"
    echo "2. Get hashtag by ID"
    echo "3. Create new hashtag"
    echo "4. Update hashtag"
    echo "5. Delete hashtag"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

show_likes_menu() {
    echo -e "\n${GREEN}Likes Menu${NC}"
    echo "1. Get all likes"
    echo "2. Get like by ID"
    echo "3. Get likes for a post"
    echo "4. Create like"
    echo "5. Unlike a post"
    echo "6. Delete like"
    echo "7. Back to main menu"
    echo -n "Enter your choice (1-7): "
}

show_follows_menu() {
    echo -e "\n${GREEN}Follows Menu${NC}"
    echo "1. Get all follows"
    echo "2. Get follow by ID"
    echo "3. Get following list for user"
    echo "4. Create follow"
    echo "5. Unfollow"
    echo "6. Delete follow"
    echo "7. Back to main menu"
    echo -n "Enter your choice (1-7): "
}

show_special_menu() {
    echo -e "\n${GREEN}Special Endpoints Menu${NC}"
    echo "1. Get feed"
    echo "2. Get posts by hashtag"
    echo "3. Get user followers"
    echo "4. Get user activity"
    echo "5. Back to main menu"
    echo -n "Enter your choice (1-5): "
}

# Main menu
show_main_menu() {
    echo -e "\n${GREEN}API Testing Menu${NC}"
    echo "1. Users"
    echo "2. Posts"
    echo "3. Hashtags"
    echo "4. Likes"
    echo "5. Follows"
    echo "6. Special Endpoints (Feed, Hashtag Search, Followers, Activity)"
    echo "7. Exit"
    echo -n "Enter your choice (1-7): "
}

# Main loop
while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_users ;;
                    2) test_get_user ;;
                    3) test_create_user ;;
                    4) test_update_user ;;
                    5) test_delete_user ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        2)
            while true; do
                show_posts_menu
                read post_choice
                case $post_choice in
                    1) test_get_all_posts ;;
                    2) test_get_post ;;
                    3) test_create_post ;;
                    4) test_update_post ;;
                    5) test_delete_post ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        3)
            while true; do
                show_hashtags_menu
                read hashtag_choice
                case $hashtag_choice in
                    1) test_get_all_hashtags ;;
                    2) test_get_hashtag ;;
                    3) test_create_hashtag ;;
                    4) test_update_hashtag ;;
                    5) test_delete_hashtag ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        4)
            while true; do
                show_likes_menu
                read like_choice
                case $like_choice in
                    1) test_get_all_likes ;;
                    2) test_get_like ;;
                    3) test_get_likes_for_post ;;
                    4) test_create_like ;;
                    5) test_unlike_post ;;
                    6) test_delete_like ;;
                    7) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        5)
            while true; do
                show_follows_menu
                read follow_choice
                case $follow_choice in
                    1) test_get_all_follows ;;
                    2) test_get_follow ;;
                    3) test_get_following ;;
                    4) test_create_follow ;;
                    5) test_unfollow ;;
                    6) test_delete_follow ;;
                    7) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        6)
            while true; do
                show_special_menu
                read special_choice
                case $special_choice in
                    1) test_get_feed ;;
                    2) test_posts_by_hashtag ;;
                    3) test_get_followers ;;
                    4) test_get_activity ;;
                    5) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        7) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice. Please try again." ;;
    esac
done

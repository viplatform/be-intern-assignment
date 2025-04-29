#!/bin/bash

# Base URLs
USERS_URL="http://localhost:3000/api/users"
POSTS_URL="http://localhost:3000/api/posts"
FEED_URL="http://localhost:3000/api/feed"
HASHTAG_URL="http://localhost:3000/api/posts/hashtag"

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
    else
        curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" | jq .
    fi
    echo ""
}

# User-related functions
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

test_get_user_followers() {
    print_header "Testing GET user followers"
    read -p "Enter user ID: " user_id
    read -p "Enter limit (default 10): " limit
    read -p "Enter offset (default 0): " offset
    
    local params="?"
    if [ -n "$limit" ]; then
        params+="limit=$limit&"
    fi
    if [ -n "$offset" ]; then
        params+="offset=$offset"
    fi
    
    make_request "GET" "$USERS_URL/$user_id/followers$params"
}

test_get_user_activity() {
    print_header "Testing GET user activity"
    read -p "Enter user ID: " user_id
    read -p "Enter activity type (post/like/follow): " type
    read -p "Enter from date (YYYY-MM-DD): " fromDate
    read -p "Enter to date (YYYY-MM-DD): " toDate
    
    local params="?"
    if [ -n "$type" ]; then
        params+="type=$type&"
    fi
    if [ -n "$fromDate" ]; then
        params+="fromDate=$fromDate&"
    fi
    if [ -n "$toDate" ]; then
        params+="toDate=$toDate"
    fi
    
    make_request "GET" "$USERS_URL/$user_id/activity$params"
}

# Post-related functions
test_get_all_posts() {
    print_header "Testing GET all posts"
    make_request "GET" "$POSTS_URL"
}

test_get_post() {
    print_header "Testing GET post by ID"
    read -p "Enter post ID: " post_id
    make_request "GET" "$POSTS_URL/$post_id"
}

test_create_post() {
    print_header "Testing POST create post"
    read -p "Enter author ID: " authorId
    read -p "Enter content: " content
    read -p "Enter hashtags (comma-separated): " hashtags
    
    # Convert comma-separated hashtags to JSON array
    IFS=',' read -ra TAGS <<< "$hashtags"
    hashtag_array="["
    for i in "${TAGS[@]}"; do
        if [ "$hashtag_array" != "[" ]; then
            hashtag_array+=","
        fi
        hashtag_array+="\"$i\""
    done
    hashtag_array+="]"
    
    local post_data=$(cat <<EOF
{
    "authorId": $authorId,
    "content": "$content",
    "hashtags": $hashtag_array
}
EOF
)
    make_request "POST" "$POSTS_URL" "$post_data"
}

test_update_post() {
    print_header "Testing PUT update post"
    read -p "Enter post ID: " post_id
    read -p "Enter new content: " content
    
    local post_data=$(cat <<EOF
{
    "content": "$content"
}
EOF
)
    make_request "PUT" "$POSTS_URL/$post_id" "$post_data"
}

test_delete_post() {
    print_header "Testing DELETE post"
    read -p "Enter post ID: " post_id
    make_request "DELETE" "$POSTS_URL/$post_id"
}

test_like_post() {
    print_header "Testing POST like post"
    read -p "Enter post ID: " post_id
    read -p "Enter user ID: " userId
    
    local like_data=$(cat <<EOF
{
    "userId": $userId
}
EOF
)
    make_request "POST" "$POSTS_URL/$post_id/like" "$like_data"
}

# Feed-related functions
test_get_user_feed() {
    print_header "Testing GET user feed"
    read -p "Enter user ID: " userId
    read -p "Enter limit (default 10): " limit
    read -p "Enter offset (default 0): " offset
    
    local params="?userId=$userId"
    if [ -n "$limit" ]; then
        params+="&limit=$limit"
    fi
    if [ -n "$offset" ]; then
        params+="&offset=$offset"
    fi
    
    make_request "GET" "$FEED_URL/user/$userId$params"
}

# Hashtag-related functions
test_get_posts_by_hashtag() {
    print_header "Testing GET posts by hashtag"
    read -p "Enter hashtag: " tag
    read -p "Enter limit (default 10): " limit
    read -p "Enter offset (default 0): " offset
    
    local params="?"
    if [ -n "$limit" ]; then
        params+="limit=$limit&"
    fi
    if [ -n "$offset" ]; then
        params+="offset=$offset"
    fi
    
    make_request "GET" "$HASHTAG_URL/$tag$params"
}

# Submenu functions
show_users_menu() {
    echo -e "\n${GREEN}Users Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create new user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Get user followers"
    echo "7. Get user activity"
    echo "8. Back to main menu"
    echo -n "Enter your choice (1-8): "
}

show_posts_menu() {
    echo -e "\n${GREEN}Posts Menu${NC}"
    echo "1. Get all posts"
    echo "2. Get post by ID"
    echo "3. Create new post"
    echo "4. Update post"
    echo "5. Delete post"
    echo "6. Like post"
    echo "7. Back to main menu"
    echo -n "Enter your choice (1-7): "
}

show_feed_menu() {
    echo -e "\n${GREEN}Feed Menu${NC}"
    echo "1. Get user feed"
    echo "2. Get posts by hashtag"
    echo "3. Back to main menu"
    echo -n "Enter your choice (1-3): "
}

# Main menu
show_main_menu() {
    echo -e "\n${GREEN}API Testing Menu${NC}"
    echo "1. Users"
    echo "2. Posts"
    echo "3. Feed"
    echo "4. Exit"
    echo -n "Enter your choice (1-4): "
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
                    6) test_get_user_followers ;;
                    7) test_get_user_activity ;;
                    8) break ;;
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
                    6) test_like_post ;;
                    7) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        3)
            while true; do
                show_feed_menu
                read feed_choice
                case $feed_choice in
                    1) test_get_user_feed ;;
                    2) test_get_posts_by_hashtag ;;
                    3) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        4) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice. Please try again." ;;
    esac
done 

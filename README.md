## Back-end API of a social website
## Description
This system manages user accounts and facilitates friendship connections between users.

User Accounts:
Users can register and have profiles.Users can see a list of other users

Friendship Management:
Users can send friend requests to other users.Users can see a list of sent and received friend requests.

This project include modules:
 - user 
 - friendship 
 - registration 
 - authentication

Prerequisites:  
  - NodeJs 18 or later
  - Postgresql

## ERD
Entity Relationship Diagram (ERD)
This document describes the relationships between entities.

Entities
UserEntity: Represents a user of the system.
FriendshipEntity: Represents a friendship between two users.


UserEntity:
 - id: Unique identifier (primary key) of the user (UUID).
 - firstName: User's first name.
 - lastName: User's last name.
 - dateOfBirth: User's date of birth.
 - username: User's username.
 - password: User's password (excluded in API responses).
 - sentFriendRequests: List of friendship requests sent by the user (one-to-many relationship).
 - receivedFriendRequests: List of friendship requests received by the user (one-to-many relationship).

FriendshipEntity:
 - id: Unique identifier (primary key) of the friendship (UUID).
 - senderId: User ID of the sender (foreign key referencing UserEntity).
 - sender: Reference to the UserEntity that sent the friend request (many-to-one relationship).
 - receiverId: User ID of the receiver (foreign key referencing UserEntity).
 - receiver: Reference to the UserEntity that received the friend request (many-to-one relationship).
 - accepted: Indicates whether the friend request is accepted (boolean).

Relationships
- One-to-Many: A UserEntity can have many FriendshipEntity objects associated with it through the sentFriendRequests and receivedFriendRequests properties. 
- Many-to-One: A FriendshipEntity belongs to one UserEntity as its sender and another UserEntity as its receiver. 

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Api documentation
You can view project documentation in this url: http://localhost:3000/api-doc

## APP CONFIG
App has these variable environment

NODE_ENV='development'
BASE_URL='http://localhost:3000/'
PORT=3000
APP_NAME='STDEV Social'
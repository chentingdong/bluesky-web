export const typeDefs = `
  type Comment {
    id: Int!,
    body: String!,
    postId: Int,
    authorId: Int,
    archived: Boolean
  }

  type Post {
    id: Int!,
    body: String!,
    authorId: Int,
    numComments: Int!,
    comments: [Comment]
  }

  type User {
    id: Int!,
    email: String!,
    fullName: String!,
    favNums: [Int],
    posts: [Post]
  }

  type Query {
    user(id: Int!): User
  }
`;

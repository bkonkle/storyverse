// WARNING: This file is automatically generated. Do not edit.
import gql from 'graphql-tag'
import * as Urql from 'urql'
export type Maybe<T> = T | null
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: any
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   **/
  Datetime: any
}

/** All input for the create `Profile` mutation. */
export type CreateProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** The `Profile` to be created by this mutation. */
  profile: ProfileInput
}

/** The output of our create `Profile` mutation. */
export type CreateProfilePayload = {
  __typename?: 'CreateProfilePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** The `Profile` that was created by this mutation. */
  profile?: Maybe<Profile>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `User` that is related to this `Profile`. */
  userByUserId?: Maybe<User>
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfilesEdge>
}

/** The output of our create `Profile` mutation. */
export type CreateProfilePayloadProfileEdgeArgs = {
  orderBy?: Maybe<Array<ProfilesOrderBy>>
}

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** The `User` to be created by this mutation. */
  user: UserInput
  profile?: Maybe<ProfileInput>
}

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>
  profile?: Maybe<Profile>
}

/** The output of our create `User` mutation. */
export type CreateUserPayloadUserEdgeArgs = {
  orderBy?: Maybe<Array<UsersOrderBy>>
}

/** All input for the `deleteProfileById` mutation. */
export type DeleteProfileByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  id: Scalars['UUID']
}

/** The output of our delete `Profile` mutation. */
export type DeleteProfilePayload = {
  __typename?: 'DeleteProfilePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** The `Profile` that was deleted by this mutation. */
  profile?: Maybe<Profile>
  deletedProfileId?: Maybe<Scalars['ID']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `User` that is related to this `Profile`. */
  userByUserId?: Maybe<User>
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfilesEdge>
}

/** The output of our delete `Profile` mutation. */
export type DeleteProfilePayloadProfileEdgeArgs = {
  orderBy?: Maybe<Array<ProfilesOrderBy>>
}

/** All input for the `deleteUserById` mutation. */
export type DeleteUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  id: Scalars['UUID']
}

/** All input for the `deleteUserByUsername` mutation. */
export type DeleteUserByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** The User's login id - usually their email address. */
  username: Scalars['String']
}

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>
  deletedUserId?: Maybe<Scalars['ID']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>
}

/** The output of our delete `User` mutation. */
export type DeleteUserPayloadUserEdgeArgs = {
  orderBy?: Maybe<Array<UsersOrderBy>>
}

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation'
  /** Creates a single `Profile`. */
  createProfile?: Maybe<CreateProfilePayload>
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>
  /** Updates a single `Profile` using a unique key and a patch. */
  updateProfileById?: Maybe<UpdateProfilePayload>
  /** Updates a single `User` using a unique key and a patch. */
  updateUserById?: Maybe<UpdateUserPayload>
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByUsername?: Maybe<UpdateUserPayload>
  /** Deletes a single `Profile` using a unique key. */
  deleteProfileById?: Maybe<DeleteProfilePayload>
  /** Deletes a single `User` using a unique key. */
  deleteUserById?: Maybe<DeleteUserPayload>
  /** Deletes a single `User` using a unique key. */
  deleteUserByUsername?: Maybe<DeleteUserPayload>
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProfileArgs = {
  input: CreateProfileInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserArgs = {
  input: CreateUserInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileByIdArgs = {
  input: UpdateProfileByIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByIdArgs = {
  input: UpdateUserByIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByUsernameArgs = {
  input: UpdateUserByUsernameInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProfileByIdArgs = {
  input: DeleteProfileByIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByIdArgs = {
  input: DeleteUserByIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByUsernameArgs = {
  input: DeleteUserByUsernameInput
}

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>
}

export type Profile = {
  __typename?: 'Profile'
  id: Scalars['UUID']
  createdAt: Scalars['Datetime']
  updatedAt: Scalars['Datetime']
  /** A display name */
  displayName?: Maybe<Scalars['String']>
  /** An email address */
  email?: Maybe<Scalars['String']>
  /** A Profile photo */
  picture?: Maybe<Scalars['String']>
  /** The User that created the Profile. */
  userId: Scalars['UUID']
  /** Reads a single `User` that is related to this `Profile`. */
  userByUserId?: Maybe<User>
}

/** A condition to be used against `Profile` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProfileCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['UUID']>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<Scalars['Datetime']>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Scalars['Datetime']>
  /** Checks for equality with the object’s `displayName` field. */
  displayName?: Maybe<Scalars['String']>
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<Scalars['String']>
  /** Checks for equality with the object’s `picture` field. */
  picture?: Maybe<Scalars['String']>
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['UUID']>
}

/** An input for mutations affecting `Profile` */
export type ProfileInput = {
  id?: Maybe<Scalars['UUID']>
  createdAt?: Maybe<Scalars['Datetime']>
  updatedAt?: Maybe<Scalars['Datetime']>
  /** A display name */
  displayName?: Maybe<Scalars['String']>
  /** An email address */
  email?: Maybe<Scalars['String']>
  /** A Profile photo */
  picture?: Maybe<Scalars['String']>
  /** The User that created the Profile. */
  userId: Scalars['UUID']
}

/** Represents an update to a `Profile`. Fields that are set will be updated. */
export type ProfilePatch = {
  id?: Maybe<Scalars['UUID']>
  createdAt?: Maybe<Scalars['Datetime']>
  updatedAt?: Maybe<Scalars['Datetime']>
  /** A display name */
  displayName?: Maybe<Scalars['String']>
  /** An email address */
  email?: Maybe<Scalars['String']>
  /** A Profile photo */
  picture?: Maybe<Scalars['String']>
  /** The User that created the Profile. */
  userId?: Maybe<Scalars['UUID']>
}

/** A connection to a list of `Profile` values. */
export type ProfilesConnection = {
  __typename?: 'ProfilesConnection'
  /** A list of `Profile` objects. */
  nodes: Array<Profile>
  /** A list of edges which contains the `Profile` and cursor to aid in pagination. */
  edges: Array<ProfilesEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Profile` you could get from the connection. */
  totalCount: Scalars['Int']
}

/** A `Profile` edge in the connection. */
export type ProfilesEdge = {
  __typename?: 'ProfilesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>
  /** The `Profile` at the end of the edge. */
  node: Profile
}

/** Methods to use when ordering `Profile`. */
export enum ProfilesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  DisplayNameAsc = 'DISPLAY_NAME_ASC',
  DisplayNameDesc = 'DISPLAY_NAME_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  PictureAsc = 'PICTURE_ASC',
  PictureDesc = 'PICTURE_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query'
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   **/
  query: Query
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>
  /** Reads and enables pagination through a set of `Profile`. */
  allProfiles?: Maybe<ProfilesConnection>
  /** Reads and enables pagination through a set of `User`. */
  allUsers?: Maybe<UsersConnection>
  profileById?: Maybe<Profile>
  userById?: Maybe<User>
  userByUsername?: Maybe<User>
  /** Get a user based on the logged-in JWT claims. */
  getCurrentUser?: Maybe<User>
}

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']
}

/** The root query type which gives access points into the data universe. */
export type QueryAllProfilesArgs = {
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  before?: Maybe<Scalars['Cursor']>
  after?: Maybe<Scalars['Cursor']>
  orderBy?: Maybe<Array<ProfilesOrderBy>>
  condition?: Maybe<ProfileCondition>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllUsersArgs = {
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  before?: Maybe<Scalars['Cursor']>
  after?: Maybe<Scalars['Cursor']>
  orderBy?: Maybe<Array<UsersOrderBy>>
  condition?: Maybe<UserCondition>
}

/** The root query type which gives access points into the data universe. */
export type QueryProfileByIdArgs = {
  id: Scalars['UUID']
}

/** The root query type which gives access points into the data universe. */
export type QueryUserByIdArgs = {
  id: Scalars['UUID']
}

/** The root query type which gives access points into the data universe. */
export type QueryUserByUsernameArgs = {
  username: Scalars['String']
}

/** All input for the `updateProfileById` mutation. */
export type UpdateProfileByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** An object where the defined keys will be set on the `Profile` being updated. */
  profilePatch: ProfilePatch
  id: Scalars['UUID']
}

/** The output of our update `Profile` mutation. */
export type UpdateProfilePayload = {
  __typename?: 'UpdateProfilePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** The `Profile` that was updated by this mutation. */
  profile?: Maybe<Profile>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `User` that is related to this `Profile`. */
  userByUserId?: Maybe<User>
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfilesEdge>
}

/** The output of our update `Profile` mutation. */
export type UpdateProfilePayloadProfileEdgeArgs = {
  orderBy?: Maybe<Array<ProfilesOrderBy>>
}

/** All input for the `updateUserById` mutation. */
export type UpdateUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch
  id: Scalars['UUID']
}

/** All input for the `updateUserByUsername` mutation. */
export type UpdateUserByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch
  /** The User's login id - usually their email address. */
  username: Scalars['String']
}

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   **/
  clientMutationId?: Maybe<Scalars['String']>
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>
}

/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: Maybe<Array<UsersOrderBy>>
}

export type User = {
  __typename?: 'User'
  id: Scalars['UUID']
  createdAt: Scalars['Datetime']
  updatedAt: Scalars['Datetime']
  /** The User's login id - usually their email address. */
  username: Scalars['String']
  /** If false, the User is suspended. */
  isActive?: Maybe<Scalars['Boolean']>
  /** Reads and enables pagination through a set of `Profile`. */
  profilesByUserId: ProfilesConnection
}

export type UserProfilesByUserIdArgs = {
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  before?: Maybe<Scalars['Cursor']>
  after?: Maybe<Scalars['Cursor']>
  orderBy?: Maybe<Array<ProfilesOrderBy>>
  condition?: Maybe<ProfileCondition>
}

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['UUID']>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<Scalars['Datetime']>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Scalars['Datetime']>
  /** Checks for equality with the object’s `username` field. */
  username?: Maybe<Scalars['String']>
  /** Checks for equality with the object’s `isActive` field. */
  isActive?: Maybe<Scalars['Boolean']>
}

/** An input for mutations affecting `User` */
export type UserInput = {
  id?: Maybe<Scalars['UUID']>
  createdAt?: Maybe<Scalars['Datetime']>
  updatedAt?: Maybe<Scalars['Datetime']>
  /** The User's login id - usually their email address. */
  username: Scalars['String']
  /** If false, the User is suspended. */
  isActive?: Maybe<Scalars['Boolean']>
}

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  id?: Maybe<Scalars['UUID']>
  createdAt?: Maybe<Scalars['Datetime']>
  updatedAt?: Maybe<Scalars['Datetime']>
  /** The User's login id - usually their email address. */
  username?: Maybe<Scalars['String']>
  /** If false, the User is suspended. */
  isActive?: Maybe<Scalars['Boolean']>
}

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename?: 'UsersConnection'
  /** A list of `User` objects. */
  nodes: Array<User>
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int']
}

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>
  /** The `User` at the end of the edge. */
  node: User
}

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC',
  IsActiveAsc = 'IS_ACTIVE_ASC',
  IsActiveDesc = 'IS_ACTIVE_DESC',
}

export type CurrentProfileFragment = {__typename?: 'Profile'} & Pick<
  Profile,
  'id' | 'displayName' | 'email' | 'picture'
>

export type CreateProfileMutationVariables = {
  input: CreateProfileInput
}

export type CreateProfileMutation = {__typename?: 'Mutation'} & {
  createProfile: Maybe<
    {__typename?: 'CreateProfilePayload'} & {
      profile: Maybe<{__typename?: 'Profile'} & CurrentProfileFragment>
    }
  >
}

export type CurrentUserFragment = {__typename?: 'User'} & Pick<
  User,
  'id' | 'username' | 'isActive'
> & {
    profilesByUserId: {__typename?: 'ProfilesConnection'} & {
      nodes: Array<{__typename?: 'Profile'} & CurrentProfileFragment>
    }
  }

export type GetCurrentUserQueryVariables = {}

export type GetCurrentUserQuery = {__typename?: 'Query'} & {
  getCurrentUser: Maybe<{__typename?: 'User'} & CurrentUserFragment>
}

export type CreateUserMutationVariables = {
  input: CreateUserInput
}

export type CreateUserMutation = {__typename?: 'Mutation'} & {
  createUser: Maybe<
    {__typename?: 'CreateUserPayload'} & {
      user: Maybe<{__typename?: 'User'} & CurrentUserFragment>
    }
  >
}

export const CurrentProfileFragmentDoc = gql`
  fragment CurrentProfile on Profile {
    id
    displayName
    email
    picture
  }
`
export const CurrentUserFragmentDoc = gql`
  fragment CurrentUser on User {
    id
    username
    isActive
    profilesByUserId(first: 1) {
      nodes {
        ...CurrentProfile
      }
    }
  }
  ${CurrentProfileFragmentDoc}
`
export const CreateProfileDocument = gql`
  mutation createProfile($input: CreateProfileInput!) {
    createProfile(input: $input) {
      profile {
        ...CurrentProfile
      }
    }
  }
  ${CurrentProfileFragmentDoc}
`

export function useCreateProfileMutation() {
  return Urql.useMutation<
    CreateProfileMutation,
    CreateProfileMutationVariables
  >(CreateProfileDocument)
}
export const GetCurrentUserDocument = gql`
  query GetCurrentUser {
    getCurrentUser {
      ...CurrentUser
    }
  }
  ${CurrentUserFragmentDoc}
`

export function useGetCurrentUserQuery(
  options: Omit<Urql.UseQueryArgs<GetCurrentUserQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetCurrentUserQuery>({
    query: GetCurrentUserDocument,
    ...options,
  })
}
export const CreateUserDocument = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        ...CurrentUser
      }
    }
  }
  ${CurrentUserFragmentDoc}
`

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument
  )
}

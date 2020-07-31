import {ObjectType, Field} from '@nestjs/graphql'

@ObjectType()
export class ProfileContent {
  @Field()
  temp?: string
}

export default ProfileContent

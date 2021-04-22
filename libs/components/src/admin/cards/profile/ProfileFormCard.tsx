import TextInput from '../../forms/TextInput'
import TextAreaInput from '../../forms/TextAreaInput'
import Forms from '../../forms/Forms'
import FormCard from '../FormCard'

export const ProfileFormCard = () => {
  return (
    <FormCard title="My Profile">
      <Forms.Header>User Information</Forms.Header>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 px-4">
          <TextInput
            name="username"
            label="Username"
            defaultValue="lucky.jesse"
          />
        </div>
        <div className="w-full lg:w-6/12 px-4">
          <TextInput
            name="email"
            label="Email address"
            defaultValue="jesse@example.com"
          />
        </div>
        <div className="w-full lg:w-6/12 px-4">
          <TextInput name="firstName" label="First Name" defaultValue="Lucky" />
        </div>
        <div className="w-full lg:w-6/12 px-4">
          <TextInput name="lastName" label="Last Name" defaultValue="Jesse" />
        </div>
      </div>

      <Forms.Separator />

      <Forms.Header>Contact Information</Forms.Header>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          <TextInput
            name="address"
            label="Address"
            defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
          />
        </div>
        <div className="w-full lg:w-4/12 px-4">
          <TextInput name="city" label="City" defaultValue="New York" />
        </div>
        <div className="w-full lg:w-4/12 px-4">
          <TextInput
            name="country"
            label="Country"
            defaultValue="United States"
          />
        </div>
        <div className="w-full lg:w-4/12 px-4">
          <TextInput
            name="postalCode"
            label="Postal Code"
            defaultValue="Postal Code"
          />
        </div>
      </div>

      <Forms.Separator />

      <Forms.Header>About Me</Forms.Header>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          <TextAreaInput
            name="about"
            label="About me"
            defaultValue="A beautiful UI Kit and Admin for NextJS & Tailwind CSS. It is Free
                    and Open Source."
          />
        </div>
      </div>
    </FormCard>
  )
}

export default ProfileFormCard

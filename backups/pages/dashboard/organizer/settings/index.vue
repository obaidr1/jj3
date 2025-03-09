<script setup lang="ts">
import OrganizerSubNav from '~/components/organizer/OrganizerSubNav.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const auth = useAuth()

const form = ref({
  organizationName: '',
  email: auth.user?.email || '',
  notificationPreferences: {
    email: true,
    push: false
  }
})
</script>

<template>
  <div>
    <OrganizerSubNav />
    
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold">Settings</h1>
        <p class="text-gray-500 mt-2">Manage your organizer account settings</p>
      </div>

      <!-- Settings Form -->
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Update your organization information and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-6">
            <div class="space-y-2">
              <Label for="organizationName">Organization Name</Label>
              <Input id="organizationName" v-model="form.organizationName" />
            </div>
            
            <div class="space-y-2">
              <Label for="email">Contact Email</Label>
              <Input id="email" type="email" v-model="form.email" />
            </div>

            <div class="space-y-2">
              <h3 class="text-lg font-medium">Notification Preferences</h3>
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <Switch v-model="form.notificationPreferences.email" id="email-notifications" />
                  <Label for="email-notifications">Email Notifications</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <Switch v-model="form.notificationPreferences.push" id="push-notifications" />
                  <Label for="push-notifications">Push Notifications</Label>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template> 
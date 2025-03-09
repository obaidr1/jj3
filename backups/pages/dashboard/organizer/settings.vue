<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'organizer']
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

const isSaving = ref(false)

async function handleSave() {
  try {
    isSaving.value = true
    // TODO: Implement settings update
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
    const { $toast } = useNuxtApp()
    $toast.success('Settings saved successfully')
  } catch (error) {
    const { $toast } = useNuxtApp()
    $toast.error('Failed to save settings')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Settings</h1>
        <p class="text-muted-foreground">Manage your organizer account settings</p>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>Update your organization information and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSave" class="space-y-6">
          <div class="space-y-2">
            <Label for="organizationName">Organization Name</Label>
            <Input id="organizationName" v-model="form.organizationName" />
          </div>
          
          <div class="space-y-2">
            <Label for="email">Contact Email</Label>
            <Input id="email" type="email" v-model="form.email" />
          </div>

          <div class="space-y-3">
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

          <Button type="submit" :disabled="isSaving">
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Changes</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template> 
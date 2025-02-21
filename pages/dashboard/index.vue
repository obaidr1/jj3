<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const auth = useAuth()

// Redirect to role-specific dashboard
onMounted(() => {
  switch (auth.user?.role) {
    case UserRole.DANCER:
      navigateTo('/dashboard/dancer')
      break
    case UserRole.ORGANIZER:
      navigateTo('/dashboard/organizer')
      break
    case UserRole.JUDGE:
      navigateTo('/dashboard/judge')
      break
    case UserRole.ADMIN:
      navigateTo('/dashboard/admin')
      break
  }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Welcome, {{ auth.user?.name }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Different cards based on user role -->
      <template v-if="auth.isOrganizer">
        <Card>
          <CardHeader>
            <CardTitle>Your Competitions</CardTitle>
          </CardHeader>
          <CardContent>
            <!-- Competition stats -->
          </CardContent>
        </Card>
      </template>

      <template v-if="auth.isDancer">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <!-- Upcoming competitions -->
          </CardContent>
        </Card>
      </template>

      <template v-if="auth.isJudge">
        <Card>
          <CardHeader>
            <CardTitle>Judging Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <!-- Judging assignments -->
          </CardContent>
        </Card>
      </template>
    </div>
  </div>
</template> 
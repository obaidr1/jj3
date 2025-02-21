<script setup lang="ts">
const auth = useAuth()

const navigation = computed(() => {
  const items = [
    { name: 'Overview', href: '/dashboard', icon: 'i-heroicons-home' }
  ]

  if (auth.isOrganizer) {
    items.push(
      { name: 'Competitions', href: '/dashboard/competitions', icon: 'i-heroicons-trophy' },
      { name: 'Judges', href: '/dashboard/judges', icon: 'i-heroicons-users' }
    )
  }

  if (auth.isJudge) {
    items.push(
      { name: 'Scoring', href: '/dashboard/scoring', icon: 'i-heroicons-star' }
    )
  }

  if (auth.isDancer) {
    items.push(
      { name: 'My Competitions', href: '/dashboard/my-competitions', icon: 'i-heroicons-calendar' },
      { name: 'Results', href: '/dashboard/results', icon: 'i-heroicons-chart-bar' }
    )
  }

  return items
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <nav class="border-b">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex flex-shrink-0 items-center">
              <h1 class="text-xl font-bold">J&J Competition</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                :class="$route.path === item.href ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'"
              >
                <div :class="item.icon" class="w-5 h-5 mr-2" />
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost">
                  {{ auth.user?.name }}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="auth.logout">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>

    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template> 
<script setup lang="ts">
const isOpen = ref(false)

const menuItems = [
  { name: 'Dashboard', href: '/dashboard/organizer' },
  { name: 'Competitions', href: '/dashboard/organizer/competitions' },
  { name: 'Settings', href: '/dashboard/organizer/settings' }
]
</script>

<template>
  <div>
    <!-- Trigger Button -->
    <Button variant="ghost" size="icon" @click="isOpen = !isOpen">
      <Icon name="heroicons:bars-3" class="h-6 w-6" />
    </Button>

    <!-- Sheet from shadcn -->
    <Sheet :open="isOpen" @update:open="isOpen = $event">
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav class="mt-4 space-y-2">
          <NuxtLink 
            v-for="item in menuItems" 
            :key="item.name"
            :to="item.href"
            class="block p-2 hover:bg-muted rounded-lg"
            @click="isOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>
      </SheetContent>
    </Sheet>
  </div>
</template> 
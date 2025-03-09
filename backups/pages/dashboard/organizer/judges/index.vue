<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next'
import OrganizerSubNav from '~/components/organizer/OrganizerSubNav.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const judges = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', competitions: 5, status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', competitions: 3, status: 'Active' },
])
</script>

<template>
  <div>
    <OrganizerSubNav />
    
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">Judges Management</h1>
          <p class="text-gray-500 mt-2">Manage your competition judges</p>
        </div>
        <Button>
          <PlusIcon class="w-5 h-5 mr-2" />
          Add Judge
        </Button>
      </div>

      <!-- Judges List -->
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Competitions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="judge in judges" :key="judge.id">
              <TableCell>{{ judge.name }}</TableCell>
              <TableCell>{{ judge.email }}</TableCell>
              <TableCell>{{ judge.competitions }}</TableCell>
              <TableCell>
                <Badge :variant="judge.status === 'Active' ? 'default' : 'secondary'">
                  {{ judge.status }}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  </div>
</template> 
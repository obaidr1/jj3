<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'organizer']
})

const competitions = useCompetitions()

onMounted(() => {
  if (competitions.competitions.length === 0) {
    competitions.initializeFromStorage()
  }
})

const dancers = ref([
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    registeredCompetitions: ['Salsa Championship 2024', 'Bachata Masters'],
    role: 'Leader'
  },
  {
    id: '2',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    registeredCompetitions: ['Bachata Masters'],
    role: 'Follower'
  }
])

const searchQuery = ref('')
const selectedRole = ref('all')

const filteredDancers = computed(() => {
  return dancers.value.filter(dancer => {
    const matchesSearch = dancer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         dancer.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = selectedRole.value === 'all' || dancer.role.toLowerCase() === selectedRole.value
    return matchesSearch && matchesRole
  })
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Dancers</h1>
        <p class="text-muted-foreground">Manage registered dancers</p>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Registered Dancers</CardTitle>
        <CardDescription>View and manage dancer registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <Input 
                v-model="searchQuery"
                placeholder="Search dancers..."
                type="search"
              />
            </div>
            <Select v-model="selectedRole">
              <option value="all">All Roles</option>
              <option value="leader">Leaders</option>
              <option value="follower">Followers</option>
            </Select>
          </div>

          <div class="space-y-4">
            <div v-for="dancer in filteredDancers" :key="dancer.id" class="p-4 border rounded-lg">
              <div class="flex justify-between items-start">
                <div class="space-y-1">
                  <h3 class="font-medium">{{ dancer.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ dancer.email }}</p>
                  <Badge>{{ dancer.role }}</Badge>
                </div>
                <div class="text-right">
                  <p class="text-sm text-muted-foreground">Registered in</p>
                  <p class="font-medium">{{ dancer.registeredCompetitions.length }} competitions</p>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-sm text-muted-foreground">Competitions:</p>
                <div class="flex gap-2 mt-2 flex-wrap">
                  <Badge 
                    v-for="competition in dancer.registeredCompetitions" 
                    :key="competition"
                    variant="secondary"
                  >
                    {{ competition }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 
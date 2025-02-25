<script setup>
const props = defineProps({
  competitions: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card v-for="comp in competitions" :key="comp.id">
      <AspectImage :src="comp.banner" :alt="comp.name" />
      <CardHeader>
        <CardTitle>{{ comp.name }}</CardTitle>
        <CardDescription>{{ new Date(comp.date).toLocaleDateString() }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-2 text-sm text-muted-foreground">
          <p>Location: {{ comp.location }}</p>
          <p>Dance Style: {{ comp.danceStyle }}</p>
          <p>Status: {{ comp.status }}</p>
          <p>Max Dancers: {{ comp.maxDancers === 0 ? 'Unlimited' : comp.maxDancers }}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" class="w-full" @click="navigateTo(`/competitions/${comp.id}/manage`)">
          Manage
        </Button>
      </CardFooter>
    </Card>
  </div>
</template> 
<template>
  <footer class="bg-white border-t">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
        <div class="flex space-x-6 md:order-2">
          <a href="https://github.com/razbakov/design-starter-kit" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">GitHub</span>
            <Icon name="ph:github-logo" class="h-6 w-6" />
          </a>
        </div>
        <p class="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
          &copy; {{ new Date().getFullYear() }} Design Starter Kit. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template> 
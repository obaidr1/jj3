export const designConfig = {
  foundation: {
    label: 'Foundation',
    description: 'Core design tokens and primitives',
    items: [
      {
        to: '/design/colors',
        label: 'Colors',
        description: 'Color system and semantic tokens',
      },
      {
        to: '/design/typography',
        label: 'Typography',
        description: 'Font families, sizes, and weights',
      },
    ],
  },
  components: {
    label: 'Components',
    description: 'Building blocks of the interface',
    sections: {
      ui: {
        label: 'UI Components',
        items: [
          {
            to: '/design/components/button',
            label: 'Button',
            description: 'Actions and links',
          },
          {
            to: '/design/components/input',
            label: 'Input',
            description: 'Form controls and fields',
          },
          {
            to: '/design/components/dialog',
            label: 'Dialog',
            description: 'Modal windows and overlays',
          },
        ],
      },
      domain: {
        label: 'Domain Components',
        items: [
          {
            to: '/design/components/teaser',
            label: 'Teaser',
            description: 'Preview of content with an image, title, and text',
          },
        ],
      },
    },
  },
  patterns: {
    label: 'Patterns',
    description: 'Common UI patterns and solutions',
    items: [
      {
        to: '/design/patterns/forms',
        label: 'Forms',
        description: 'Form layouts and validation',
      },
      {
        to: '/design/patterns/navigation',
        label: 'Navigation',
        description: 'Navigation patterns and menus',
      },
      {
        to: '/design/patterns/loading',
        label: 'Loading States',
        description: 'Loading and error states',
      },
    ],
  },
}

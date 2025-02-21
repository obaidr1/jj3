export async function compressImage(base64String: string, maxSizeKB = 100): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = base64String

    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      // Calculate new dimensions while maintaining aspect ratio
      const maxDimension = 800
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension
          width = maxDimension
        } else {
          width = (width / height) * maxDimension
          height = maxDimension
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)

      // Compress
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
      resolve(compressedBase64)
    }
  })
} 
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-17'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skzvzrr8K7hXJinWFa2rKwvpYSLXGNNud9XJ6syKiI4R3bikOvigPCaGieYYnZ4th8AmYhxRiZ1Mu7ArsUf5TFYtQ3GHzmXVD1REKGQxuu69xHDpaZML5Xe0OUPJOTknI6dtrTnAMTrA6aSPQnWpnxUgO6zsqiAoLRQxIHP1iiRSm6yc1E8o",
  'Missing environment variable: SANITY_API_TOKEN'
)


function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}

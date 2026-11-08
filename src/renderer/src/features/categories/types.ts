export type Category = {
  id: string
  name: string
}

// Where things go when they have no category (for example an invoice line that sits under no heading).
export const OTHERS_CATEGORY = 'Others'

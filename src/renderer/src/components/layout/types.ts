export type LogoGradient = {
  id: string
  matrix: string
  stops: { offset: number; token: string }[]
}

export type LogoShape = {
  d: string
  gradient?: string
  token?: string
  move?: string
  multiply?: boolean
}

export type LogoProps = {
  className?: string
}

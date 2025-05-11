export type UnitType = "גרם" | "כוסות" | "כפיות" | "חבילות" | "יחידות" | "כפות" | "ml"
export type DifficultyType = "קל" | "בינוני" | "מתקדם" | "מורכב"

export type Product = {
  Name: string
  Count: number
  Type: UnitType
}

export type Instruc = {
  Id: string
  Name: string
}

export type CategoryModel = {
  Id: number
  Name: string
}

export type Recipe = {
  Id: number
  Name: string
  Img: string
  Duration: number
  Difficulty: number
  Description: string
  UserId: number
  Categoryid: CategoryModel
  Ingridents: Product[]
  Instructions: Instruc[]
}
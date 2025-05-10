
export type UnitType = "גרם" | "כוסות" | "כפיות" | "חבילות" | "יחידות" | "כפות";
export type DifficultyType = "קל" | "בינוני" | "מתקדם" | "מורכב";

export type Product = {
    Name: string;
    Count: number;
    Type: UnitType;
};

export type Instruc = {
    Id: string;
    Name: string;
};

export type CategoryModel = {
    Id: number,
    Name: string
}

export class Recipe {
    static counter: number = 2;
    Id: number;
    Name: string;
    Img: string;
    Duration: number;
    Difficulty: DifficultyType;
    Description: string;
    UserId: number;
    Categoryid: CategoryModel;
    Ingridents: Product[];
    Instructions: Instruc[];

    constructor(
        Name: string,
        Img: string,
        Duration: number,
        Difficulty: DifficultyType,
        Description: string,
        UserId: number,
        Categoryid: CategoryModel,
        Ingridents: Product[],
        Instructions: Instruc[]
    ) {
        this.Id = ++Recipe.counter;
        this.Name = Name;
        this.Img = Img;
        this.Duration = Duration;
        this.Difficulty = Difficulty;
        this.Description = Description;
        this.UserId = UserId;
        this.Categoryid = Categoryid;
        this.Ingridents = Ingridents;
        this.Instructions = Instructions;
    }
}
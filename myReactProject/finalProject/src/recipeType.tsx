import { createContext, ReactNode, useContext, useState } from "react";
import { Recipe } from "./models";

type RecipeContextType = {
    recipe: Recipe | null;
    setRecipe: (recipe: Recipe) => void;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    return (
        <RecipeContext.Provider value={{ recipe, setRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipe = () => {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error("useRecipe must be used within a RecipeProvider");
    }
    return context;
};

export { Recipe };

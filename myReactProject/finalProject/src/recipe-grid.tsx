import { Grid, Card, CardContent, CardMedia, Typography, Box, Skeleton } from "@mui/material"
import type { Recipe } from "./models"
import React from "react"

interface RecipeGridProps {
  recipes: Recipe[]
  onRecipeClick: (recipe: Recipe) => void
  onImageLoad: (recipeId: number) => void
  imageLoaded: { [key: number]: boolean }
}

const RecipeGrid = ({ recipes, onRecipeClick, onImageLoad, imageLoaded }: RecipeGridProps) => {
  return (
    <Grid container spacing={3}>
      {recipes.length === 0 ? (
        <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            לא נמצאו מתכונים
          </Typography>
        </Box>
      ) : (
        recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.Id}>
            <Card
              onClick={() => onRecipeClick(recipe)}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              <Box sx={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}>
                {!imageLoaded[recipe.Id] && (
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                    }}
                  />
                )}
                <CardMedia
                  component="img"
                  image={recipe.Img || "/placeholder.svg?height=200&width=300"}
                  alt={recipe.Name}
                  onLoad={() => onImageLoad(recipe.Id)}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                    onImageLoad(recipe.Id)
                  }}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: imageLoaded[recipe.Id] ? "block" : "none",
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {recipe.Name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {recipe.Categoryid?.Name || "ללא קטגוריה"}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.Duration} דקות
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.Difficulty}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  )
}

export default RecipeGrid

import { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material"
import { ArrowBack, AccessTime, Edit, Delete, Check } from "@mui/icons-material"
import type { Recipe } from "./models"
import { AddRecipeForm } from "./addRecipeForm"
import React from "react"
import axios from "axios"

interface RecipeDetailProps {
  recipe: Recipe
  onBack: () => void
  onRecipeUpdated?: () => void
  onRecipeDeleted?: () => void
  onImageLoad?: (recipeId: number) => void
  imageLoaded?: { [key: number]: boolean }
  userId: string 
}

export const RecipeDetail = ({
  recipe,
  onBack,
  onRecipeUpdated,
  onRecipeDeleted,
  onImageLoad,
  imageLoaded = {},
  userId,
}: RecipeDetailProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)

      const response = await axios.post(`http://localhost:8080/api/recipe/delete/${recipe.Id}`)

      if (response.status !== 200 && response.status !== 204) {
        throw new Error("Failed to delete recipe")
      }

      if (onRecipeDeleted) {
        onRecipeDeleted()
      }
    } catch (error) {
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }


  const handleRecipeUpdated = () => {
    setIsEditing(false)
    if (onRecipeUpdated) {
      onRecipeUpdated()
    }
  }

  if (isEditing) {
    return (
      <AddRecipeForm
        editMode={true}
        recipeToEdit={recipe}
        onRecipeUpdated={handleRecipeUpdated}
        onRecipeDeleted={onRecipeDeleted}
      />
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h1">
          {recipe.Name}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        {recipe.UserId === Number(userId) && (
          <>
            <Button variant="outlined" startIcon={<Edit />} onClick={handleEditClick} sx={{ mr: 2 }}>
              ערוך
            </Button>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDeleteClick}>
              מחק
            </Button>
          </>
        )}

      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <Box sx={{ position: "relative", paddingTop: "75%", overflow: "hidden" }}>
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
                image={recipe.Img || "/placeholder.svg?height=400&width=600"}
                alt={recipe.Name}
                onLoad={() => onImageLoad && onImageLoad(recipe.Id)}
                onError={(e) => {
                  ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=600"
                  onImageLoad && onImageLoad(recipe.Id)
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
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccessTime sx={{ color: "#BFAF9B", mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  זמן הכנה: {recipe.Duration} דקות
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Chip
                  label={recipe.Difficulty}
                  size="small"
                  sx={{
                    backgroundColor: "#F8C8DC",
                    color: "#4E342E",
                  }}
                />
              </Box>
              <Chip
                label={recipe.Categoryid?.Name || "ללא קטגוריה"}
                size="small"
                sx={{
                  backgroundColor: "#C3B1E1",
                  color: "#FFFFFF",
                }}
              />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {recipe.Description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              מרכיבים
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {recipe.Ingridents?.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Check sx={{ color: "#C3B1E1" }} />
                  </ListItemIcon>
                  <ListItemText primary={`${ingredient.Name} - ${ingredient.Count} ${ingredient.Type}`} />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              הוראות הכנה
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recipe.Instructions?.map((instruction, index) => (
                <ListItem key={instruction.Id} alignItems="flex-start" sx={{ py: 1 }}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: "#C3B1E1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={instruction.Name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>מחיקת מתכון</DialogTitle>
        <DialogContent>
          <DialogContentText>
            האם אתה בטוח שברצונך למחוק את המתכון "{recipe.Name}"? פעולה זו אינה ניתנת לביטול.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
            ביטול
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : <Delete />}
          >
            {isDeleting ? "מוחק..." : "מחק"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// "use client"

// import React from "react"

// import { useState, useEffect } from "react"
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   IconButton,
//   Paper,
//   Grid,
//   Divider,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormHelperText,
//   Card,
//   CardContent,
// } from "@mui/material"
// import { Add, Delete, ArrowBack, Save, Edit } from "@mui/icons-material"
// import axios from "axios"
// import type { Recipe, CategoryModel, Ingridents, DifficultyType } from "./models"

// interface AddRecipeFormProps {
//   recipeToEdit?: Recipe | null
//   onRecipeAdded: () => void
//   onRecipeUpdated: () => void
//   onRecipeDeleted: () => void
//   onCancel: () => void
//   categories: CategoryModel[]
// }

// export const AddRecipeForm = ({
//   recipeToEdit,
//   onRecipeAdded,
//   onRecipeUpdated,
//   onRecipeDeleted,
//   onCancel,
//   categories,
// }: AddRecipeFormProps) => {
//   const isEditMode = !!recipeToEdit
//   const [loading, setLoading] = useState(false)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const difficultyTypes: DifficultyType[] = ["קל", "בינוני", "מתקדם", "מורכב"]

//   const [recipe, setRecipe] = useState<Recipe>({
//     Id: 0,
//     Name: "",
//     Instructions: [""],
//     Difficulty: "קל",
//     Duration: 0,
//     Description: "",
//     UserId: 1,
//     CategoryId: 0,
//     Img: "",
//     Ingrident: [{ Name: "", Count: 0, Type: "" }],
//   })

//   useEffect(() => {
//     // Get current user from storage
//     try {
//       const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
//       if (userStr) {
//         const user = JSON.parse(userStr)
//         setRecipe((prev) => ({ ...prev, UserId: user.id || 1 }))
//       }
//     } catch (error) {
//     }
//   }, [])

//   useEffect(() => {
//     if (recipeToEdit) {
//       // Initialize form with recipe to edit
//       setRecipe({
//         ...recipeToEdit,
//         // Ensure Instructions is an array
//         Instructions: Array.isArray(recipeToEdit.Instructions)
//           ? recipeToEdit.Instructions
//           : [recipeToEdit.Instructions].filter(Boolean),
//         // Ensure Ingrident is an array with at least one item
//         Ingrident:
//           Array.isArray(recipeToEdit.Ingrident) && recipeToEdit.Ingrident.length > 0
//             ? recipeToEdit.Ingrident
//             : [{ Name: "", Count: 0, Type: "" }],
//       })
//     }
//   }, [recipeToEdit])

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {}

//     if (!recipe.Name.trim()) {
//       newErrors.name = "שם המתכון הוא שדה חובה"
//     }

//     if (!recipe.Description.trim()) {
//       newErrors.description = "תיאור המתכון הוא שדה חובה"
//     }

//     if (recipe.Duration <= 0) {
//       newErrors.duration = "זמן הכנה חייב להיות גדול מ-0"
//     }

//     if (recipe.CategoryId <= 0) {
//       newErrors.category = "יש לבחור קטגוריה"
//     }

//     if (!recipe.Img.trim()) {
//       newErrors.img = "קישור לתמונה הוא שדה חובה"
//     }

//     // Check if at least one instruction exists and is not empty
//     if (!recipe.Instructions.some((instruction) => instruction.trim() !== "")) {
//       newErrors.instructions = "יש להזין לפחות הוראה אחת"
//     }

//     // Check if at least one ingredient exists and has a name
//     if (!recipe.Ingrident.some((ingredient) => ingredient.Name.trim() !== "")) {
//       newErrors.ingredients = "יש להזין לפחות מרכיב אחד"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     setLoading(true)

//     try {
//       if (isEditMode) {
//         // Update existing recipe
//         const response = await axios.post("http://localhost:8080/api/recipe/edit", recipe)

//         if (response.status !== 200) {
//           throw new Error("Failed to update recipe")
//         }

//         onRecipeUpdated()
//       } else {
//         // Add new recipe
//         const response = await axios.post("http://localhost:8080/api/recipe", recipe)

//         if (response.status !== 200) {
//           throw new Error("Failed to add recipe")
//         }

//         onRecipeAdded()
//       }
//     } catch (error) {
//       setErrors({ submit: "אירעה שגיאה בשמירת המתכון. אנא נסה שוב." })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDeleteRecipe = async () => {
//     if (!recipeToEdit || !recipeToEdit.Id) return

//     setLoading(true)

//     try {
//       const response = await axios.post(`http://localhost:8080/api/recipe/delete/${recipeToEdit.Id}`)

//       if (response.status !== 200) {
//         throw new Error("Failed to delete recipe")
//       }

//       setDeleteDialogOpen(false)
//       onRecipeDeleted()
//     } catch (error) {
//       setErrors({ submit: "אירעה שגיאה במחיקת המתכון. אנא נסה שוב." })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddInstruction = () => {
//     setRecipe({
//       ...recipe,
//       Instructions: [...recipe.Instructions, ""],
//     })
//   }

//   const handleInstructionChange = (index: number, value: string) => {
//     const updatedInstructions = [...recipe.Instructions]
//     updatedInstructions[index] = value
//     setRecipe({
//       ...recipe,
//       Instructions: updatedInstructions,
//     })
//   }

//   const handleRemoveInstruction = (index: number) => {
//     if (recipe.Instructions.length <= 1) return

//     const updatedInstructions = recipe.Instructions.filter((_, i) => i !== index)
//     setRecipe({
//       ...recipe,
//       Instructions: updatedInstructions,
//     })
//   }

//   const handleAddIngredient = () => {
//     setRecipe({
//       ...recipe,
//       Ingrident: [...recipe.Ingrident, { Name: "", Count: 0, Type: "" }],
//     })
//   }

//   const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
//     const updatedIngredients = [...recipe.Ingrident]
//     updatedIngredients[index] = {
//       ...updatedIngredients[index],
//       [field]: field === "Count" ? Number(value) : value,
//     }
//     setRecipe({
//       ...recipe,
//       Ingrident: updatedIngredients,
//     })
//   }

//   const handleRemoveIngredient = (index: number) => {
//     if (recipe.Ingrident.length <= 1) return

//     const updatedIngredients = recipe.Ingrident.filter((_, i) => i !== index)
//     setRecipe({
//       ...recipe,
//       Ingrident: updatedIngredients,
//     })
//   }

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: "800px", mx: "auto", mb: 6 }}>
//       <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
//           <Typography variant="h5" component="h2" sx={{ display: "flex", alignItems: "center" }}>
//             {isEditMode ? <Edit sx={{ mr: 1 }} /> : <Add sx={{ mr: 1 }} />}
//             {isEditMode ? "עריכת מתכון" : "הוספת מתכון חדש"}
//           </Typography>
//           <Button
//             startIcon={<ArrowBack />}
//             onClick={onCancel}
//             sx={{
//               color: "#4E342E",
//               "&:hover": {
//                 backgroundColor: "rgba(195, 177, 225, 0.1)",
//               },
//             }}
//           >
//             חזרה
//           </Button>
//         </Box>

//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="שם המתכון"
//               value={recipe.Name}
//               onChange={(e) => setRecipe({ ...recipe, Name: e.target.value })}
//               error={!!errors.name}
//               helperText={errors.name}
//               required
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#BFAF9B" },
//                   "&:hover fieldset": { borderColor: "#C3B1E1" },
//                   "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
//                 },
//               }}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="תיאור קצר"
//               value={recipe.Description}
//               onChange={(e) => setRecipe({ ...recipe, Description: e.target.value })}
//               multiline
//               rows={2}
//               error={!!errors.description}
//               helperText={errors.description}
//               required
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#BFAF9B" },
//                   "&:hover fieldset": { borderColor: "#C3B1E1" },
//                   "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
//                 },
//               }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth error={!!errors.category} required>
//               <InputLabel>קטגוריה</InputLabel>
//               <Select
//                 value={recipe.CategoryId || ""}
//                 onChange={(e) => setRecipe({ ...recipe, CategoryId: Number(e.target.value) })}
//                 label="קטגוריה"
//                 sx={{
//                   "& .MuiOutlinedInput-notchedOutline": { borderColor: "#BFAF9B" },
//                   "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
//                   "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
//                 }}
//               >
//                 <MenuItem value="">
//                   <em>בחר קטגוריה</em>
//                 </MenuItem>
//                 {categories.map((category) => (
//                   <MenuItem key={category.Id} value={category.Id}>
//                     {category.Name}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth required>
//               <InputLabel>רמת קושי</InputLabel>
//               <Select
//                 value={recipe.Difficulty}
//                 onChange={(e) => setRecipe({ ...recipe, Difficulty: e.target.value as DifficultyType })}
//                 label="רמת קושי"
//                 sx={{
//                   "& .MuiOutlinedInput-notchedOutline": { borderColor: "#BFAF9B" },
//                   "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
//                   "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
//                 }}
//               >
//                 {difficultyTypes.map((difficulty) => (
//                   <MenuItem key={difficulty} value={difficulty}>
//                     {difficulty}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="זמן הכנה (דקות)"
//               type="number"
//               value={recipe.Duration || ""}
//               onChange={(e) => setRecipe({ ...recipe, Duration: Number(e.target.value) })}
//               error={!!errors.duration}
//               helperText={errors.duration}
//               required
//               InputProps={{ inputProps: { min: 1 } }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#BFAF9B" },
//                   "&:hover fieldset": { borderColor: "#C3B1E1" },
//                   "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
//                 },
//               }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="קישור לתמונה"
//               value={recipe.Img}
//               onChange={(e) => setRecipe({ ...recipe, Img: e.target.value })}
//               error={!!errors.img}
//               helperText={errors.img}
//               required
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#BFAF9B" },
//                   "&:hover fieldset": { borderColor: "#C3B1E1" },
//                   "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
//                 },
//               }}
//             />
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 4, borderColor: "#BFAF9B" }} />

//         <Box sx={{ mb: 4 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography variant="h6">מרכיבים</Typography>
//             <Button
//               startIcon={<Add />}
//               onClick={handleAddIngredient}
//               sx={{
//                 color: "#4E342E",
//                 "&:hover": {
//                   backgroundColor: "rgba(195, 177, 225, 0.1)",
//                 },
//               }}
//             >
//               הוסף מרכיב
//             </Button>
//           </Box>

//           {errors.ingredients && (
//             <FormHelperText error sx={{ mb: 2 }}>
//               {errors.ingredients}
//             </FormHelperText>
//           )}

//           {recipe.Ingrident.map((ingredient, index) => (
//             <Card key={index} sx={{ mb: 2, borderColor: "#BFAF9B" }}>
//               <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//                 <Grid container spacing={2} alignItems="center">
//                   <Grid item xs={12} sm={5}>
//                     <TextField
//                       fullWidth
//                       label="שם המרכיב"
//                       value={ingredient.Name}
//                       onChange={(e) => handleIngredientChange(index, "Name", e.target.value)}
//                       size="small"
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": { borderColor: "#BFAF9B" },
//                           "&:hover fieldset": { borderColor: "#C3B1E1" },
//                           "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={6} sm={3}>
//                     <TextField
//                       fullWidth
//                       label="כמות"
//                       type="number"
//                       value={ingredient.Count || ""}
//                       onChange={(e) => handleIngredientChange(index, "Count", e.target.value)}
//                       size="small"
//                       InputProps={{ inputProps: { min: 0 } }}
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": { borderColor: "#BFAF9B" },
//                           "&:hover fieldset": { borderColor: "#C3B1E1" },
//                           "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={6} sm={3}>
//                     <TextField
//                       fullWidth
//                       label="סוג (כפות, כוסות, גרם)"
//                       value={ingredient.Type}
//                       onChange={(e) => handleIngredientChange(index, "Type", e.target.value)}
//                       size="small"
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": { borderColor: "#BFAF9B" },
//                           "&:hover fieldset": { borderColor: "#C3B1E1" },
//                           "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={1} sx={{ display: "flex", justifyContent: "center" }}>
//                     <IconButton
//                       onClick={() => handleRemoveIngredient(index)}
//                       disabled={recipe.Ingridents.length <= 1}
//                       size="small"
//                       sx={{ color: "#F8C8DC" }}
//                     >
//                       <Delete />
//                     </IconButton>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>

//         <Divider sx={{ my: 4, borderColor: "#BFAF9B" }} />

//         <Box>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography variant="h6">הוראות הכנה</Typography>
//             <Button
//               startIcon={<Add />}
//               onClick={handleAddInstruction}
//               sx={{
//                 color: "#4E342E",
//                 "&:hover": {
//                   backgroundColor: "rgba(195, 177, 225, 0.1)",
//                 },
//               }}
//             >
//               הוסף הוראה
//             </Button>
//           </Box>

//           {errors.instructions && (
//             <FormHelperText error sx={{ mb: 2 }}>
//               {errors.instructions}
//             </FormHelperText>
//           )}

//           {recipe.Instructions.map((instruction, index) => (
//             <Box key={index} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
//               <Typography variant="body1" sx={{ mt: 1, ml: 2, minWidth: "24px" }}>
//                 {index + 1}.
//               </Typography>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={2}
//                 value={instruction}
//                 onChange={(e) => handleInstructionChange(index, e.target.value)}
//                 placeholder={`הוראה ${index + 1}`}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": { borderColor: "#BFAF9B" },
//                     "&:hover fieldset": { borderColor: "#C3B1E1" },
//                     "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
//                   },
//                 }}
//               />
//               <IconButton
//                 onClick={() => handleRemoveInstruction(index)}
//                 disabled={recipe.Instructions.length <= 1}
//                 sx={{ color: "#F8C8DC", ml: 1, mt: 1 }}
//               >
//                 <Delete />
//               </IconButton>
//             </Box>
//           ))}
//         </Box>

//         {errors.submit && (
//           <Typography color="error" sx={{ mt: 2 }}>
//             {errors.submit}
//           </Typography>
//         )}

//         <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
//           <Box>
//             {isEditMode && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<Delete />}
//                 onClick={() => setDeleteDialogOpen(true)}
//                 sx={{
//                   borderColor: "#F8C8DC",
//                   color: "#e57373",
//                   "&:hover": {
//                     borderColor: "#e57373",
//                     backgroundColor: "rgba(229, 115, 115, 0.1)",
//                   },
//                 }}
//               >
//                 מחק מתכון
//               </Button>
//             )}
//           </Box>
//           <Box sx={{ display: "flex", gap: 2 }}>
//             <Button
//               variant="outlined"
//               onClick={onCancel}
//               disabled={loading}
//               sx={{
//                 borderColor: "#F8C8DC",
//                 color: "#4E342E",
//                 "&:hover": {
//                   borderColor: "#C3B1E1",
//                   backgroundColor: "rgba(195, 177, 225, 0.1)",
//                 },
//               }}
//             >
//               ביטול
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               startIcon={loading ? <CircularProgress size={20} /> : <Save />}
//               disabled={loading}
//               sx={{
//                 backgroundColor: "#F8C8DC",
//                 color: "#4E342E",
//                 "&:hover": {
//                   backgroundColor: "#C3B1E1",
//                 },
//               }}
//             >
//               {isEditMode ? "עדכן מתכון" : "הוסף מתכון"}
//             </Button>
//           </Box>
//         </Box>
//       </Paper>

//       <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
//         <DialogTitle>האם אתה בטוח שברצונך למחוק את המתכון?</DialogTitle>
//         <DialogContent>
//           <Typography>פעולה זו אינה ניתנת לביטול. המתכון יימחק לצמיתות.</Typography>
//         </DialogContent>
//         <DialogActions sx={{ p: 3 }}>
//           <Button
//             onClick={() => setDeleteDialogOpen(false)}
//             sx={{
//               color: "#4E342E",
//               "&:hover": {
//                 backgroundColor: "rgba(195, 177, 225, 0.1)",
//               },
//             }}
//             disabled={loading}
//           >
//             ביטול
//           </Button>
//           <Button
//             onClick={handleDeleteRecipe}
//             color="error"
//             sx={{
//               backgroundColor: "#F8C8DC",
//               color: "#e57373",
//               "&:hover": {
//                 backgroundColor: "rgba(229, 115, 115, 0.2)",
//               },
//             }}
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : "מחק"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }













"use client"

import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material"
import { Add, ArrowBack, Delete, Edit, Save } from "@mui/icons-material"
import MuiAlert, { type AlertProps } from "@mui/material/Alert"
import axios from "axios"

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

export type Category = {
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
  Categoryid: Category
  Ingridents: Product[]
  Instructions: Instruc[]
}

interface AddRecipeFormProps {
  onRecipeAdded?: () => void
  onRecipeUpdated?: () => void
  onRecipeDeleted?: () => void
  editMode?: boolean
  recipeToEdit?: Recipe | null
}

// מיפוי בין מספרים לרמות קושי
const difficultyMap: Record<number, DifficultyType> = {
  1: "קל",
  2: "בינוני",
  3: "מתקדם",
  4: "מורכב",
}

// מיפוי הפוך - משמות לערכים מספריים
const difficultyValueMap: Record<DifficultyType, number> = {
  קל: 1,
  בינוני: 2,
  מתקדם: 3,
  מורכב: 4,
}

// אפשרויות לתפריט הנפתח
const difficultyOptions = [
  { value: "1", label: "קל" },
  { value: "2", label: "בינוני" },
  { value: "3", label: "מתקדם" },
  { value: "4", label: "מורכב" },
]

const frenchBoutiqueTheme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#C3B1E1",
    },
    secondary: {
      main: "#F8C8DC",
    },
  },
})

const unitTypes: UnitType[] = ["גרם", "כוסות", "כפיות", "חבילות", "יחידות", "כפות", "ml"]
const difficultyTypes: DifficultyType[] = ["קל", "בינוני", "מתקדם", "מורכב"]

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const AddRecipeForm = ({
  onRecipeAdded,
  onRecipeUpdated,
  onRecipeDeleted,
  editMode = false,
  recipeToEdit = null,
}: AddRecipeFormProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [Ingredients, setIngredients] = useState<Product[]>([])
  const [newIngredient, setNewIngredient] = useState<Product>({
    Name: "",
    Count: 1,
    Type: "יחידות",
  })
  const [Instructions, setInstructions] = useState<Instruc[]>([])
  const [newInstruction, setNewInstruction] = useState<string>("")

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
      if (userStr) {
        return JSON.parse(userStr)
      }
      return { id: 1 } // ברירת מחדל אם אין משתמש מחובר
    } catch (error) {
      return { id: 1 }
    }
  }

  const [formData, setFormData] = useState({
    Name: "",
    Img: "",
    Description: "",
    UserId: getCurrentUser().id,
    Duration: "",
    Difficulty: "1", // שינוי לערך מחרוזת "1" במקום ""
    Categoryid: 1, // שינוי ל-1 במקום 0
    Ingredients: [] as Product[],
    Instructions: [] as Instruc[],
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // המרת מספר רמת קושי לטקסט
  const getDifficultyText = (difficultyNum: number): string => {
    return difficultyMap[difficultyNum] || ""
  }

  useEffect(() => {
    if (editMode && recipeToEdit) {
      setFormData({
        Name: recipeToEdit.Name || "",
        Img: recipeToEdit.Img || "",
        Description: recipeToEdit.Description || "",
        UserId: recipeToEdit.UserId || 1,
        Duration: recipeToEdit.Duration ? recipeToEdit.Duration.toString() : "",
        // המרת מספר למחרוזת בתצוגה
        Difficulty: recipeToEdit.Difficulty ? recipeToEdit.Difficulty.toString() : "1",
        Categoryid: recipeToEdit.Categoryid?.Id ?? 1, // שינוי ל-1 במקום 0
        Ingredients: recipeToEdit.Ingridents || [],
        Instructions: recipeToEdit.Instructions || [],
      })

      setIngredients(recipeToEdit.Ingridents ? [...recipeToEdit.Ingridents] : [])
      setInstructions(recipeToEdit.Instructions ? [...recipeToEdit.Instructions] : [])
    }
  }, [editMode, recipeToEdit])

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get("http://localhost:8080/api/category")
        const data = response.data

        if (Array.isArray(data)) {
          setCategories(data)
        } else if (data && typeof data === "object") {
          const categoriesArray = Array.isArray(data.categories)
            ? data.categories
            : Array.isArray(data.data)
              ? data.data
              : Object.values(data).find((val) => Array.isArray(val))

          if (categoriesArray && categoriesArray.length > 0) {
            setCategories(categoriesArray)
          } else {
            setError("מבנה הנתונים לא תקין")
          }
        } else {
          setCategories([])
          setError("לא התקבלו נתונים תקינים")
        }
      } catch (error: any) {
        setError(error.response?.data || error.message || "שגיאה בטעינת קטגוריות")
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target

    if (name === "Categoryid") {
      // וידוא שהערך הוא מספר תקין
      const categoryId = Number.parseInt(value, 10)
      if (!isNaN(categoryId) && categoryId > 0) {
        setFormData((prev) => ({ ...prev, [name]: categoryId }))
      }
    } else if (name === "Difficulty") {
      // שמירת הערך כמחרוזת
      setFormData((prev) => ({ ...prev, [name]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleIngredientChange = (field: keyof Product, value: string | number) => {
    setNewIngredient((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addIngredient = () => {
    if (!newIngredient.Name.trim()) return

    setIngredients((prev) => [...prev, { ...newIngredient }])
    setNewIngredient({
      Name: "",
      Count: 1,
      Type: "יחידות",
    })
  }

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  const addInstruction = () => {
    if (!newInstruction.trim()) return

    const newInstructionObj: Instruc = {
      Id: Date.now().toString(),
      Name: newInstruction,
    }

    setInstructions((prev) => [...prev, newInstructionObj])
    setNewInstruction("")
  }

  const removeInstruction = (index: number) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.Name ||
      !formData.Img ||
      !formData.Duration ||
      !formData.Difficulty ||
      !formData.Categoryid ||
      !formData.Description ||
      !formData.UserId ||
      Ingredients.length === 0 ||
      Instructions.length === 0
    ) {
      setSnackbar({
        open: true,
        message: "יש למלא את כל השדות הנדרשים",
        severity: "error",
      })
      return
    }

    try {
      setLoading(true)

      // בדיקה שהקטגוריה קיימת
      const categoryId = formData.Categoryid
      const selectedCategory = categories.find((cat) => cat.Id === categoryId)

      if (!selectedCategory && categories.length > 0) {
        throw new Error("קטגוריה לא קיימת")
      }

      // שליחת הנתונים כמספרים לשרת
      const recipeData = {
        Id: editMode && recipeToEdit ? recipeToEdit.Id : undefined, // הוספת ID במצב עריכה
        Name: formData.Name,
        Img: formData.Img,
        Duration: Number.parseInt(formData.Duration, 10),
        // המרת רמת קושי למספר
        Difficulty: Number.parseInt(formData.Difficulty, 10),
        Description: formData.Description,
        UserId: editMode && recipeToEdit ? recipeToEdit.UserId : getCurrentUser().id,
        Categoryid: categoryId,
        Ingridents: Ingredients, // שים לב לשם השדה - Ingridents ולא Ingredients
        Instructions: Instructions,
      }

      const endpoint = editMode ? "http://localhost:8080/api/recipe/edit" : "http://localhost:8080/api/recipe"

      await axios.post(endpoint, recipeData)

      setSnackbar({
        open: true,
        message: editMode ? "המתכון עודכן בהצלחה!" : "המתכון נשמר בהצלחה!",
        severity: "success",
      })

      if (!editMode) {
        setFormData({
          Name: "",
          Img: "",
          Description: "",
          Duration: "",
          Difficulty: "1",
          Categoryid: 1,
          UserId: getCurrentUser().id,
          Ingredients: [],
          Instructions: [],
        })
        setIngredients([])
        setInstructions([])
      }

      if (editMode && onRecipeUpdated) {
        onRecipeUpdated()
      } else if (!editMode && onRecipeAdded) {
        onRecipeAdded()
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data || error.message || "שגיאה בשמירת המתכון",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!editMode || !recipeToEdit) {
      setDeleteDialogOpen(false)
      return
    }

    try {
      setLoading(true)

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || '{"id": 1}',
      )
      const currentUserId = currentUser?.id || 1

      if (recipeToEdit.UserId !== currentUserId) {
        // אפשר להוסיף כאן בדיקת הרשאות
      }

      const response = await axios.post(`http://localhost:8080/api/recipe/delete/${recipeToEdit.Id}`, {})

      setSnackbar({
        open: true,
        message: "המתכון נמחק בהצלחה!",
        severity: "success",
      })

      if (onRecipeDeleted) {
        onRecipeDeleted()
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data || error.message || "אירעה שגיאה במחיקת המתכון",
        severity: "error",
      })
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <ThemeProvider theme={frenchBoutiqueTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "#FFFDF8",
          minHeight: "100vh",
          width: "100%",
          py: 2,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => (window.location.href = "/allrecipes")}
          sx={{
            alignSelf: "flex-start",
            mb: 3,
            ml: 3,
            backgroundColor: "#F8C8DC",
            color: "#4E342E",
            "&:hover": { backgroundColor: "#C3B1E1" },
          }}
        >
          חזרה לעמוד המתכונים
        </Button>
        <Container maxWidth="md">
          <Paper elevation={1} sx={{ p: { xs: 3, md: 5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
              <Typography variant="h4" align="center" gutterBottom sx={{ color: "#4E342E" }}>
                {editMode ? "עריכת מתכון" : "הוספת מתכון חדש"}
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                "& .MuiTextField-root": { mb: 3 },
              }}
            >
              <TextField
                fullWidth
                label="שם המתכון"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                variant="outlined"
                required
                InputLabelProps={{ style: { direction: "rtl", color: "#4E342E" } }}
                inputProps={{ style: { textAlign: "right" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 8,
                    "& fieldset": { borderColor: "#BFAF9B" },
                    "&:hover fieldset": { borderColor: "#C3B1E1" },
                    "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="קישור לתמונה (URL)"
                name="Img"
                type="url"
                value={formData.Img}
                onChange={handleChange}
                variant="outlined"
                required
                InputLabelProps={{ style: { direction: "rtl", color: "#4E342E" } }}
                inputProps={{ style: { textAlign: "right" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 8,
                    "& fieldset": { borderColor: "#BFAF9B" },
                    "&:hover fieldset": { borderColor: "#C3B1E1" },
                    "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
                  },
                }}
              />
              {formData.Img && (
                <Box mt={2} mb={3} textAlign="center">
                  <img
                    src={formData.Img || "/placeholder.svg"}
                    alt="תצוגה מקדימה"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: "8px",
                      border: "1px solid #BFAF9B",
                    }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                </Box>
              )}

              <TextField
                fullWidth
                label="תיאור"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                helperText="תאר את המתכון בקצרה"
                InputLabelProps={{ style: { direction: "rtl", color: "#4E342E" } }}
                inputProps={{ style: { textAlign: "right" } }}
                FormHelperTextProps={{ style: { color: "#4E342E" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 8,
                    "& fieldset": { borderColor: "#BFAF9B" },
                    "&:hover fieldset": { borderColor: "#C3B1E1" },
                    "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
                  },
                }}
              />

              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="זמן הכנה כולל (דקות)"
                  name="Duration"
                  value={formData.Duration}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                  required
                  InputLabelProps={{ style: { direction: "rtl", color: "#4E342E" } }}
                  inputProps={{
                    min: 1,
                    style: { textAlign: "right" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 8,
                      "& fieldset": { borderColor: "#BFAF9B" },
                      "&:hover fieldset": { borderColor: "#C3B1E1" },
                      "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
                    },
                  }}
                />

                <FormControl fullWidth required>
                  <InputLabel id="difficulty-label" sx={{ right: 14, left: "auto", color: "#4E342E" }}>
                    רמת קושי
                  </InputLabel>
                  <Select
                    labelId="difficulty-label"
                    name="Difficulty"
                    value={formData.Difficulty}
                    onChange={handleSelectChange}
                    label="רמת קושי"
                    sx={{
                      textAlign: "right",
                      borderRadius: 8,
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#BFAF9B" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
                    }}
                  >
                    {difficultyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <FormControl fullWidth sx={{ mb: 3 }} required>
                <InputLabel id="category-label" sx={{ right: 14, left: "auto", color: "#4E342E" }}>
                  קטגוריה
                </InputLabel>
                <Select
                  labelId="category-label"
                  name="Categoryid"
                  value={formData.Categoryid.toString()} // וידוא שהערך הוא מחרוזת
                  onChange={handleSelectChange}
                  label="קטגוריה"
                  disabled={loading || categories.length === 0}
                  sx={{
                    textAlign: "right",
                    borderRadius: 8,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#BFAF9B" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
                  }}
                >
                  {loading ? (
                    <MenuItem value="" disabled>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={20} />
                        <span>טוען קטגוריות...</span>
                      </Box>
                    </MenuItem>
                  ) : error ? (
                    <MenuItem value="" disabled>
                      {error}
                    </MenuItem>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem key={category.Id} value={category.Id.toString()}>
                        {category.Name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="1" disabled>
                      אין קטגוריות זמינות
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                מרכיבים
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="שם המרכיב"
                  value={newIngredient.Name}
                  onChange={(e) => handleIngredientChange("Name", e.target.value)}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ style: { direction: "rtl", color: "#4E342E" } }}
                  inputProps={{ style: { textAlign: "right" } }}
                />
                <TextField
                  label="כמות"
                  type="number"
                  value={newIngredient.Count}
                  onChange={(e) => handleIngredientChange("Count", Number.parseInt(e.target.value) || 0)}
                  variant="outlined"
                  sx={{ width: "30%" }}
                  InputLabelProps={{ style: { direction: "rtl", color: "#4E342E" } }}
                  inputProps={{
                    min: 0,
                    style: {
                      textAlign: "right",
                    },
                  }}
                />
                <FormControl sx={{ width: "30%" }}>
                  <InputLabel id="unit-type-label" sx={{ right: 14, left: "auto", color: "#4E342E" }}>
                    יחידה
                  </InputLabel>
                  <Select
                    labelId="unit-type-label"
                    value={newIngredient.Type}
                    onChange={(e) => handleIngredientChange("Type", e.target.value as UnitType)}
                    label="יחידה"
                    sx={{ textAlign: "right" }}
                  >
                    {unitTypes.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton
                  onClick={addIngredient}
                  sx={{
                    backgroundColor: "#F8C8DC",
                    color: "#4E342E",
                    "&:hover": { backgroundColor: "#C3B1E1" },
                  }}
                >
                  <Add />
                </IconButton>
              </Box>

              <Paper variant="outlined" sx={{ mb: 3, maxHeight: "200px", overflow: "auto" }}>
                <List dense>
                  {Ingredients.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="אין מרכיבים. הוסף מרכיבים למתכון." />
                    </ListItem>
                  ) : (
                    Ingredients.map((ingredient, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${ingredient.Name}`}
                          secondary={`${ingredient.Count} ${ingredient.Type}`}
                          sx={{ textAlign: "right" }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => removeIngredient(index)}>
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>

              <Typography variant="h6" sx={{ mb: 2 }}>
                הוראות הכנה
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="שלב הכנה"
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  variant="outlined"
                  fullWidth
                  multiline
                  InputLabelProps={{ style: { direction: "rtl", color: "#4E342E" } }}
                  inputProps={{ style: { textAlign: "right" } }}
                />
                <IconButton
                  onClick={addInstruction}
                  sx={{
                    backgroundColor: "#F8C8DC",
                    color: "#4E342E",
                    "&:hover": { backgroundColor: "#C3B1E1" },
                  }}
                >
                  <Add />
                </IconButton>
              </Box>

              <Paper variant="outlined" sx={{ mb: 3, maxHeight: "200px", overflow: "auto" }}>
                <List dense>
                  {Instructions.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="אין הוראות הכנה. הוסף הוראות למתכון." />
                    </ListItem>
                  ) : (
                    Instructions.map((instruction, index) => (
                      <ListItem key={instruction.Id}>
                        <ListItemText primary={`${index + 1}. ${instruction.Name}`} sx={{ textAlign: "right" }} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => removeInstruction(index)}>
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>

              <Divider sx={{ my: 3 }} />

              {/* כפתורי פעולה */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                {/* כפתור מחיקה - מוצג רק במצב עריכה */}
                {editMode && (
                  <Button
                    type="button"
                    variant="outlined"
                    size="large"
                    onClick={handleDeleteClick}
                    startIcon={<Delete />}
                    sx={{
                      minWidth: 150,
                      fontSize: "1.1rem",
                      borderColor: "#F8C8DC",
                      color: "#4E342E",
                      "&:hover": {
                        borderColor: "#C3B1E1",
                        backgroundColor: "rgba(195, 177, 225, 0.1)",
                      },

                      backgroundColor: "rgba(195, 177, 225, 0.1)",
                    }}
                  >
                    מחק מתכון
                  </Button>
                )}
                {/* כפתור שמירה */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={editMode ? <Edit /> : <Save />}
                  sx={{
                    minWidth: 200,
                    fontSize: "1.1rem",
                    backgroundColor: "#F8C8DC",
                    color: "#4E342E",
                    "&:hover": { backgroundColor: "#C3B1E1", color: "#4E342E" },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : editMode ? "עדכן מתכון" : "שמור מתכון"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "right" }}>
          {"האם אתה בטוח שברצונך למחוק את המתכון?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ textAlign: "right" }}>
            פעולה זו תמחק לצמיתות את המתכון ולא ניתן יהיה לשחזר אותו.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "#4E342E" }}>
            ביטול
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            autoFocus
            sx={{
              backgroundColor: "#F8C8DC",
              color: "#4E342E",
              "&:hover": { backgroundColor: "#C3B1E1" },
            }}
          >
            אישור מחיקה
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}

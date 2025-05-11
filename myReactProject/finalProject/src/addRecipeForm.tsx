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
import type { CategoryModel, Instruc, Product, Recipe, UnitType } from "./models"

interface AddRecipeFormProps {
  onRecipeAdded?: () => void
  onRecipeUpdated?: () => void
  onRecipeDeleted?: () => void
  editMode?: boolean
  recipeToEdit?: Recipe | null
}

const difficultyMap: Record<number, string> = {
  1: "קל",
  2: "בינוני",
  3: "מתקדם",
  4: "מורכב",
}

const difficultyValueMap: Record<string, number> = {
  קל: 1,
  בינוני: 2,
  מתקדם: 3,
  מורכב: 4,
}

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
  const [categories, setCategories] = useState<CategoryModel[]>([])
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
      return { id: 1 }
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
    Difficulty: "1",
    Categoryid: 1,
    Ingredients: [] as Product[],
    Instructions: [] as Instruc[],
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const getDifficultyText = (difficultyNum: number): string => {
    return difficultyMap[difficultyNum] || ""
  }

  useEffect(() => {
    if (editMode && recipeToEdit) {
      const categoryId =
        typeof recipeToEdit.Categoryid === "object" && recipeToEdit.Categoryid !== null
          ? recipeToEdit.Categoryid.Id
          : typeof recipeToEdit.Categoryid === "number"
            ? recipeToEdit.Categoryid
            : 1

      setFormData({
        Name: recipeToEdit.Name || "",
        Img: recipeToEdit.Img || "",
        Description: recipeToEdit.Description || "",
        UserId: recipeToEdit.UserId || 1,
        Duration: recipeToEdit.Duration ? recipeToEdit.Duration.toString() : "",
        Difficulty: recipeToEdit.Difficulty ? recipeToEdit.Difficulty.toString() : "1",
        Categoryid: categoryId, 
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
      const categoryId = Number.parseInt(value, 10)
      if (!isNaN(categoryId) && categoryId > 0) {
        setFormData((prev) => ({ ...prev, [name]: categoryId }))
      }
    } else if (name === "Difficulty") {
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

      const categoryId = formData.Categoryid
      const selectedCategory = categories.find((cat) => cat.Id === categoryId)

      if (!selectedCategory && categories.length > 0) {
        throw new Error("קטגוריה לא קיימת")
      }

      const recipeData = {
        Id: editMode && recipeToEdit ? recipeToEdit.Id : undefined,
        Name: formData.Name,
        Img: formData.Img,
        Duration: Number.parseInt(formData.Duration, 10),
        Difficulty: Number.parseInt(formData.Difficulty, 10),
        Description: formData.Description,
        UserId: editMode && recipeToEdit ? recipeToEdit.UserId : getCurrentUser().id,
        Categoryid: categoryId,
        Ingridents: Ingredients,
        Instructions: Instructions,
      }

      console.log("שולח נתונים:", recipeData)

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
      console.error("שגיאה:", error)
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
                  value={formData.Categoryid.toString()}
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

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
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

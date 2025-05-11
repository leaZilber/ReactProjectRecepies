import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Drawer,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material"
import { FilterList, Close, Add, Category, RestartAlt, ShoppingCart } from "@mui/icons-material"
import { Slider, Checkbox, FormGroup, FormControlLabel } from "@mui/material"
import { FilterAlt } from "@mui/icons-material"
import { createTheme } from "@mui/material/styles"
import { useNavigate, useLocation } from "react-router-dom"
import RecipeGrid from "./recipe-grid"
import { AddRecipeForm } from "./addRecipeForm"
import type { Recipe, CategoryModel, DifficultyType } from "./models"
import ShoppingList from "./shoppingList"
import { RecipeDetail } from "./recipe-detail"
import React from "react"
import axios from "axios"

const frenchBoutiqueTheme = createTheme({
  palette: {
    primary: {
      main: "#C3B1E1",
      light: "#F8C8DC",
    },
    secondary: {
      main: "#F8C8DC",
    },
    background: {
      default: "#FFFDF8",
      paper: "#FFFDF8",
    },
    text: {
      primary: "#4E342E",
      secondary: "#4E342E",
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: "#4E342E",
      fontFamily: '"Playfair Display", serif',
    },
    h5: {
      fontWeight: 600,
      color: "#4E342E",
      fontFamily: '"Playfair Display", serif',
    },
    h6: {
      fontWeight: 600,
      color: "#4E342E",
      fontFamily: '"Playfair Display", serif',
    },
    body1: {
      color: "#4E342E",
    },
    body2: {
      color: "#4E342E",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: "none",
          padding: "10px 24px",
          fontWeight: 600,
          backgroundColor: "#F8C8DC",
          color: "#4E342E",
          "&:hover": {
            backgroundColor: "#C3B1E1",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #BFAF9B",
          backgroundColor: "#FFFDF8",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #BFAF9B",
          backgroundColor: "#FFFDF8",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
            borderColor: "#C3B1E1",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#BFAF9B",
          "&:hover": {
            backgroundColor: "rgba(195, 177, 225, 0.1)",
            color: "#C3B1E1",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#F8C8DC",
          color: "#4E342E",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#C3B1E1",
          },
          "&.MuiChip-outlined": {
            borderColor: "#BFAF9B",
            backgroundColor: "transparent",
          },
          "&.Mui-selected": {
            backgroundColor: "#C3B1E1",
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "#F8C8DC",
          color: "#4E342E",
          "&:hover": {
            backgroundColor: "#C3B1E1",
          },
        },
      },
    },
  },
})

export const AllRecipes = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState(0)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({})
  const [categories, setCategories] = useState<CategoryModel[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success")
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 120])
  const [selectedDifficulties, setSelectedDifficulties] = useState<DifficultyType[]>([])
  const [createdByFilter, setCreatedByFilter] = useState<number | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number>(1)

  const difficultyTypes: DifficultyType[] = ["קל", "בינוני", "מתקדם", "מורכב"]

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
      if (userStr) {
        const user = JSON.parse(userStr)
        setCurrentUserId(user.id || 1)
      }
    } catch (error) {
      setCurrentUserId(1)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 0) {
      navigate("/allrecipes", { replace: true })
    } else if (activeTab === 1) {
      navigate("/addrecipe", { replace: true })
    } else if (activeTab === 2) {
      navigate("/shoppinglist", { replace: true })
    }
  }, [activeTab, navigate])

  useEffect(() => {
    if (location.pathname === "/addrecipe") {
      setActiveTab(1)
    } else if (location.pathname === "/shoppinglist") {
      setActiveTab(2)
    } else {
      setActiveTab(0)
    }
  }, [location.pathname])

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/category")
      if (response.status !== 200) {
        throw new Error("Failed to fetch categories")
      }

      const data = await response.data
      setCategories(data)
    } catch (err) {
      console.error("Error fetching categories:", err);
      showSnackbar("אירעה שגיאה בטעינת הקטגוריות", "error")
    }
  }

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios("http://localhost:8080/api/recipe")
      if (response.status !== 200) {
        throw new Error("Failed to fetch recipes")
      }

      const data = await response.data
      setRecipes(data)
      setFilteredRecipes(data)

      const initialImageLoadedState: { [key: number]: boolean } = {}
      data.forEach((recipe: Recipe) => {
        initialImageLoadedState[recipe.Id] = false
      })
      setImageLoaded(initialImageLoadedState)
    } catch (err) {
      setError("אירעה שגיאה בטעינת המתכונים. אנא נסה שוב מאוחר יותר.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories()
      await fetchRecipes()
    }
    fetchData()
  }, [])

  useEffect(() => {
    let filtered = recipes

    if (selectedCategory !== null) {
      filtered = filtered.filter((recipe) => recipe.Categoryid?.Id === selectedCategory)
    }

    filtered = filtered.filter((recipe) => recipe.Duration >= durationRange[0] && recipe.Duration <= durationRange[1])

    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((recipe) => selectedDifficulties.includes(recipe.Difficulty))
    }

    if (createdByFilter !== null) {
      filtered = filtered.filter((recipe) => recipe.UserId === createdByFilter)
    }

    setFilteredRecipes(filtered)
  }, [selectedCategory, recipes, durationRange, selectedDifficulties, createdByFilter])

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
  }

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    if (categoryId === null) {
      setDurationRange([0, Math.max(120, ...recipes.map((r) => r.Duration || 0))])
      setSelectedDifficulties([])
      setCreatedByFilter(null)
    }
    setFilterDrawerOpen(false)
  }

  const handleBackToGrid = () => {
    setSelectedRecipe(null)
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      return
    }

    try {
      setCategoryLoading(true)

      const categoryData: CategoryModel = {
        Id: 0,
        Name: newCategoryName,
      }

      const response = await axios.post("http://localhost:8080/api/category", categoryData, {
      })

      if (response.status !== 200) {
        throw new Error("Failed to add category")
      }

      const newCategory = await response.data

      setCategories([...categories, newCategory])

      showSnackbar("הקטגוריה נוספה בהצלחה!")
      setNewCategoryName("")
      setAddCategoryDialogOpen(false)
    } catch (err) {
      showSnackbar("אירעה שגיאה בהוספת הקטגוריה", "error")
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleRecipeAdded = () => {
    fetchRecipes()
    setActiveTab(0)
    navigate("/allrecipes", { replace: true })
    showSnackbar("המתכון נוסף בהצלחה!")
  }

  const handleRecipeUpdated = () => {
    fetchRecipes()
    showSnackbar("המתכון עודכן בהצלחה!")
  }

  const handleRecipeDeleted = () => {
    fetchRecipes()
    setSelectedRecipe(null)
    showSnackbar("המתכון נמחק בהצלחה!")
  }

  const resetAllFilters = () => {
    setSelectedCategory(null)
    setDurationRange([0, Math.max(120, ...recipes.map((r) => r.Duration || 0))])
    setSelectedDifficulties([])
    setCreatedByFilter(null)
  }

  const handleImageLoad = (recipeId: number) => {
    setImageLoaded((prev) => ({
      ...prev,
      [recipeId]: true,
    }))
  }

  return (
    <ThemeProvider theme={frenchBoutiqueTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#FFFDF8",
          py: 4,
          direction: "rtl",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="h4" align="center" sx={{ flexGrow: 1 }}>
              המתכונים שלנו
            </Typography>

            {!selectedRecipe && activeTab === 0 && (
              <IconButton
                onClick={() => setFilterDrawerOpen(true)}
                sx={{
                  backgroundColor: "#F8C8DC",
                  color: "#4E342E",
                  "&:hover": {
                    backgroundColor: "#C3B1E1",
                  },
                  ml: 2,
                }}
              >
                <FilterList />
              </IconButton>
            )}
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => {
                setActiveTab(newValue)
                setSelectedRecipe(null)
              }}
              centered
              sx={{
                "& .MuiTab-root": {
                  color: "#4E342E",
                  "&.Mui-selected": {
                    color: "#C3B1E1",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#C3B1E1",
                },
              }}
            >
              <Tab label="כל המתכונים" />
              <Tab label="הוסף מתכון חדש" />
              <Tab label="רשימת קניות" icon={<ShoppingCart sx={{ fontSize: 18 }} />} iconPosition="start" />
            </Tabs>
          </Box>

          {selectedCategory && activeTab === 0 && !selectedRecipe && (
            <Box sx={{ display: "flex", mb: 3, alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                מסנן לפי:
              </Typography>
              <Chip
                label={categories.find((c) => c.Id === selectedCategory)?.Name || ""}
                onDelete={() => handleCategorySelect(null)}
                sx={{ mr: 1 }}
              />
            </Box>
          )}

          {activeTab === 0 ? (
            loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
                <CircularProgress sx={{ color: "#C3B1E1" }} />
              </Box>
            ) : error ? (
              <Typography color="error" align="center">
                {error}
              </Typography>
            ) : selectedRecipe ? (
              <RecipeDetail
                recipe={selectedRecipe}
                onBack={handleBackToGrid}
                onRecipeUpdated={handleRecipeUpdated}
                onRecipeDeleted={handleRecipeDeleted}
                onImageLoad={(recipeId) => handleImageLoad(recipeId)}
                imageLoaded={imageLoaded}
                userId={String(currentUserId)}
              />
            ) : (
              <RecipeGrid
                recipes={filteredRecipes}
                onRecipeClick={handleRecipeClick}
                onImageLoad={handleImageLoad}
                imageLoaded={imageLoaded}
              />
            )
          ) : activeTab === 1 ? (
            <AddRecipeForm
              onRecipeAdded={handleRecipeAdded}
              onRecipeUpdated={handleRecipeUpdated}
              onRecipeDeleted={handleRecipeDeleted}
            />
          ) : (
            <ShoppingList />
          )}
        </Container>
      </Box>

      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            p: 3,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
            <FilterAlt sx={{ mr: 1, color: "#BFAF9B" }} />
            סינון לפי קטגוריה
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3, borderColor: "#BFAF9B" }} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="category-select-label">קטגוריה</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory !== null ? selectedCategory.toString() : ""}
            onChange={(e) => handleCategorySelect(e.target.value ? Number.parseInt(e.target.value) : null)}
            label="קטגוריה"
          >
            <MenuItem value="">
              <em>הכל</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.Id} value={category.Id.toString()}>
                {category.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          <Chip
            label="הכל"
            onClick={() => handleCategorySelect(null)}
            variant={selectedCategory === null ? "filled" : "outlined"}
            sx={{
              backgroundColor: selectedCategory === null ? "#C3B1E1" : "transparent",
              color: selectedCategory === null ? "#FFFFFF" : "#4E342E",
            }}
          />
          {categories.map((category) => (
            <Chip
              key={category.Id}
              label={category.Name}
              onClick={() => handleCategorySelect(category.Id)}
              variant={selectedCategory === category.Id ? "filled" : "outlined"}
              sx={{
                backgroundColor: selectedCategory === category.Id ? "#C3B1E1" : "transparent",
                color: selectedCategory === category.Id ? "#FFFFFF" : "#4E342E",
              }}
            />
          ))}
        </Box>

        {/* Duration Filter */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
          סינון לפי משך זמן (דקות)
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={durationRange}
            onChange={(_, newValue) => setDurationRange(newValue as [number, number])}
            valueLabelDisplay="auto"
            min={0}
            max={Math.max(120, ...recipes.map((r) => r.Duration || 0))}
            sx={{
              color: "#C3B1E1",
              "& .MuiSlider-thumb": {
                backgroundColor: "#F8C8DC",
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption">{durationRange[0]} דקות</Typography>
            <Typography variant="caption">{durationRange[1]} דקות</Typography>
          </Box>
        </Box>

        {/* Difficulty Filter */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
          סינון לפי רמת קושי
        </Typography>
        <FormGroup sx={{ px: 1 }}>
          {difficultyTypes.map((difficulty) => (
            <FormControlLabel
              key={difficulty}
              control={
                <Checkbox
                  checked={selectedDifficulties.includes(difficulty)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDifficulties([...selectedDifficulties, difficulty])
                    } else {
                      setSelectedDifficulties(selectedDifficulties.filter((d) => d !== difficulty))
                    }
                  }}
                  sx={{
                    color: "#BFAF9B",
                    "&.Mui-checked": {
                      color: "#C3B1E1",
                    },
                  }}
                />
              }
              label={difficulty}
              sx={{ direction: "rtl" }}
            />
          ))}
        </FormGroup>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
          נוצר על ידי
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            value={createdByFilter !== null ? createdByFilter : ""}
            onChange={(e) => setCreatedByFilter(e.target.value === "" ? null : Number(e.target.value))}
            displayEmpty
            sx={{
              textAlign: "right",
              borderRadius: 8,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#BFAF9B" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
            }}
          >
            <MenuItem value="">
              <em>כל המשתמשים</em>
            </MenuItem>
            {Array.from(new Set(recipes.map((recipe) => recipe.UserId))).map((userId) => (
              <MenuItem key={userId} value={userId}>
                משתמש {userId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          startIcon={<RestartAlt />}
          onClick={resetAllFilters}
          variant="outlined"
          fullWidth
          sx={{
            mt: 3,
            borderColor: "#F8C8DC",
            color: "#4E342E",
            "&:hover": {
              borderColor: "#C3B1E1",
              backgroundColor: "rgba(195, 177, 225, 0.1)",
            },
          }}
        >
          איפוס כל הסינונים
        </Button>

        <Button
          startIcon={<Add />}
          onClick={() => setAddCategoryDialogOpen(true)}
          variant="outlined"
          sx={{
            mt: 2,
            borderColor: "#F8C8DC",
            color: "#4E342E",
            "&:hover": {
              borderColor: "#C3B1E1",
              backgroundColor: "rgba(195, 177, 225, 0.1)",
            },
          }}
        >
          הוסף קטגוריה חדשה
        </Button>
      </Drawer>

      <Dialog open={addCategoryDialogOpen} onClose={() => setAddCategoryDialogOpen(false)}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Category sx={{ mr: 1, color: "#BFAF9B" }} />
          הוספת קטגוריה חדשה
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם הקטגוריה"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#BFAF9B" },
                "&:hover fieldset": { borderColor: "#C3B1E1" },
                "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setAddCategoryDialogOpen(false)}
            sx={{
              color: "#4E342E",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(195, 177, 225, 0.1)",
              },
            }}
            disabled={categoryLoading}
          >
            ביטול
          </Button>
          <Button
            onClick={handleAddCategory}
            sx={{
              backgroundColor: "#F8C8DC",
              color: "#4E342E",
              "&:hover": {
                backgroundColor: "#C3B1E1",
              },
            }}
            disabled={categoryLoading || !newCategoryName.trim()}
          >
            {categoryLoading ? <CircularProgress size={24} sx={{ color: "#4E342E" }} /> : "הוסף"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: { xs: "block", md: "none" },
        }}
      >
        {activeTab === 0 && !selectedRecipe && (
          <Fab color="primary" aria-label="filter" onClick={() => setFilterDrawerOpen(true)}>
            <FilterList />
          </Fab>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor: snackbarSeverity === "success" ? "#C3B1E1" : "#F8C8DC",
            color: "#FFFFFF",
            "& .MuiAlert-icon": {
              color: "#FFFFFF",
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}


























// "use client"
// import { AddRecipeForm } from "./add-recipe-form"
// import type { Recipe, CategoryModel, DifficultyType } from "./models"
// import ShoppingList from "./shopping-list"
// import { RecipeDetail } from "./recipe-detail"
// import axios from "axios"

// const frenchBoutiqueTheme = createTheme({
//   palette: {
//     primary: {
//       main: "#C3B1E1",
//       light: "#F8C8DC",
//     },
//     secondary: {
//       main: "#F8C8DC",
//     },
//     background: {
//       default: "#FFFDF8",
//       paper: "#FFFDF8",
//     },
//     text: {
//       primary: "#4E342E",
//       secondary: "#4E342E",
//     },
//   },
//   typography: {
//     fontFamily: '"Playfair Display", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 600,
//       color: "#4E342E",
//       fontFamily: '"Playfair Display", serif',
//     },
//     h5: {
//       fontWeight: 600,
//       color: "#4E342E",
//       fontFamily: '"Playfair Display", serif',
//     },
//     h6: {
//       fontWeight: 600,
//       color: "#4E342E",
//       fontFamily: '"Playfair Display", serif',
//     },
//     body1: {
//       color: "#4E342E",
//     },
//     body2: {
//       color: "#4E342E",
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 30,
//           textTransform: "none",
//           padding: "10px 24px",
//           fontWeight: 600,
//           backgroundColor: "#F8C8DC",
//           color: "#4E342E",
//           "&:hover": {
//             backgroundColor: "#C3B1E1",
//           },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//           border: "1px solid #BFAF9B",
//           backgroundColor: "#FFFDF8",
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//           border: "1px solid #BFAF9B",
//           backgroundColor: "#FFFDF8",
//           transition: "transform 0.3s ease, box-shadow 0.3s ease",
//           "&:hover": {
//             transform: "translateY(-5px)",
//             boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
//             borderColor: "#C3B1E1",
//           },
//         },
//       },
//     },
//     MuiIconButton: {
//       styleOverrides: {
//         root: {
//           color: "#BFAF9B",
//           "&:hover": {
//             backgroundColor: "rgba(195, 177, 225, 0.1)",
//             color: "#C3B1E1",
//           },
//         },
//       },
//     },
//     MuiChip: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "#F8C8DC",
//           color: "#4E342E",
//           fontWeight: 500,
//           "&:hover": {
//             backgroundColor: "#C3B1E1",
//           },
//           "&.MuiChip-outlined": {
//             borderColor: "#BFAF9B",
//             backgroundColor: "transparent",
//           },
//           "&.Mui-selected": {
//             backgroundColor: "#C3B1E1",
//             color: "#FFFFFF",
//           },
//         },
//       },
//     },
//     MuiFab: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "#F8C8DC",
//           color: "#4E342E",
//           "&:hover": {
//             backgroundColor: "#C3B1E1",
//           },
//         },
//       },
//     },
//   },
// })

// export const AllRecipes = () => {
//   const navigate = useNavigate()
//   const location = useLocation()

//   const [activeTab, setActiveTab] = useState(0)
//   const [recipes, setRecipes] = useState<Recipe[]>([])
//   const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
//   const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({})
//   const [categories, setCategories] = useState<CategoryModel[]>([])
//   const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
//   const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false)
//   const [newCategoryName, setNewCategoryName] = useState("")
//   const [snackbarOpen, setSnackbarOpen] = useState(false)
//   const [snackbarMessage, setSnackbarMessage] = useState("")
//   const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success")
//   const [categoryLoading, setCategoryLoading] = useState(false)
//   const [durationRange, setDurationRange] = useState<[number, number]>([0, 120])
//   const [selectedDifficulties, setSelectedDifficulties] = useState<DifficultyType[]>([])
//   const [createdByFilter, setCreatedByFilter] = useState<number | null>(null)
//   const [currentUserId, setCurrentUserId] = useState<number | string>(1)
//   const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null)

//   const difficultyTypes: DifficultyType[] = ["קל", "בינוני", "מתקדם", "מורכב"]

//   useEffect(() => {
//     try {
//       const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
//       if (userStr) {
//         const user = JSON.parse(userStr)
//         setCurrentUserId(user.id || 1)
//       }
//     } catch (error) {
//       setCurrentUserId(1)
//     }
//   }, [])

//   useEffect(() => {
//     if (activeTab === 0) {
//       navigate("/allrecipes", { replace: true })
//     } else if (activeTab === 1) {
//       navigate("/addrecipe", { replace: true })
//     } else if (activeTab === 2) {
//       navigate("/shoppinglist", { replace: true })
//     }
//   }, [activeTab, navigate])

//   useEffect(() => {
//     if (location.pathname === "/addrecipe") {
//       setActiveTab(1)
//     } else if (location.pathname === "/shoppinglist") {
//       setActiveTab(2)
//     } else {
//       setActiveTab(0)
//     }
//   }, [location.pathname])

//   const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
//     setSnackbarMessage(message)
//     setSnackbarSeverity(severity)
//     setSnackbarOpen(true)
//   }

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/category")
//       if (response.status !== 200) {
//         throw new Error("Failed to fetch categories")
//       }

//       // Fixed: Using response.data as a property, not a method
//       setCategories(response.data)
//     } catch (err) {
//       console.error("Error fetching categories:", err)
//       showSnackbar("אירעה שגיאה בטעינת הקטגוריות", "error")
//     }
//   }

//   const fetchRecipes = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       const response = await axios.get("http://localhost:8080/api/recipe")
//       if (response.status !== 200) {
//         throw new Error("Failed to fetch recipes")
//       }

//       // Fixed: Using response.data as a property, not a method
//       const data = response.data
//       setRecipes(data)
//       setFilteredRecipes(data)

//       const initialImageLoadedState: { [key: number]: boolean } = {}
//       data.forEach((recipe: Recipe) => {
//         initialImageLoadedState[recipe.Id] = false
//       })
//       setImageLoaded(initialImageLoadedState)
//     } catch (err) {
//       console.error("Error fetching recipes:", err)
//       setError("אירעה שגיאה בטעינת המתכונים. אנא נסה שוב מאוחר יותר.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchCategories()
//       await fetchRecipes()
//     }
//     fetchData()
//   }, [])

//   useEffect(() => {
//     let filtered = recipes

//     if (selectedCategory !== null) {
//       filtered = filtered.filter((recipe) => recipe.CategoryId === selectedCategory)
//     }

//     filtered = filtered.filter((recipe) => recipe.Duration >= durationRange[0] && recipe.Duration <= durationRange[1])

//     if (selectedDifficulties.length > 0) {
//       filtered = filtered.filter((recipe) => selectedDifficulties.includes(recipe.Difficulty))
//     }

//     if (createdByFilter !== null) {
//       filtered = filtered.filter((recipe) => recipe.UserId === createdByFilter)
//     }

//     setFilteredRecipes(filtered)
//   }, [selectedCategory, recipes, durationRange, selectedDifficulties, createdByFilter])

//   const handleRecipeClick = (recipe: Recipe) => {
//     setSelectedRecipe(recipe)
//   }

//   const handleEditRecipe = (recipe: Recipe) => {
//     setRecipeToEdit(recipe)
//     setActiveTab(1) // Switch to add/edit tab
//     navigate("/addrecipe", { replace: true })
//   }

//   const handleCategorySelect = (categoryId: number | null) => {
//     setSelectedCategory(categoryId)
//     if (categoryId === null) {
//       setDurationRange([0, Math.max(120, ...recipes.map((r) => r.Duration || 0))])
//       setSelectedDifficulties([])
//       setCreatedByFilter(null)
//     }
//     setFilterDrawerOpen(false)
//   }

//   const handleBackToGrid = () => {
//     setSelectedRecipe(null)
//   }

//   const handleAddCategory = async () => {
//     if (!newCategoryName.trim()) {
//       return
//     }

//     try {
//       setCategoryLoading(true)

//       const categoryData: CategoryModel = {
//         Id: 0,
//         Name: newCategoryName,
//       }

//       const response = await axios.post("http://localhost:8080/api/category", categoryData)

//       if (response.status !== 200) {
//         throw new Error("Failed to add category")
//       }

//       // Fixed: Using response.data as a property, not a method
//       const newCategory = response.data

//       setCategories([...categories, newCategory])

//       showSnackbar("הקטגוריה נוספה בהצלחה!")
//       setNewCategoryName("")
//       setAddCategoryDialogOpen(false)
//     } catch (err) {
//       console.error("Error adding category:", err)
//       showSnackbar("אירעה שגיאה בהוספת הקטגוריה", "error")
//     } finally {
//       setCategoryLoading(false)
//     }
//   }

//   const handleRecipeAdded = () => {
//     fetchRecipes()
//     setActiveTab(0)
//     navigate("/allrecipes", { replace: true })
//     showSnackbar("המתכון נוסף בהצלחה!")
//   }

//   const handleRecipeUpdated = () => {
//     fetchRecipes()
//     setRecipeToEdit(null)
//     setActiveTab(0)
//     navigate("/allrecipes", { replace: true })
//     showSnackbar("המתכון עודכן בהצלחה!")
//   }

//   const handleRecipeDeleted = () => {
//     fetchRecipes()
//     setSelectedRecipe(null)
//     setRecipeToEdit(null)
//                 if (newValue !== 1) {
//                   setRecipeToEdit(null) // Clear edit state when not on add/edit tab
//                 }
//               }}
//               centered
//               sx={{
//                 "& .MuiTab-root": {
//                   color: "#4E342E",
//                   "&.Mui-selected": {
//                     color: "#C3B1E1",
//                   },
//                 },
//                 "& .MuiTabs-indicator": {
//                   backgroundColor: "#C3B1E1",
//                 },
//               }}
//             >
//               <Tab label="כל המתכונים" />
//               <Tab label={recipeToEdit ? "ערוך מתכון" : "הוסף מתכון חדש"} />
//               <RecipeDetail
//                 recipe={selectedRecipe}
//                 onBack={handleBackToGrid}
//                 onEdit={handleEditRecipe}
//                 onRecipeUpdated={handleRecipeUpdated}
//                 onRecipeDeleted={handleRecipeDeleted}
//                 onImageLoad={(recipeId) => handleImageLoad(recipeId)}
//                 imageLoaded={imageLoaded}
//                 userId={currentUserId}
//               />
//             ) : (
//               <RecipeGrid
//                 recipes={filteredRecipes}
//                 onRecipeClick={handleRecipeClick}
//                 onImageLoad={handleImageLoad}
//                 imageLoaded={imageLoaded}
//               />
//             )
//           ) : activeTab === 1 ? (
//             <AddRecipeForm
//               recipeToEdit={recipeToEdit}
//               onRecipeAdded={handleRecipeAdded}
//               onRecipeUpdated={handleRecipeUpdated}
//               onRecipeDeleted={handleRecipeDeleted}
//               onCancel={() => {
//                 setRecipeToEdit(null)
//                 setActiveTab(0)
//                 navigate("/allrecipes", { replace: true })
//               }}
//               categories={categories}
//             />
//           ) : (
//             <ShoppingList />
//           )}
//         </Container>
//       </Box>

//       <Drawer
//         anchor="right"
//         open={filterDrawerOpen}
//         onClose={() => setFilterDrawerOpen(false)}
//         PaperProps={{
//           sx: {
//             width: 300,
//             p: 3,
//           },
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//           <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
//             <FilterAlt sx={{ mr: 1, color: "#BFAF9B" }} />
//             סינון לפי קטגוריה
//           </Typography>
//           <IconButton onClick={() => setFilterDrawerOpen(false)}>
//             <Close />
//           </IconButton>
//         </Box>

//         <Divider sx={{ mb: 3, borderColor: "#BFAF9B" }} />

//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <InputLabel id="category-select-label">קטגוריה</InputLabel>
//           <Select
//             labelId="category-select-label"
//             value={selectedCategory !== null ? selectedCategory.toString() : ""}
//             onChange={(e) => handleCategorySelect(e.target.value ? Number.parseInt(e.target.value) : null)}
//             label="קטגוריה"
//           >
//             <MenuItem value="">
//               <em>הכל</em>
//             </MenuItem>
//             {categories.map((category) => (
//               <MenuItem key={category.Id} value={category.Id.toString()}>
//                 {category.Name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
//           <Chip
//             label="הכל"
//             onClick={() => handleCategorySelect(null)}
//             variant={selectedCategory === null ? "filled" : "outlined"}
//             sx={{
//               backgroundColor: selectedCategory === null ? "#C3B1E1" : "transparent",
//               color: selectedCategory === null ? "#FFFFFF" : "#4E342E",
//             }}
//           />
//           {categories.map((category) => (
//             <Chip
//               key={category.Id}
//               label={category.Name}
//               onClick={() => handleCategorySelect(category.Id)}
//               variant={selectedCategory === category.Id ? "filled" : "outlined"}
//               sx={{
//                 backgroundColor: selectedCategory === category.Id ? "#C3B1E1" : "transparent",
//                 color: selectedCategory === category.Id ? "#FFFFFF" : "#4E342E",
//               }}
//             />
//           ))}
//         </Box>

//         {/* Duration Filter */}
//         <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
//           סינון לפי משך זמן (דקות)
//         </Typography>
//         <Box sx={{ px: 1 }}>
//           <Slider
//             value={durationRange}
//             onChange={(_, newValue) => setDurationRange(newValue as [number, number])}
//             valueLabelDisplay="auto"
//             min={0}
//             max={Math.max(120, ...recipes.map((r) => r.Duration || 0))}
//             sx={{
//               color: "#C3B1E1",
//               "& .MuiSlider-thumb": {
//                 backgroundColor: "#F8C8DC",
//               },
//             }}
//           />
//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography variant="caption">{durationRange[0]} דקות</Typography>
//             <Typography variant="caption">{durationRange[1]} דקות</Typography>
//           </Box>
//         </Box>

//         {/* Difficulty Filter */}
//         <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
//           סינון לפי רמת קושי
//         </Typography>
//         <FormGroup sx={{ px: 1 }}>
//           {difficultyTypes.map((difficulty) => (
//             <FormControlLabel
//               key={difficulty}
//               control={
//                 <Checkbox
//                   checked={selectedDifficulties.includes(difficulty)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedDifficulties([...selectedDifficulties, difficulty])
//                     } else {
//                       setSelectedDifficulties(selectedDifficulties.filter((d) => d !== difficulty))
//                     }
//                   }}
//                   sx={{
//                     color: "#BFAF9B",
//                     "&.Mui-checked": {
//                       color: "#C3B1E1",
//                     },
//                   }}
//                 />
//               }
//               label={difficulty}
//               sx={{ direction: "rtl" }}
//             />
//           ))}
//         </FormGroup>

//         <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
//           נוצר על ידי
//         </Typography>
//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <Select
//             value={createdByFilter !== null ? createdByFilter : ""}
//             onChange={(e) => setCreatedByFilter(e.target.value === "" ? null : Number(e.target.value))}
//             displayEmpty
//             sx={{
//               textAlign: "right",
//               borderRadius: 8,
//               "& .MuiOutlinedInput-notchedOutline": { borderColor: "#BFAF9B" },
//               "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
//               "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#C3B1E1" },
//             }}
//           >
//             <MenuItem value="">
//               <em>כל המשתמשים</em>
//             </MenuItem>
//             {Array.from(new Set(recipes.map((recipe) => recipe.UserId))).map((userId) => (
//               <MenuItem key={userId} value={userId}>
//                 משתמש {userId}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button
//           startIcon={<RestartAlt />}
//           onClick={resetAllFilters}
//           variant="outlined"
//           fullWidth
//           sx={{
//             mt: 3,
//             borderColor: "#F8C8DC",
//             color: "#4E342E",
//             "&:hover": {
//               borderColor: "#C3B1E1",
//               backgroundColor: "rgba(195, 177, 225, 0.1)",
//             },
//           }}
//         >
//           איפוס כל הסינונים
//         </Button>

//         <Button
//           startIcon={<Add />}
//           onClick={() => setAddCategoryDialogOpen(true)}
//           variant="outlined"
//           sx={{
//             mt: 2,
//             borderColor: "#F8C8DC",
//             color: "#4E342E",
//             "&:hover": {
//               borderColor: "#C3B1E1",
//               backgroundColor: "rgba(195, 177, 225, 0.1)",
//             },
//           }}
//         >
//           הוסף קטגוריה חדשה
//         </Button>
//       </Drawer>

//       <Dialog open={addCategoryDialogOpen} onClose={() => setAddCategoryDialogOpen(false)}>
//         <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
//           <Category sx={{ mr: 1, color: "#BFAF9B" }} />
//           הוספת קטגוריה חדשה
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="שם הקטגוריה"
//             fullWidth
//             variant="outlined"
//             value={newCategoryName}
//             onChange={(e) => setNewCategoryName(e.target.value)}
//             sx={{
//               mt: 2,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "#BFAF9B" },
//                 "&:hover fieldset": { borderColor: "#C3B1E1" },
//                 "&.Mui-focused fieldset": { borderColor: "#C3B1E1" },
//               },
//             }}
//           />
//         </DialogContent>
//         <DialogActions sx={{ p: 3 }}>
//           <Button
//             onClick={() => setAddCategoryDialogOpen(false)}
//             sx={{
//               color: "#4E342E",
//               backgroundColor: "transparent",
//               "&:hover": {
//                 backgroundColor: "rgba(195, 177, 225, 0.1)",
//               },
//             }}
//             disabled={categoryLoading}
//           >
//             ביטול
//           </Button>
//           <Button
//             onClick={handleAddCategory}
//             sx={{
//               backgroundColor: "#F8C8DC",
//               color: "#4E342E",
//               "&:hover": {
//                 backgroundColor: "#C3B1E1",
//               },
//             }}
//             disabled={categoryLoading || !newCategoryName.trim()}
//           >
//             {categoryLoading ? <CircularProgress size={24} sx={{ color: "#4E342E" }} /> : "הוסף"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Box
//         sx={{
//           position: "fixed",
//           bottom: 20,
//           right: 20,
//           display: { xs: "block", md: "none" },
//         }}
//       >
//         {activeTab === 0 && !selectedRecipe && (
//           <Fab color="primary" aria-label="filter" onClick={() => setFilterDrawerOpen(true)}>
//             <FilterList />
//           </Fab>
//         )}
//       </Box>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbarOpen(false)}
//           severity={snackbarSeverity}
//           sx={{
//             width: "100%",
//             backgroundColor: snackbarSeverity === "success" ? "#C3B1E1" : "#F8C8DC",
//             color: "#FFFFFF",
//             "& .MuiAlert-icon": {
//               color: "#FFFFFF",
//             },
//           }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </ThemeProvider>
//   )
// }
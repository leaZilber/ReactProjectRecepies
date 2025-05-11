import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Fab,
} from "@mui/material"
import { Add, Delete, ShoppingCart, AddShoppingCart, ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import React from "react"

interface ShoppingItem {
  Id?: number
  Name: string
  Count: number
  UserId: number
}

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
  },
  direction: "rtl",
})

const ShoppingList = () => {
  const navigate = useNavigate()
  const userId = 1
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState("")
  const [newItemCount, setNewItemCount] = useState(1)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success")

  const handleBackToRecipes = () => {
    navigate("/allrecipes")
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:8080/api/bay/${userId}`)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error("Failed to fetch shopping list: " + errorText)
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError("אירעה שגיאה בטעינת רשימת הקניות")
    } finally {
      setLoading(false)
    }
  }

  const addItem = async () => {
    if (!newItemName.trim()) {
      showSnackbar("יש להזין שם מוצר", "error")
      return
    }

    try {
      setLoading(true)

      const newItem: ShoppingItem = {
        Name: newItemName,
        Count: newItemCount,
        UserId: userId,
      }

      const response = await axios.post("http://localhost:8080/api/bay", newItem)
      if (response.status !== 200) {
        throw new Error("Failed to add item")
      }

      await fetchItems()
      setNewItemName("")
      setNewItemCount(1)
      showSnackbar("המוצר נוסף בהצלחה", "success")
    } catch (err) {
      showSnackbar("אירעה שגיאה בהוספת המוצר", "error")
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (itemId: number | undefined) => {
    if (!itemId) {
      showSnackbar("מזהה מוצר לא תקין", "error")
      return
    }
    try {
      setLoading(true)
      const response = await axios.post(`http://localhost:8080/api/bay/delete/${itemId}`, {})

      if (response.status !== 200) {
        throw new Error("Failed to delete item")
      }
      await fetchItems()
      showSnackbar("המוצר נמחק בהצלחה", "success")
    } catch (err) {
      showSnackbar("אירעה שגיאה במחיקת המוצר", "error")
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <ThemeProvider theme={frenchBoutiqueTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "#FFFDF8",
          py: 4,
          overflow: "auto",
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBackToRecipes}
                variant="outlined"
                sx={{
                  mr: 2,
                  borderColor: "#BFAF9B",
                  color: "#4E342E",
                  "&:hover": {
                    borderColor: "#C3B1E1",
                    backgroundColor: "rgba(195, 177, 225, 0.1)",
                  },
                }}
              >
                חזרה למתכונים
              </Button>
              <ShoppingCart sx={{ fontSize: 32, color: "#C3B1E1", mr: 2 }} />
              <Typography variant="h4">רשימת קניות</Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                הוספת מוצר חדש
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <TextField
                  label="שם המוצר"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  fullWidth
                  sx={{ mb: 0 }}
                />
                <TextField
                  label="כמות"
                  type="number"
                  value={newItemCount}
                  onChange={(e) => setNewItemCount(Number.parseInt(e.target.value) || 1)}
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  sx={{ width: "120px", mb: 0 }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addItem}
                  disabled={loading}
                  sx={{
                    height: "56px",
                    minWidth: "120px",
                  }}
                >
                  הוסף
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              המוצרים שלך
            </Typography>

            {loading && items.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress sx={{ color: "#C3B1E1" }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : items.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 6,
                  opacity: 0.7,
                }}
              >
                <AddShoppingCart sx={{ fontSize: 64, color: "#BFAF9B", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  רשימת הקניות שלך ריקה
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  הוסף מוצרים חדשים באמצעות הטופס למעלה
                </Typography>
              </Box>
            ) : (
              <List sx={{ width: "100%" }}>
                {items.map((item) => (
                  <Paper
                    key={item.Id}
                    elevation={1}
                    sx={{
                      mb: 2,
                      overflow: "hidden",
                      border: "1px solid #BFAF9B",
                    }}
                  >
                    <ListItem
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.Id)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {item.Name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            כמות: {item.Count}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </Paper>
        </Container>

        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            display: { xs: "block", md: "none" },
          }}
        >
          <Fab color="primary" aria-label="back" onClick={handleBackToRecipes}>
            <ArrowBack />
          </Fab>
        </Box>
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

export default ShoppingList
import { useState, useContext } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Container,
  Paper,
} from "@mui/material"
import { Person, Lock, Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { flagContext } from "./userModel"
import { useNavigate } from "react-router-dom"
import React from "react"

const loginSchema = yup.object({
  UserName: yup.string().required("שם משתמש הוא שדה חובה"),
  Password: yup.string().required("סיסמה היא שדה חובה"),
})

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const context = useContext(flagContext)
  if (!context) {
    throw new Error("Login must be used within a UserProvider")
  }
  const { setAuthorizedUser } = context

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  })

  const navigate = useNavigate()

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      setError(null)

      const loginData = {
        UserName: data.UserName,
        Password: data.Password,
      }

      const response = await axios.post("http://localhost:8080/api/user/login", loginData)

      setAuthorizedUser(true)
      setSuccess(true)
      setTimeout(() => {
        navigate("/AllRecipes")
      }, 1500)
    } catch (err) {
      setError("התחברות נכשלה. אנא בדוק את פרטי ההתחברות שלך ונסה שוב.")
      setAuthorizedUser(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFDF8",
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: "#FFFFFF",
            border: "1px solid #BFAF9B",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3, justifyContent: "center" }}>
              <IconButton onClick={() => navigate("/")} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" component="h1">
                התחברות
              </Typography>
            </Box>

            {success ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                התחברת בהצלחה! מעביר אותך לעמוד המתכונים...
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="שם משתמש"
                  {...register("UserName")}
                  error={!!errors.UserName}
                  helperText={errors.UserName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#BFAF9B" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="סיסמה"
                  type={showPassword ? "text" : "Password"}
                  {...register("Password")}
                  error={!!errors.Password}
                  helperText={errors.Password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#BFAF9B" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 4 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    position: "relative",
                    backgroundColor: "#F8C8DC",
                    color: "#4E342E",
                    "&:hover": {
                      backgroundColor: "#F0A5C0",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "התחברות"}
                </Button>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography variant="body2">
                    אין לך חשבון עדיין?{" "}
                    <Button
                      variant="text"
                      onClick={() => navigate("/signup")}
                      sx={{ color: "#C3B1E1", textTransform: "none" }}
                    >
                      הירשם עכשיו
                    </Button>
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
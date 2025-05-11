import { useState } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Container,
  Paper,
} from "@mui/material"
import { Person, Lock, Visibility, VisibilityOff, Email, Phone, Badge, ArrowBack } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import React from "react"

const schema = yup.object({
  Name: yup.string().required("שם הוא שדה חובה"),
  Password: yup.string().required("סיסמה היא שדה חובה"),
  UserName: yup.string().required("שם משתמש הוא שדה חובה"),
  Phone: yup.string().required("טלפון הוא שדה חובה"),
  Email: yup.string().email("כתובת המייל אינה חוקית").required("מייל הוא שדה חובה"),
  Tz: yup
    .string()
    .matches(/^[0-9]{1,9}$/, "תעודת זהות חייבת להכיל עד 9 ספרות")
    .required("תעודת זהות היא שדה חובה"),
})

// הסרנו את ה-props כי כעת זה דף עצמאי
export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: any) => {
    const formattedData = {
      UserName: data.UserName,
      Password: data.Password,
      Name: data.Name,
      Phone: data.Phone,
      Email: data.Email,
      Tz: data.Tz,
    }

    try {
      setLoading(true)
      setError(null)
      const response = await axios.post("http://localhost:8080/api/user/sighin", formattedData)
      setSuccess(true)

      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setError("ההרשמה נכשלה. אנא נסה שוב מאוחר יותר.")
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
      <Container maxWidth="md">
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
                הרשמה
              </Typography>
            </Box>

            {success ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                נרשמת בהצלחה! מעביר אותך לדף ההתחברות...
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="שם"
                      {...register("Name")}
                      error={!!errors.Name}
                      helperText={errors.Name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#BFAF9B" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="מייל"
                      {...register("Email")}
                      error={!!errors.Email}
                      helperText={errors.Email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "#BFAF9B" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="טלפון"
                      {...register("Phone")}
                      error={!!errors.Phone}
                      helperText={errors.Phone?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: "#BFAF9B" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="תעודת זהות"
                      {...register("Tz")}
                      error={!!errors.Tz}
                      helperText={errors.Tz?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge sx={{ color: "#BFAF9B" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    position: "relative",
                    mt: 3,
                    backgroundColor: "#F8C8DC",
                    color: "#4E342E",
                    "&:hover": {
                      backgroundColor: "#F0A5C0",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "הרשמה"}
                </Button>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography variant="body2">
                    כבר יש לך חשבון?{" "}
                    <Button
                      variant="text"
                      onClick={() => navigate("/login")}
                      sx={{ color: "#C3B1E1", textTransform: "none" }}
                    >
                      התחבר כאן
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
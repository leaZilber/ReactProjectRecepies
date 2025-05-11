import { useState, useEffect } from "react"
import { Box, Container, Paper, Typography, ThemeProvider, createTheme, Button } from "@mui/material"
import { Login as LoginIcon, HowToReg } from "@mui/icons-material"
import { Login } from "./login"
import { SignUp } from "./signIn"
import { UserProvider } from "./userModel"
import React from "react"

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
    h3: {
      fontWeight: 600,
      color: "#4E342E", 
      fontFamily: '"Playfair Display", serif',
    },
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
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 20,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#BFAF9B", 
              borderRadius: 8,
            },
            "&:hover fieldset": {
              borderColor: "#C3B1E1", 
            },
            "&.Mui-focused fieldset": {
              borderColor: "#C3B1E1", 
            },
          },
          "& .MuiInputLabel-root": {
            color: "#4E342E", 
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#C3B1E1", 
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#BFAF9B", 
          "&.Mui-checked": {
            color: "#C3B1E1", 
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
  },
  direction: "rtl",
})

const ConfettiAnimation = () => {
  const [confetti, setConfetti] = useState<JSX.Element[]>([])

  useEffect(() => {
    const createConfetti = () => {
   const pieces: JSX.Element[] = [];
      const colors = ["#FFFDF8", "#F8F5F0", "#F5F2EA", "#F2EFE5"]

      for (let i = 0; i < 50; i++) {
        const size = Math.random() * 10 + 5
        const x = Math.random() * 100
        const delay = Math.random() * 5
        const duration = Math.random() * 5 + 5
        const color = colors[Math.floor(Math.random() * colors.length)]

        pieces.push(
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: "2px",
              top: "-10%",
              left: `${x}%`,
              opacity: 1,
              animation: `fall ${duration}s ease-in infinite`,
              animationDelay: `${delay}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              zIndex: 0,
            }}
          />,
        )
      }
      setConfetti(pieces)
    }

    createConfetti()

    const style = document.createElement("style")
    style.innerHTML = `
            @keyframes fall {
                0% {
                    top: -10%;
                    transform: translateX(0) rotate(0deg);
                    opacity: 0.7;
                }
                50% {
                    transform: translateX(${Math.random() > 0.5 ? "+" : "-"}${Math.random() * 50}px) rotate(${Math.random() * 360}deg);
                    opacity: 0.5;
                }
                100% {
                    top: 100%;
                    transform: translateX(${Math.random() > 0.5 ? "+" : "-"}${Math.random() * 100}px) rotate(${Math.random() * 720}deg);
                    opacity: 0;
                }
            }
        `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <>{confetti}</>
}

export const HomePage = () => {
  const [formType, setFormType] = useState<"login" | "signup" | null>(null)

  return (
    <ThemeProvider theme={frenchBoutiqueTheme}>
      <UserProvider>
        <style>{`
                    html, body {
                        margin: 0;
                        padding: 0;
                        overflow-x: hidden;
                        Overflow-y: hidden;
                        width: 100%;
                        height: 100%;
                        background-color: #FFFDF8;
                    }
                    #__next {
                        width: 100%;
                        height: 100%;
                    }
                `}</style>

        <Box
          sx={{
            minHeight: "100vh",
            width: "100%",
            backgroundColor: "#FFFDF8", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            direction: "rtl",
            position: "relative",
            overflow: "hidden", 
            padding: 0,
            margin: 0,
          }}
        >
          <ConfettiAnimation />

          <Container
            maxWidth="sm"
            sx={{
              position: "relative",
              zIndex: 1,
              py: 4,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                zIndex: 2,
              }}
            >
              {!formType ? (
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3, color: "#C3B1E1" }}>
                    Welcome to Recipe Site
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                    <Typography variant="h5" component="p" sx={{ color: "#4E342E" }}>
                      אנו שמחים לראות אותך כאן!
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 200, mx: "auto" }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<LoginIcon />}
                      onClick={() => setFormType("login")}
                      sx={{ fontSize: "1.1rem" }}
                    >
                      התחברות
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<HowToReg />}
                      onClick={() => setFormType("signup")}
                      sx={{
                        fontSize: "1.1rem",
                        borderColor: "#F8C8DC",
                        color: "#4E342E",
                        "&:hover": {
                          borderColor: "#C3B1E1",
                          backgroundColor: "rgba(195, 177, 225, 0.1)",
                        },
                      }}
                    >
                      הרשמה
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  {formType === "login" && <Login onBackClick={() => setFormType(null)} />}
                  {formType === "signup" && <SignUp onBackClick={() => setFormType(null)} />}
                </>
              )}
            </Paper>
          </Container>
        </Box>
      </UserProvider>
    </ThemeProvider>
  )
}

export default HomePage

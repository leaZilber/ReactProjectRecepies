// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Box, CircularProgress, Typography } from "@mui/material"
// import { AddRecipeForm, type Recipe } from "../../../add-recipe-form"
// import axios from "axios"
// import React from "react"

// export default function EditRecipePage() {
//   const params = useParams()
//   const router = useRouter()
//   const [recipe, setRecipe] = useState<Recipe | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchRecipe = async () => {
//       if (!params.id) {
//         setError("מזהה מתכון חסר")
//         setLoading(false)
//         return
//       }

//       try {
//         setLoading(true)
//         const response = await axios.get(`http://localhost:8080/api/recipe/${params.id}`)
//         setRecipe(response.data)
//       } catch (err: any) {
//         console.error("Error fetching recipe:", err)
//         setError(err.response?.data || err.message || "אירעה שגיאה בטעינת המתכון")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRecipe()
//   }, [params.id])

//   const handleRecipeUpdated = () => {
//     // Navigate back to recipes page after successful update
//     router.push("/allrecipes")
//   }

//   const handleRecipeDeleted = () => {
//     // Navigate back to recipes page after successful delete
//     router.push("/allrecipes")
//   }

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//           backgroundColor: "#FFFDF8",
//         }}
//       >
//         <CircularProgress size={60} sx={{ color: "#C3B1E1", mb: 3 }} />
//         <Typography variant="h6" sx={{ color: "#4E342E" }}>
//           טוען את המתכון...
//         </Typography>
//       </Box>
//     )
//   }

//   if (error) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//           backgroundColor: "#FFFDF8",
//           p: 3,
//         }}
//       >
//         <Typography variant="h5" sx={{ color: "#4E342E", mb: 2, textAlign: "center" }}>
//           לא ניתן לטעון את המתכון
//         </Typography>
//         <Typography variant="body1" sx={{ color: "#4E342E", textAlign: "center" }}>
//           {error}
//         </Typography>
//         <Box sx={{ mt: 4 }}>
//           <button
//             onClick={() => router.push("/allrecipes")}
//             style={{
//               backgroundColor: "#F8C8DC",
//               color: "#4E342E",
//               border: "none",
//               borderRadius: "30px",
//               padding: "10px 20px",
//               cursor: "pointer",
//               fontWeight: "bold",
//             }}
//           >
//             חזרה לעמוד המתכונים
//           </button>
//         </Box>
//       </Box>
//     )
//   }

//   return (
//     <AddRecipeForm
//       editMode={true}
//       recipeToEdit={recipe}
//       onRecipeUpdated={handleRecipeUpdated}
//       onRecipeDeleted={handleRecipeDeleted}
//     />
//   )
// }

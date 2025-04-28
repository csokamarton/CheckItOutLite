import React from "react";
import { NavigateFunction } from "react-router-dom";
import "./css/Login.css";
import ViewComponent from "../interfaces/ViewComponent";
import { FaCheckCircle, FaClock, FaListUl, FaBell } from "react-icons/fa";
import { Box, Container, Typography, Button, Grid, Paper, Stack } from "@mui/material";
const features = [
    {
        icon: <FaCheckCircle size={32} color="#1976d2" />,
        title: "Egyszerű használat",
        description: "Intuitív felület, ami segít gyorsan és hatékonyan kezelni a feladataidat."
    },
    {
        icon: <FaListUl size={32} color="#1976d2" />,
        title: "Személyre szabható",
        description: "Alakítsd az alkalmazást a saját igényeidhez, készíts egyedi listákat."
    },
    {
        icon: <FaClock size={32} color="#1976d2" />,
        title: "Időmegtakarítás",
        description: "Rendszerezett feladatkezelés, hogy több időd maradjon a fontos dolgokra."
    },
    {
        icon: <FaBell size={32} color="#1976d2" />,
        title: "Emlékeztetők",
        description: "Soha ne maradj le egy határidőről sem az intelligens értesítéseknek köszönhetően."
    }
];
export default class Landing implements ViewComponent {
    constructor(public navigate: NavigateFunction) { }

    View = () => (
        <Box sx={{ bgcolor: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
            <Container maxWidth="lg" sx={{ py: 10 }}>
                {}
                <Box textAlign="center" mb={6}>
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        sx={{
                            background: "linear-gradient(to right, #1976d2, #00bcd4)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontSize:{
                                xs: "2rem",
                                sm: "3.75rem"
                            }
                        }}
                        gutterBottom
                    >
                        Üdvözlünk a CheckItOut alkalmazásban!
                    </Typography>
                    <Typography variant="h6" color="textSecondary" maxWidth="md" mx="auto" mb={4}>
                        Egyszerűsítsd le az életed és növeld a produktivitásod egy modern feladatkezelő alkalmazással.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ px: 5, background: "linear-gradient(to right, #1976d2, #00bcd4)" }}
                        onClick={() => this.navigate("/login")}
                    >
                        Folytatom, ahol abba hagytam
                    </Button>
                </Box>

                {/* Features Section */}
                <Box textAlign="center" mb={8}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Miért válaszd a CheckItOut-ot?
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper elevation={4} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                                    <Box mb={2}>{feature.icon}</Box>
                                    <Typography variant="h6" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Call to Action */}
                <Box
                    textAlign="center"
                    sx={{
                        background: "linear-gradient(to right, #1976d2, #00bcd4)",
                        color: "#fff",
                        p: 5,
                        borderRadius: 5
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Készen állsz a hatékonyabb munkavégzésre?
                    </Typography>
                    <Typography variant="body1" mb={3}>
                        Csatlakozz most, és tapasztald meg a rendszerezett feladatkezelés előnyeit!
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ backgroundColor: "#fff", color: "#1976d2", '&:hover': { backgroundColor: "#f0f0f0" } }}
                        onClick={() => this.navigate("/register")}
                    >
                        Regisztrálj most
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

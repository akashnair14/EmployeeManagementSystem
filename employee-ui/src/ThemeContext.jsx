import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ColorModeContext = createContext({ toggleColorMode: () => { } });

// eslint-disable-next-line react-refresh/only-export-components
export const useColorMode = () => useContext(ColorModeContext);

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(localStorage.getItem("themeMode") || "dark");

    useEffect(() => {
        localStorage.setItem("themeMode", mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: mode === "dark" ? "#60a5fa" : "#3b82f6", // Calm Blue
                        contrastText: "#ffffff",
                    },
                    secondary: {
                        main: "#8b5cf6", // Soft Purple
                    },
                    background: {
                        default: mode === "dark" ? "#0f172a" : "#f8fafc",
                        paper: mode === "dark" ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.6)",
                    },
                    text: {
                        primary: mode === "dark" ? "#f1f5f9" : "#1e293b", // Slate 100 / Slate 800
                        secondary: mode === "dark" ? "#94a3b8" : "#64748b", // Slate 400 / Slate 500
                    },
                    action: {
                        hover: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                        selected: mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                    },
                },
                shape: {
                    borderRadius: 16,
                },
                typography: {
                    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
                    h3: { fontWeight: 800, letterSpacing: "-0.02em" },
                    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
                    h5: { fontWeight: 600, letterSpacing: "0em" },
                    h6: { fontWeight: 600 },
                    subtitle1: { fontWeight: 500, lineHeight: 1.5 },
                    body1: { lineHeight: 1.6 },
                    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                backgroundImage: mode === "dark"
                                    ? "radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15), transparent 25%)"
                                    : "radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%)",
                                backgroundColor: mode === "dark" ? "#0f172a" : "#f8fafc", // Fallback
                                backgroundAttachment: "fixed",
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backdropFilter: "blur(20px) saturate(180%)",
                                borderRadius: 24,
                                border: mode === "dark"
                                    ? "1px solid rgba(255, 255, 255, 0.08)"
                                    : "1px solid rgba(255, 255, 255, 0.6)",
                                boxShadow: mode === "dark"
                                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                                    : "0 20px 40px -12px rgba(12, 74, 110, 0.08)",
                                backgroundImage: "none",
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                background: mode === "dark"
                                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)"
                                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%)",
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 12,
                                padding: "10px 24px",
                                boxShadow: "none",
                                transition: "all 0.2s ease-in-out",
                            },
                            containedPrimary: {
                                background: mode === "dark"
                                    ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                    : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                boxShadow: "0 10px 20px -10px rgba(37, 99, 235, 0.5)",
                                "&:hover": {
                                    boxShadow: "0 15px 30px -10px rgba(37, 99, 235, 0.6)",
                                    transform: "translateY(-2px)",
                                },
                            },
                            outlined: {
                                borderWidth: "1.5px",
                                "&:hover": { borderWidth: "1.5px" },
                            },
                        },
                    },
                    MuiTableCell: {
                        styleOverrides: {
                            root: {
                                borderBottom: mode === "dark"
                                    ? "1px solid rgba(255, 255, 255, 0.06)"
                                    : "1px solid rgba(148, 163, 184, 0.1)",
                                padding: "20px 24px",
                            },
                            head: {
                                fontWeight: 600,
                                textTransform: "uppercase",
                                fontSize: "0.75rem",
                                letterSpacing: "0.05em",
                                color: mode === "dark" ? "#94a3b8" : "#64748b",
                                backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.5)" : "rgba(241, 245, 249, 0.5)",
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.5)",
                                    transition: "all 0.2s",
                                    "& fieldset": {
                                        borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
                                    },
                                    "&:hover": {
                                        backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.8)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderWidth: "1px",
                                        borderColor: "#3b82f6",
                                    },
                                },
                            },
                        },
                    },
                    MuiChip: {
                        styleOverrides: {
                            root: {
                                fontWeight: 600,
                                borderRadius: 8,
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ColorModeContext.Provider>
    );
};
